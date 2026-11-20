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
import { CreditService } from "../credits/credit.service";

export type OutboxQueuePublisher = IQueuePublisher;

export async function runOutboxSweep(
  prisma: PrismaClient,
  queue: OutboxQueuePublisher
): Promise<{ dispatched: number; totalCandidates: number; reconciledCredits?: { committed: number; released: number } }> {
  logger.info("outbox-sweep: starting sweep");
  const dispatcher = new JobDispatcher(prisma, queue);
  const result = await dispatcher.sweep();

  // Reservation TTL Sweeper: auto-refund unspent credits from dead/expired reservations
  let reconciledCredits: { committed: number; released: number } | undefined;
  try {
    const creditService = new CreditService(prisma);
    reconciledCredits = await creditService.reconcileStaleReservations(30);
    if (reconciledCredits.committed > 0 || reconciledCredits.released > 0) {
      logger.info(reconciledCredits, "outbox-sweep: reconciled stale credit reservations");
    }
  } catch (err) {
    logger.warn({ err }, "outbox-sweep: credit reconciliation error");
  }

  logger.info({ ...result, reconciledCredits }, "outbox-sweep: completed");
  return { ...result, reconciledCredits };
}
