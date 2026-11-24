import type { Context } from "hono";

export type StorageErrorCode = "not_found" | "forbidden" | "not_configured" | "failed";

export class StorageError extends Error {
  constructor(
    message: string,
    readonly code: StorageErrorCode,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export type FileRecord = {
  id: string;
  key: string;
  ownerId: string | null;
  name: string;
  size: number;
  contentType: string | null;
  createdAt: Date;
};

function disabled(): never {
  throw new StorageError("File storage is not available in this demo.", "not_configured");
}

export async function storageGet(_relKey: string): Promise<FileRecord | null> {
  return null;
}

export async function storageCommit(
  _relKey: string,
  _opts: { ownerId?: string | null; name?: string } = {},
): Promise<FileRecord> {
  disabled();
}

export async function storageListByOwner(
  _ownerId: string,
  _opts: { limit?: number; offset?: number } = {},
): Promise<FileRecord[]> {
  return [];
}

export async function storageListAll(_opts: { limit?: number; offset?: number } = {}): Promise<FileRecord[]> {
  return [];
}

export async function storageCountByOwner(_ownerId: string): Promise<number> {
  return 0;
}

export async function storageCountAll(): Promise<number> {
  return 0;
}

export async function storageDeleteOwned(_ownerId: string, _relKey: string): Promise<boolean> {
  return false;
}

export async function storageDeleteAny(_relKey: string): Promise<boolean> {
  return false;
}

export async function storageDeleteAnonymous(_relKey: string): Promise<boolean> {
  return false;
}

export async function storagePutUrl(
  _relKey: string,
  _contentType?: string,
  _opts: { ownerId?: string | null } = {},
): Promise<{ uploadUrl: string; publicPath: string }> {
  disabled();
}

export async function serveAppStorage(c: Context): Promise<Response> {
  return c.text("Not found", 404);
}
