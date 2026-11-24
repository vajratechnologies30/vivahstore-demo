import type { Context as HonoContext } from "hono";
import { authProvider } from "./auth";

// tRPC request context for the demo app (no database).
export async function createContext(c: HonoContext) {
  const user = await authProvider().getSession(c);
  return { c, db: null as unknown, user };
}

export type AppContext = Awaited<ReturnType<typeof createContext>>;
