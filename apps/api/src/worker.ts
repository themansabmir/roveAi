import "dotenv/config";
import { registry } from "@core/registry";
import { logger } from "./core/logger";
import { registerCampaignWorker } from "@features/campaigns/campaign.worker";
import { registerAllPlugins } from "@plugins/register-all";

async function main(): Promise<void> {
  await registerAllPlugins(registry);
  await registerCampaignWorker(registry);
  logger.info("LocalBrief worker ready");

  const shutdown = async () => {
    logger.info("Worker shutdown initiated");
    await registry.shutdownAll();
    process.exit(0);
  };
  process.once("SIGTERM", () => {
    void shutdown();
  });
  process.once("SIGINT", () => {
    void shutdown();
  });
}

main().catch((err) => {
  logger.fatal({ err }, "Worker bootstrap failed");
  process.exit(1);
});
