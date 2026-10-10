import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";

export const PRISMA_PLUGIN = "PrismaPlugin";

export interface IPrismaService extends IPlugin {
  client: PrismaClient;
  isHealthy(): Promise<boolean>;
}

export class PrismaPlugin implements IPrismaService {
  public name = PRISMA_PLUGIN;
  public client!: PrismaClient;

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
    this.client = new PrismaClient({ adapter });
    await this.client.$connect();
    logger.info("Prisma connected");
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (err) {
      logger.error({ err }, "Prisma health check failed");
      return false;
    }
  }

  async shutdown(): Promise<void> {
    await this.client.$disconnect();
    logger.info("Prisma disconnected");
  }
}
