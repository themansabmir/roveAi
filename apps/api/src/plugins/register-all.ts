import { IPluginRegistry } from "../interfaces/plugin.interface";
import { MapsPlugin } from "./maps/maps.plugin";
import { PrismaPlugin } from "./prisma/prisma.plugin";
import { PgBossPlugin } from "./queue/pgboss.plugin";

export async function registerAllPlugins(registry: IPluginRegistry): Promise<void> {
  await registry.register(new PrismaPlugin());
  await registry.register(new PgBossPlugin());
  await registry.register(new MapsPlugin());
}
