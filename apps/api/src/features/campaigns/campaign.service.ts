import { WebsiteFilter } from "@prisma/client";
import { BadRequestError, NotFoundError } from "@core/errors";
import { IQueueService } from "@plugins/queue/pgboss.plugin";
import { hostOf } from "./normalize";
import { CampaignDetail, CampaignRepository, CampaignSummary, DISCOVER_QUEUE } from "./campaign.repository";
import { CreateCampaignInput } from "./campaign.schemas";

export class CampaignService {
  constructor(
    private readonly repository: CampaignRepository,
    private readonly queue: IQueueService
  ) { }

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
    const existing = await this.get(organizationId, campaignId);
    const claim = await this.repository.claimRun(organizationId, campaignId);
    if (claim === "missing") throw new NotFoundError("Campaign not found");
    if (claim === "busy") return this.get(organizationId, campaignId);

    const [used, limit] = await Promise.all([
      this.repository.mapsUsedThisMonth(organizationId),
      this.repository.mapsRecordLimit(organizationId),
    ]);
    if (used + existing.maxLeads > limit) {
      await this.repository.setCampaignStatus(campaignId, existing.status);
      throw new BadRequestError("This run would exceed the monthly Maps record ceiling.");
    }

    const job = await this.repository.createJob(campaignId, organizationId);

    console.log("📤 Publishing DISCOVER_QUEUE job");
    const queueJobId = await this.queue.publish(
      DISCOVER_QUEUE,
      { campaignId, jobId: job.id },
      { singletonKey: `discover:${campaignId}` }
    );

    if (queueJobId) {
      await this.repository.setQueueJobId(job.id, queueJobId);

      console.log("Stored Queue job in db")
    }
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
