import { PubSub } from "@google-cloud/pubsub";
import { IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { IQueueService, JobHandler, QUEUE_PLUGIN } from "./queue.types";

export class PubSubPlugin implements IQueueService {
  public name = QUEUE_PLUGIN;
  private client: PubSub | null = null;
  private readonly knownTopics = new Set<string>();

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    if (!config.GCP_PROJECT_ID) {
      throw new Error("GCP_PROJECT_ID is required when QUEUE_DRIVER=pubsub");
    }
    this.client = new PubSub({ projectId: config.GCP_PROJECT_ID });
    logger.info({ projectId: config.GCP_PROJECT_ID }, "Pub/Sub client ready");
  }

  async publish<T extends object>(
    queue: string,
    payload: T,
    opts: { singletonKey?: string } = {}
  ): Promise<string | null> {
    const client = this.requireClient();
    await this.ensureTopic(queue);
    const messageId = await client.topic(queue).publishMessage({
      data: Buffer.from(JSON.stringify(payload)),
      attributes: opts.singletonKey ? { singletonKey: opts.singletonKey } : {},
    });
    return messageId;
  }

  async subscribe<T>(_queue: string, _handler: JobHandler<T>): Promise<void> {
    throw new Error("Pub/Sub workers receive push deliveries. Start the role entry point instead of subscribe().");
  }

  isHealthy(): boolean {
    return this.client != null;
  }

  async shutdown(): Promise<void> {
    if (!this.client) return;
    await this.client.close();
    this.client = null;
    logger.info("Pub/Sub client closed");
  }

  private requireClient(): PubSub {
    if (!this.client) throw new Error("Pub/Sub client is not started");
    return this.client;
  }

  private async ensureTopic(queue: string): Promise<void> {
    if (this.knownTopics.has(queue)) return;
    const topic = this.requireClient().topic(queue);
    const [exists] = await topic.exists();
    if (!exists) {
      await topic.create();
      logger.info({ queue }, "Created Pub/Sub topic");
    }
    this.knownTopics.add(queue);
  }
}
