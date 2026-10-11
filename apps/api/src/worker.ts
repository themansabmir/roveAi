import "dotenv/config";
import { registry } from "@core/registry";
import { loadConfig } from "./core/config";
import { logger } from "./core/logger";
import { registerCampaignWorker } from "@features/campaigns/campaign.worker";
import { registerAllPlugins } from "@plugins/register-all";

async function main(): Promise<void> {
  const config = loadConfig();
  await registerAllPlugins(registry);

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

  if (config.WORKER_ROLE === "browser") {
    logger.info("Browser worker ready");
    await new Promise<void>(() => {});
    return;
  }

  await registerCampaignWorker(registry);
  logger.info("Worker ready");
}

main().catch((err) => {
  logger.fatal({ err }, "Worker bootstrap failed");
  process.exit(1);
});
