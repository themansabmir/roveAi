import { AuditStatus, QualificationStatus, WebsiteClass } from "@prisma/client";
import { MapsBusiness, MapsProvider, MapsQuotaError } from "@plugins/maps/maps.types";
import { AuditScheduler } from "@features/audits/audit-scheduler";
import { CampaignRepository, DiscoveryCampaign } from "./campaign.repository";
import { classifyWebsite, exclusionMatches, normalizeName, normalizePhone } from "./normalize";
import { expandQueries } from "./queries";

export class DiscoveryService {
  constructor(
    private readonly repository: CampaignRepository,
    private readonly maps: MapsProvider,
    private readonly audits: AuditScheduler
  ) { }

  async run(
    campaignId: string,
    jobId: string,
    meta: { retrycount: number; retrylimit: number }
  ): Promise<void> {
    console.log(`[DiscoveryService.run] 🚀 Discovery started for campaign ${campaignId}, jobId: ${jobId}`);

    const ready = await this.repository.beginJob(jobId);
    console.log(`[DiscoveryService.run] 🔒 beginJob status: "${ready}" for jobId: ${jobId}`);

    if (ready !== "ready") return;

    try {
      await this.discover(campaignId, jobId, meta);
    } catch (err) {
      await this.repository.releaseJob(jobId);
      throw err;
    }
  }

  private async discover(
    campaignId: string,
    jobId: string,
    meta: { retrycount: number; retrylimit: number }
  ): Promise<void> {
    const campaign = await this.repository.loadForDiscovery(campaignId);
    if (!campaign) {
      console.log(`[DiscoveryService.discover] ❓ Campaign ${campaignId} not found`);
      await this.repository.setJobStatus(jobId, "FAILED");
      return;
    }
    if (campaign.status === "CANCELLED") {
      console.log(`[DiscoveryService.discover] 🛑 Campaign ${campaignId} is cancelled`);
      await this.repository.setJobStatus(jobId, "CANCELLED");
      return;
    }

    console.log(`[DiscoveryService.discover] 📦 Loaded campaign "${campaign.niche}" in "${campaign.city}" (maxLeads: ${campaign.maxLeads})`);

    const started = await this.repository.markDiscovering(campaignId);
    if (!started) {
      await this.repository.setJobStatus(jobId, "CANCELLED");
      return;
    }
    console.log(`[DiscoveryService.discover] 🔄 Campaign status -> DISCOVERING`);

    let saved = await this.repository.countLeads(campaignId);
    const queries = expandQueries(campaign);
    console.log(`[DiscoveryService.discover] 🔎 Generated ${queries.length} query variations: ${JSON.stringify(queries)}`);

    try {
      for (const query of queries) {
        const status = await this.repository.campaignStatus(campaignId);
        if (status === "CANCELLED" || status == null) {
          console.log(`[DiscoveryService.discover] 🛑 Campaign cancelled while querying`);
          await this.repository.setJobStatus(jobId, "CANCELLED");
          return;
        }
        if (saved >= campaign.maxLeads) {
          console.log(`[DiscoveryService.discover] 🎯 Target maxLeads reached (${saved}/${campaign.maxLeads})`);
          break;
        }

        console.log(`[DiscoveryService.discover] 🌐 Searching Maps provider for: "${query}" (need ${campaign.maxLeads - saved} more)`);
        const rows = await this.search(campaign, query, campaign.maxLeads - saved, saved, jobId, meta);
        if (rows == null) return;
        console.log(`[DiscoveryService.discover] 📍 Maps provider returned ${rows.length} results`);

        for (const row of rows) {
          if (saved >= campaign.maxLeads) break;
          const inserted = await this.ingest(campaign, row);
          if (inserted) {
            saved += 1;
            console.log(`[DiscoveryService.ingest] ✅ Saved lead #${saved}: "${row.name}" (${row.websiteUrl ?? "No website"})`);
          }
        }
      }
    } catch (err) {
      if (saved > 0) {
        await this.repository.setCampaignStatus(campaignId, "PAUSED");
        await this.repository.setJobStatus(jobId, "COMPLETED");
        console.warn(`[DiscoveryService.discover] ⚠️ Discovery paused after saving ${saved} leads:`, err);
        return;
      }
      if (meta.retrycount >= meta.retrylimit) {
        await this.repository.setCampaignStatus(campaignId, "FAILED");
        await this.repository.setJobStatus(jobId, "FAILED");
        console.error(`[DiscoveryService.discover] ❌ Discovery failed before saving leads:`, err);
        return;
      }
      throw err;
    }

    console.log(`[DiscoveryService.discover] 🏁 Discovery finished with ${saved}/${campaign.maxLeads} leads saved.`);
    const status = await this.repository.campaignStatus(campaignId);
    if (status === "DISCOVERING") {
      console.log(`[DiscoveryService.discover] ⏩ Handoff: Triggering AuditScheduler.schedule(${campaignId})`);
      await this.audits.schedule(campaignId);
    }
    await this.repository.setJobStatus(jobId, "COMPLETED");
    console.log(`[DiscoveryService.discover] ✨ DISCOVER Job ${jobId} status -> COMPLETED`);
  }

  private async search(
    campaign: DiscoveryCampaign,
    query: string,
    limit: number,
    saved: number,
    jobId: string,
    meta: { retrycount: number; retrylimit: number }
  ): Promise<MapsBusiness[] | null> {
    try {
      return await this.maps.search({ query, limit });
    } catch (err) {
      if (err instanceof MapsQuotaError || saved > 0) {
        await this.repository.setCampaignStatus(campaign.id, "PAUSED");
        await this.repository.setJobStatus(jobId, "COMPLETED");
        console.warn({ err, campaignId: campaign.id }, "Discovery paused");
        return null;
      }
      if (meta.retrycount >= meta.retrylimit) {
        await this.repository.setCampaignStatus(campaign.id, "FAILED");
        await this.repository.setJobStatus(jobId, "FAILED");
        console.error({ err, campaignId: campaign.id }, "Discovery failed before any lead was saved");
        return null;
      }
      throw err;
    }
  }

  private async ingest(campaign: DiscoveryCampaign, row: MapsBusiness): Promise<boolean> {
    const name = row.name.trim();
    const providerId = row.providerId.trim();
    if (!name || !providerId) return false;

    const websiteClass = classifyWebsite(row.websiteUrl);
    if (!passesFilters(campaign, row, websiteClass)) return false;

    const excluded = exclusionMatches(row.websiteUrl, campaign.exclusionDomains);
    const qualificationStatus: QualificationStatus = excluded ? "EXCLUDED_EXISTING_CLIENT" : "NEW";
    const auditStatus: AuditStatus = auditForClass(websiteClass);
    const city = (row.city ?? campaign.city).trim();

    return this.repository.saveLead({
      organizationId: campaign.organizationId,
      campaignId: campaign.id,
      providerId,
      name,
      normalizedName: normalizeName(name),
      phone: row.phone,
      normalizedPhone: normalizePhone(row.phone),
      address: row.address,
      city: city || null,
      identityCity: city ? city.toLowerCase() : null,
      region: row.region,
      country: row.country,
      rating: row.rating,
      reviewCount: row.reviewCount,
      websiteUrl: row.websiteUrl,
      websiteClass,
      qualificationStatus,
      auditStatus,
    });
  }
}

function passesFilters(campaign: DiscoveryCampaign, row: MapsBusiness, websiteClass: WebsiteClass): boolean {
  if (campaign.minRating != null && (row.rating == null || row.rating < campaign.minRating)) return false;
  if (campaign.minReviewCount != null && (row.reviewCount == null || row.reviewCount < campaign.minReviewCount)) {
    return false;
  }
  if (campaign.websiteFilter === "OWNED" && websiteClass !== "OWNED_SITE") return false;
  if (campaign.websiteFilter === "MISSING" && websiteClass !== "MISSING") return false;
  return true;
}

function auditForClass(websiteClass: WebsiteClass): AuditStatus {
  if (websiteClass === "MISSING") return "SKIPPED_NO_WEBSITE";
  if (websiteClass !== "OWNED_SITE") return "SKIPPED_NOT_OWNED_SITE";
  return "PENDING";
}