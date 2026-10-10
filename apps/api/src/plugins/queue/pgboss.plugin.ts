import { PgBoss, type Job, type WorkHandler } from "pg-boss";
import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";

export const QUEUE_PLUGIN = "QueuePlugin";

export type JobHandler<T> = (
  payload: T,
  jobId: string,
  meta: { retrycount: number; retrylimit: number }
) => Promise<void>;

export interface IQueueService extends IPlugin {
  publish<T extends object>(
    queue: string,
    payload: T,
    opts?: { singletonKey?: string }
  ): Promise<string | null>;
  subscribe<T>(queue: string, handler: JobHandler<T>, opts?: { localConcurrency?: number }): Promise<void>;
  isHealthy(): boolean;
}

export class PgBossPlugin implements IQueueService {
  public name = QUEUE_PLUGIN;
  private boss!: PgBoss;
  private started = false;
  private readonly knownQueues = new Set<string>();

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    this.boss = new PgBoss({
      connectionString: config.DATABASE_URL,
      schema: "pgboss",
      monitorIntervalSeconds: 30,
    });

    this.boss.on("error", (err: Error) => logger.error({ err }, "pg-boss error"));
    await this.boss.start();
    this.started = true;
    logger.info("pg-boss started");
  }

  async publish<T extends object>(
    queue: string,
    payload: T,
    opts: { singletonKey?: string } = {}
  ): Promise<string | null> {
    if (!this.started) throw new Error("Queue not started");
    await this.ensureQueue(queue);
    return this.boss.send(queue, payload, {
      ...(opts.singletonKey ? { singletonKey: opts.singletonKey } : {}),
    });
  }

  async subscribe<T>(
    queue: string,
    handler: JobHandler<T>,
    opts: { localConcurrency?: number } = {}
  ): Promise<void> {
    if (!this.started) throw new Error("Queue not started");
    const config = loadConfig();
    await this.ensureQueue(queue);

    const wrapped: WorkHandler<T> = async (jobs: Job<T>[]) => {
      for (const job of jobs) {
        const retrycount = job.retryCount ?? 0;
        try {
          await handler(job.data, job.id, {
            retrycount,
            retrylimit: config.WORKER_RETRY_LIMIT,
          });
        } catch (err) {
          logger.error({ err, jobId: job.id, queue }, "Job failed; pg-boss will retry per policy");
          throw err;
        }
      }
    };

    await this.boss.work<T>(queue, { localConcurrency: opts.localConcurrency ?? config.WORKER_CONCURRENCY }, wrapped);
    logger.info({ queue }, "Subscribed to queue");
  }

  private async ensureQueue(queue: string): Promise<void> {
    if (this.knownQueues.has(queue)) return;
    const config = loadConfig();
    try {
      await this.boss.createQueue(queue, {
        retryLimit: config.WORKER_RETRY_LIMIT,
        retryDelay: config.WORKER_RETRY_DELAY_SEC,
        retryBackoff: config.WORKER_RETRY_BACKOFF,
        expireInSeconds: Math.ceil(config.JOB_TIMEOUT_MS / 1000),
        deleteAfterSeconds: config.WORKER_ARCHIVE_COMPLETED_AFTER_SEC,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!/already exists|duplicate key|unique constraint/i.test(message)) {
        throw err;
      }
    }
    this.knownQueues.add(queue);
  }

  isHealthy(): boolean {
    return this.started;
  }

  async shutdown(): Promise<void> {
    if (!this.started) return;
    await this.boss.stop({ graceful: true, timeout: 10_000 });
    this.started = false;
    logger.info("pg-boss stopped");
  }
}
