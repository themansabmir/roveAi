import { WebsiteFilter } from "@prisma/client";
import { BadRequestError, NotFoundError } from "@core/errors";
import { IQueueService } from "@plugins/queue/queue.types";
import { hostOf } from "./normalize";
import { CampaignDetail, CampaignRepository, CampaignSummary } from "./campaign.repository";
import { CreateCampaignInput } from "./campaign.schemas";
import { JobDispatcher } from "@features/jobs/job-dispatcher";

export class CampaignService {
  private readonly dispatcher: JobDispatcher;

  constructor(
    private readonly repository: CampaignRepository,
    queue: IQueueService
  ) {
    this.dispatcher = new JobDispatcher(repository.prisma, queue);
  }

  list(organizationId: string): Promise<CampaignSummary[]> {
    return this.repository.list(organizationId);
  }

  async get(organizationId: string, campaignId: string): Promise<CampaignDetail> {
    const campaign = await this.repository.getDetail(organizationId, campaignId);
    if (!campaign) throw new NotFoundError("Campaign not found");
    return campaign;
  }

  async create(organizationId: string, input: CreateCampaignInput): Promise<CampaignDetail> {
    const exclusionDomains = normalizeExclusions(input.exclusionDomains ?? []);
    return this.repository.create({
      organizationId,
      niche: input.niche,
      serviceType: input.serviceType,
      city: input.city,
      region: input.region,
      country: input.country,
      maxLeads: input.maxLeads,
      minRating: input.minRating ?? null,
      minReviewCount: input.minReviewCount ?? null,
      websiteFilter: toFilter(input.websiteFilter ?? "either"),
      exclusionDomains,
    });
  }

  async run(organizationId: string, campaignId: string): Promise<CampaignDetail> {
    console.log(`[CampaignService.run] 🎯 Initiating run for campaignId: ${campaignId}`);
    const existing = await this.get(organizationId, campaignId);
    const claim = await this.repository.claimRun(organizationId, campaignId);
    if (claim === "missing") throw new NotFoundError("Campaign not found");
    if (claim === "busy") {
      console.log(`[CampaignService.run] ⚠️ Campaign ${campaignId} is already running (${existing.status})`);
      return this.get(organizationId, campaignId);
    }
    console.log(`[CampaignService.run] ✅ Claimed campaign run. Campaign status -> QUEUED`);

    const [used, limit] = await Promise.all([
      this.repository.mapsUsedThisMonth(organizationId),
      this.repository.mapsRecordLimit(organizationId),
    ]);
    console.log(`[CampaignService.run] 📊 Maps quota check: ${used} used + ${existing.maxLeads} requested <= ${limit} limit`);
    if (used + existing.maxLeads > limit) {
      await this.repository.setCampaignStatus(campaignId, existing.status);
      throw new BadRequestError("This run would exceed the monthly Maps record ceiling.");
    }

    const job = await this.repository.createJob(campaignId, organizationId);
    console.log(`[CampaignService.run] 📋 Created Job row (id: ${job.id}, kind: DISCOVER, status: PENDING)`);

    console.log(`[CampaignService.run] 📤 Dispatching DISCOVER job via JobDispatcher (id: ${job.id})`);
    await this.dispatcher.dispatchJob(job.id);
    return this.get(organizationId, campaignId);
  }

  async cancel(organizationId: string, campaignId: string): Promise<CampaignDetail> {
    const campaign = await this.repository.cancel(organizationId, campaignId);
    if (!campaign) throw new NotFoundError("Campaign not found");
    return campaign;
  }
}

function toFilter(value: "owned" | "missing" | "either"): WebsiteFilter {
  if (value === "owned") return "OWNED";
  if (value === "missing") return "MISSING";
  return "EITHER";
}

function normalizeExclusions(values: string[]): string[] {
  const seen = new Set<string>();
  const domains: string[] = [];
  for (const value of values) {
    const domain = hostOf(value);
    if (!domain || seen.has(domain)) continue;
    seen.add(domain);
    domains.push(domain);
  }
  return domains;
}
