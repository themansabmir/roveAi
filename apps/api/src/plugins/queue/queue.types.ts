import { IPlugin } from "../../interfaces/plugin.interface";

export const QUEUE_PLUGIN = "QueuePlugin";

export const DISCOVER_QUEUE = "campaign.discover";
export const CRAWL_QUEUE = "audit.crawl";
export const PSI_QUEUE = "audit.psi";
export const AUDIT_READY_QUEUE = "audit.ready";

export type JobHandler<T> = (
  payload: T,
  jobId: string,
  meta: { retrycount: number; retrylimit: number }
) => Promise<void>;

export interface IQueueService extends IPlugin {
  publish<T extends object>(
    queue: string,
    payload: T,
    opts?: { singletonKey?: string }
  ): Promise<string | null>;
  subscribe<T>(queue: string, handler: JobHandler<T>, opts?: { localConcurrency?: number }): Promise<void>;
  isHealthy(): boolean;
}

export interface DiscoverPayload {
  campaignId: string;
  jobId: string;
}

/** Ids only. HTML and PageSpeed JSON stay in object storage. */
export interface AuditJobPayload {
  organizationId: string;
  campaignId: string;
  leadId: string;
  businessId: string;
  jobId: string;
  url: string;
}
