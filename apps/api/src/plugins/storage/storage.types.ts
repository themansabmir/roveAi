export interface StoredObject {
  bucket: string;
  objectKey: string;
  sizeBytes: number;
  checksum: string;
}

export interface IObjectStorage {
  put(input: { objectKey: string; body: Buffer; contentType: string }): Promise<StoredObject>;
  get(bucket: string, objectKey: string): Promise<Buffer | null>;
}
