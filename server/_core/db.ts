// Demo stub: no database connection.
export type AppDB = Record<string, never>;

export const db = {} as AppDB;

export async function atomic<T>(_build: (d: AppDB) => T): Promise<Awaited<T>> {
  throw new Error("Database transactions are not available in this demo.");
}

export const schema = {} as Record<string, never>;
export type DB = AppDB;

export function isUniqueViolation(_e: unknown, _constraint?: string): boolean {
  return false;
}
