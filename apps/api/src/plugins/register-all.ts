import { IPluginRegistry } from "../interfaces/plugin.interface";
import { FetchPlugin } from "./fetch/fetch.plugin";
import { MapsPlugin } from "./maps/maps.plugin";
import { PagespeedPlugin } from "./pagespeed/pagespeed.plugin";
import { PrismaPlugin } from "./prisma/prisma.plugin";
import { createQueuePlugin } from "./queue/queue.plugin";
import { StoragePlugin } from "./storage/storage.plugin";

export async function registerAllPlugins(registry: IPluginRegistry): Promise<void> {
  await registry.register(new PrismaPlugin());
  await registry.register(createQueuePlugin());
  await registry.register(new MapsPlugin());
  await registry.register(new FetchPlugin());
  await registry.register(new StoragePlugin());
  await registry.register(new PagespeedPlugin());
}
