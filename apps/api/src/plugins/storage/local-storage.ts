import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { IObjectStorage, StoredObject } from "./storage.types";

export class LocalObjectStorage implements IObjectStorage {
  constructor(
    private readonly directory: string,
    private readonly bucket = "local"
  ) {}

  async put(input: { objectKey: string; body: Buffer; contentType: string }): Promise<StoredObject> {
    const target = this.safePath(input.objectKey);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, input.body);
    return {
      bucket: this.bucket,
      objectKey: input.objectKey,
      sizeBytes: input.body.length,
      checksum: createHash("sha256").update(input.body).digest("hex"),
    };
  }

  async get(bucket: string, objectKey: string): Promise<Buffer | null> {
    if (bucket !== this.bucket) return null;
    try {
      return await readFile(this.safePath(objectKey));
    } catch {
      return null;
    }
  }

  private safePath(objectKey: string): string {
    const root = path.resolve(this.directory);
    const resolved = path.resolve(root, objectKey);
    const prefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
    if (resolved !== root && !resolved.startsWith(prefix)) {
      throw new Error("object key escapes the storage directory");
    }
    return resolved;
  }
}
