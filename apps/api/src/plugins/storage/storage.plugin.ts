import path from "node:path";
import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { GcsObjectStorage } from "./gcs-storage";
import { LocalObjectStorage } from "./local-storage";
import { IObjectStorage, StoredObject } from "./storage.types";

export const STORAGE_PLUGIN = "StoragePlugin";

export interface IStorageService extends IPlugin, IObjectStorage {}

export class StoragePlugin implements IStorageService {
  public name = STORAGE_PLUGIN;
  private store: IObjectStorage = new LocalObjectStorage(path.resolve(".data/objects"));

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    if (config.GCS_BUCKET) {
      this.store = new GcsObjectStorage(config.GCS_BUCKET);
      logger.info({ bucket: config.GCS_BUCKET }, "Object storage: GCS");
      return;
    }
    if (config.NODE_ENV === "production") {
      this.store = {
        put: () => Promise.reject(new Error("GCS_BUCKET is required in production")),
        get: () => Promise.resolve(null),
      };
      logger.warn("GCS_BUCKET is unset; object writes will fail");
      return;
    }
    this.store = new LocalObjectStorage(path.resolve(config.LOCAL_OBJECT_DIR));
    logger.info({ dir: config.LOCAL_OBJECT_DIR }, "Object storage: local directory");
  }

  put(input: { objectKey: string; body: Buffer; contentType: string }): Promise<StoredObject> {
    return this.store.put(input);
  }

  get(bucket: string, objectKey: string): Promise<Buffer | null> {
    return this.store.get(bucket, objectKey);
  }

  async shutdown(): Promise<void> {}
}
