/**
 * Sweep entry point — runs the outbox sweep once and exits.
 *
 * Usage:
 *   # Run manually:
 *   pnpm --filter @rove/api exec ts-node -r tsconfig-paths/register src/entries/sweep.ts
 *
 * Production (Cloud Run Job / Cloud Scheduler):
 *   Set up Cloud Scheduler to POST to your Cloud Run Jobs endpoint every 60s,
 *   or run this as a Cloud Run Job triggered by Cloud Scheduler.
 *   This avoids the setInterval() problem — Cloud Run instances can be killed
 *   at any time, and a process-level timer is not a reliable global scheduler.
 */
import "dotenv/config";
import { logger } from "@core/logger";
import { registry } from "@core/registry";
import { registerAllPlugins } from "@plugins/register-all";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { IQueueService, QUEUE_PLUGIN } from "@plugins/queue/queue.types";
import { runOutboxSweep } from "@features/jobs/outbox-sweep";

async function main(): Promise<void> {
  await registerAllPlugins(registry);
  const prisma = registry.get<IPrismaService>(PRISMA_PLUGIN).client;
  const queue = registry.get<IQueueService>(QUEUE_PLUGIN);

  try {
    await runOutboxSweep(prisma, queue);
  } finally {
    await registry.shutdownAll();
  }
}

main().catch((err) => {
  logger.fatal({ err }, "sweep entry failed");
  process.exit(1);
});
