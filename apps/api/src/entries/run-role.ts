import "dotenv/config";
import { loadConfig } from "@core/config";
import { logger } from "@core/logger";
import { registry } from "@core/registry";
import { registerAllPlugins } from "@plugins/register-all";
import { subscribeAuditRole } from "@features/audits/audit.workers";
import { startPushServer } from "./push-server";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { IQueueService, QUEUE_PLUGIN } from "@plugins/queue/queue.types";
import { runOutboxSweep } from "@features/jobs/outbox-sweep";

export async function runRole(role: "discover" | "crawl" | "psi" | "interpret"): Promise<void> {
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

  // Run the outbox sweep once on startup to recover any jobs whose queue
  // message was lost before the previous worker process crashed or was
  // restarted. This is intentionally synchronous — we want to recover lost
  // messages before subscribing to new ones.
  try {
    const prisma = registry.get<IPrismaService>(PRISMA_PLUGIN).client;
    const queue = registry.get<IQueueService>(QUEUE_PLUGIN);
    await runOutboxSweep(prisma, queue);
  } catch (err) {
    // A sweep failure must never prevent the worker from starting.
    logger.error({ err }, "startup outbox sweep failed (non-fatal)");
  }

  await subscribeAuditRole(registry, role);
  logger.info({ role }, "Queue worker subscribed");
}

