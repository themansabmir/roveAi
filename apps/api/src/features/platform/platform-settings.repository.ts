import { DiscoveryProvider, PrismaClient } from "@prisma/client";

const PLATFORM_SETTING_ID = "platform";

export class PlatformSettingsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /** Reads the current default discovery provider, seeding the row if absent. */
  async getDiscoveryProvider(fallback: DiscoveryProvider): Promise<DiscoveryProvider> {
    const row = await this.prisma.platformSetting.upsert({
      where: { id: PLATFORM_SETTING_ID },
      update: {},
      create: { id: PLATFORM_SETTING_ID, discoveryProvider: fallback },
      select: { discoveryProvider: true },
    });
    return row.discoveryProvider;
  }

  async setDiscoveryProvider(
    provider: DiscoveryProvider,
    updatedByUserId: string
  ): Promise<DiscoveryProvider> {
    const row = await this.prisma.platformSetting.upsert({
      where: { id: PLATFORM_SETTING_ID },
      update: { discoveryProvider: provider, updatedByUserId },
      create: { id: PLATFORM_SETTING_ID, discoveryProvider: provider, updatedByUserId },
      select: { discoveryProvider: true },
    });
    return row.discoveryProvider;
  }
}
