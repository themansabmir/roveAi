/**
 * Outbox Sweep — recovers Job rows that were committed to the database but
 * whose queue message was never successfully published (e.g. because the
 * process crashed or GCP Pub/Sub returned a transient error between the DB
 * write and the queue publish).
 *
 * Backed by JobDispatcher with expiring leases and exponential backoff.
 */

import { PrismaClient } from "@prisma/client";
import { logger } from "@core/logger";
import { IQueuePublisher, JobDispatcher } from "./job-dispatcher";

export type OutboxQueuePublisher = IQueuePublisher;

export async function runOutboxSweep(
  prisma: PrismaClient,
  queue: OutboxQueuePublisher
): Promise<{ dispatched: number; totalCandidates: number }> {
  logger.info("outbox-sweep: starting sweep");
  const dispatcher = new JobDispatcher(prisma, queue);
  const result = await dispatcher.sweep();
  logger.info(result, "outbox-sweep: completed");
  return result;
}
