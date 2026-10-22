import "dotenv/config";
import { loadConfig } from "@core/config";
import { logger } from "@core/logger";
import { registry } from "@core/registry";
import { registerAllPlugins } from "@plugins/register-all";
import { subscribeAuditRole } from "@features/audits/audit.workers";
import { startPushServer } from "./push-server";

export async function runRole(role: "discover" | "crawl" | "psi"): Promise<void> {
  const config = loadConfig();
  const shutdown = async () => {
    logger.info({ role }, "Worker shutdown initiated");
    await registry.shutdownAll();
    process.exit(0);
  };
  process.once("SIGTERM", () => {
    void shutdown();
  });
  process.once("SIGINT", () => {
    void shutdown();
  });

  if (config.QUEUE_DRIVER === "pubsub") {
    await startPushServer(role);
    return;
  }

  await registerAllPlugins(registry);
  await subscribeAuditRole(registry, role);
  logger.info({ role }, "Queue worker subscribed");
}
