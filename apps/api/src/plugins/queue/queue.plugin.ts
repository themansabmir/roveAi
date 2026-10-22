import { loadConfig } from "../../core/config";
import { PgBossPlugin } from "./pgboss.plugin";
import { PubSubPlugin } from "./pubsub.plugin";
import { IQueueService } from "./queue.types";

export function createQueuePlugin(): IQueueService {
  return loadConfig().QUEUE_DRIVER === "pubsub" ? new PubSubPlugin() : new PgBossPlugin();
}
