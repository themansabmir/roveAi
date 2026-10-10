import { IPluginRegistry } from "../../interfaces/plugin.interface";
import { IMapsService, MAPS_PLUGIN } from "@plugins/maps/maps.plugin";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { IQueueService, QUEUE_PLUGIN } from "@plugins/queue/pgboss.plugin";
import { CampaignRepository, DISCOVER_QUEUE } from "./campaign.repository";
import { DiscoveryService } from "./discovery.service";

export interface DiscoverPayload {
  campaignId: string;
  jobId: string;
}

export async function registerCampaignWorker(pluginRegistry: IPluginRegistry): Promise<void> {
  const prisma = pluginRegistry.get<IPrismaService>(PRISMA_PLUGIN).client;
  const maps = pluginRegistry.get<IMapsService>(MAPS_PLUGIN);
  const queue = pluginRegistry.get<IQueueService>(QUEUE_PLUGIN);
  const discovery = new DiscoveryService(new CampaignRepository(prisma), maps);

  await queue.subscribe<DiscoverPayload>(DISCOVER_QUEUE, async (payload, _jobId, meta) => {
    await discovery.run(payload.campaignId, payload.jobId, meta);
  });
}
