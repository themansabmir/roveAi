import { createHash } from "node:crypto";
import { Storage } from "@google-cloud/storage";
import { IObjectStorage, StoredObject } from "./storage.types";

export class GcsObjectStorage implements IObjectStorage {
  private readonly storage = new Storage();

  constructor(private readonly bucketName: string) {}

  async put(input: { objectKey: string; body: Buffer; contentType: string }): Promise<StoredObject> {
    await this.storage.bucket(this.bucketName).file(input.objectKey).save(input.body, {
      contentType: input.contentType,
      resumable: false,
    });
    return {
      bucket: this.bucketName,
      objectKey: input.objectKey,
      sizeBytes: input.body.length,
      checksum: createHash("sha256").update(input.body).digest("hex"),
    };
  }

  async get(bucket: string, objectKey: string): Promise<Buffer | null> {
    try {
      const [body] = await this.storage.bucket(bucket).file(objectKey).download();
      return body;
    } catch {
      return null;
    }
  }
}
