import { IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "@core/config";
import { IFetchService, FETCH_PLUGIN } from "@plugins/fetch/fetch.plugin";
import { IMapsService, MAPS_PLUGIN } from "@plugins/maps/maps.plugin";
import { IPagespeedService, PAGESPEED_PLUGIN } from "@plugins/pagespeed/pagespeed.plugin";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { IQueueService, QUEUE_PLUGIN } from "@plugins/queue/queue.types";
import { CRAWL_QUEUE, DiscoverPayload, PSI_QUEUE, AuditJobPayload } from "@plugins/queue/queue.types";
import { IStorageService, STORAGE_PLUGIN } from "@plugins/storage/storage.plugin";
import { CampaignRepository, DISCOVER_QUEUE } from "@features/campaigns/campaign.repository";
import { DiscoveryService } from "@features/campaigns/discovery.service";
import { AuditScheduler } from "./audit-scheduler";
import { CrawlService } from "./crawl.service";
import { PsiService } from "./psi.service";

export interface AuditHandlers {
  discover(payload: DiscoverPayload, meta: { retrycount: number; retrylimit: number }): Promise<void>;
  crawl(payload: AuditJobPayload, meta: { retrycount: number; retrylimit: number }): Promise<void>;
  psi(payload: AuditJobPayload, meta: { retrycount: number; retrylimit: number }): Promise<void>;
}

export function buildAuditHandlers(pluginRegistry: IPluginRegistry): AuditHandlers {
  const config = loadConfig();
  const prisma = pluginRegistry.get<IPrismaService>(PRISMA_PLUGIN).client;
  const queue = pluginRegistry.get<IQueueService>(QUEUE_PLUGIN);
  const maps = pluginRegistry.get<IMapsService>(MAPS_PLUGIN);
  const fetcher = pluginRegistry.get<IFetchService>(FETCH_PLUGIN);
  const storage = pluginRegistry.get<IStorageService>(STORAGE_PLUGIN);
  const pagespeed = pluginRegistry.get<IPagespeedService>(PAGESPEED_PLUGIN);
  const scheduler = new AuditScheduler(prisma, queue, config.CRAWL_MAX_PAGES);
  const discovery = new DiscoveryService(new CampaignRepository(prisma), maps, scheduler);
  const crawl = new CrawlService(prisma, fetcher, storage, queue, {
    maxPages: config.CRAWL_MAX_PAGES,
    jobTimeoutMs: config.JOB_TIMEOUT_MS,
  });
  const psi = new PsiService(prisma, pagespeed, storage, queue, config.JOB_TIMEOUT_MS);

  return {
    discover: (payload, meta) => discovery.run(payload.campaignId, payload.jobId, meta),
    crawl: (payload, meta) => crawl.run(payload, meta),
    psi: (payload, meta) => psi.run(payload, meta),
  };
}

export async function subscribeAuditRole(
  pluginRegistry: IPluginRegistry,
  role: "discover" | "crawl" | "psi"
): Promise<void> {
  const queue = pluginRegistry.get<IQueueService>(QUEUE_PLUGIN);
  const handlers = buildAuditHandlers(pluginRegistry);
  const config = loadConfig();
  if (role === "discover") {
    await queue.subscribe<DiscoverPayload>(DISCOVER_QUEUE, async (payload, _jobId, meta) => {
      await handlers.discover(payload, meta);
    }, { localConcurrency: config.WORKER_CONCURRENCY });
    return;
  }
  if (role === "crawl") {
    await queue.subscribe<AuditJobPayload>(CRAWL_QUEUE, async (payload, _jobId, meta) => {
      await handlers.crawl(payload, meta);
    }, { localConcurrency: config.WORKER_CONCURRENCY });
    return;
  }
  await queue.subscribe<AuditJobPayload>(PSI_QUEUE, async (payload, _jobId, meta) => {
    await handlers.psi(payload, meta);
  }, { localConcurrency: 1 });
}
