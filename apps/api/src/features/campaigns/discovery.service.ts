import { AuditStatus, QualificationStatus, WebsiteClass } from "@prisma/client";
import { MapsBusiness, MapsProvider, MapsQuotaError } from "@plugins/maps/maps.types";
import { logger } from "@core/logger";
import { CampaignRepository, DiscoveryCampaign } from "./campaign.repository";
import { classifyWebsite, exclusionMatches, normalizeName, normalizePhone } from "./normalize";
import { expandQueries } from "./queries";

export class DiscoveryService {
  constructor(
    private readonly repository: CampaignRepository,
    private readonly maps: MapsProvider
  ) {}

  async run(
    campaignId: string,
    jobId: string,
    meta: { retrycount: number; retrylimit: number }
  ): Promise<void> {
    const ready = await this.repository.beginJob(jobId);
    if (ready === "done") return;

    const campaign = await this.repository.loadForDiscovery(campaignId);
    if (!campaign) {
      await this.repository.setJobStatus(jobId, "FAILED");
      return;
    }
    if (campaign.status === "CANCELLED") {
      await this.repository.setJobStatus(jobId, "CANCELLED");
      return;
    }

    const started = await this.repository.markDiscovering(campaignId);
    if (!started) {
      await this.repository.setJobStatus(jobId, "CANCELLED");
      return;
    }

    let saved = await this.repository.countLeads(campaignId);
    const queries = expandQueries(campaign);

    try {
      for (const query of queries) {
        const status = await this.repository.campaignStatus(campaignId);
        if (status === "CANCELLED" || status == null) {
          await this.repository.setJobStatus(jobId, "CANCELLED");
          return;
        }
        if (saved >= campaign.maxLeads) break;

        const rows = await this.search(campaign, query, campaign.maxLeads - saved, saved, jobId, meta);
        if (rows == null) return;

        for (const row of rows) {
          if (saved >= campaign.maxLeads) break;
          const inserted = await this.ingest(campaign, row);
          if (inserted) saved += 1;
        }
      }
    } catch (err) {
      if (saved > 0) {
        await this.repository.setCampaignStatus(campaignId, "PAUSED");
        await this.repository.setJobStatus(jobId, "COMPLETED");
        logger.warn({ err, campaignId }, "Discovery stopped after saving leads");
        return;
      }
      if (meta.retrycount >= meta.retrylimit) {
        await this.repository.setCampaignStatus(campaignId, "FAILED");
        await this.repository.setJobStatus(jobId, "FAILED");
        logger.error({ err, campaignId }, "Discovery failed before any lead was saved");
        return;
      }
      throw err;
    }

    const status = await this.repository.campaignStatus(campaignId);
    if (status === "DISCOVERING") {
      await this.repository.setCampaignStatus(campaignId, "COMPLETED");
    }
    await this.repository.setJobStatus(jobId, "COMPLETED");
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
        logger.warn({ err, campaignId: campaign.id }, "Discovery paused");
        return null;
      }
      if (meta.retrycount >= meta.retrylimit) {
        await this.repository.setCampaignStatus(campaign.id, "FAILED");
        await this.repository.setJobStatus(jobId, "FAILED");
        logger.error({ err, campaignId: campaign.id }, "Discovery failed before any lead was saved");
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
