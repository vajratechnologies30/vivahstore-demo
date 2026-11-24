import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Context } from "hono";

async function load() {
  vi.resetModules();
  return import("./auth");
}

const fakeCtx = {} as Context;

beforeEach(() => {
  vi.resetModules();
});

describe("demo auth", () => {
  it("never resolves a session", async () => {
    const { authProvider } = await load();
    expect(await authProvider().getSession(fakeCtx)).toBeNull();
  });

  it("disables accounts and refuses login/registration", async () => {
    const { authProvider, accountsEnabled, registerLocalUser } = await load();
    expect(accountsEnabled()).toBe(false);
    await expect(authProvider().login(fakeCtx, "a@b.co", "password123")).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(registerLocalUser("a@b.co", "password123")).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
