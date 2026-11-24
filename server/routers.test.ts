import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { makeCaller } from "./_core/test-caller";

await import("./routers");

function caller(user: { id: string } | null = null) {
  return makeCaller({ c: {} as never, db: null as never, user: user as never });
}

describe("demo auth", () => {
  it("reports no signed-in user", async () => {
    await expect(caller().auth.me()).resolves.toBeNull();
  });

  it("refuses login and signup because accounts are disabled", async () => {
    const loginErr = await caller()
      .auth.login({ email: "demo@example.com", password: "password123" })
      .catch((e) => e);
    expect(loginErr).toBeInstanceOf(TRPCError);
    expect((loginErr as TRPCError).code).toBe("FORBIDDEN");

    const signupErr = await caller()
      .auth.signup({ email: "demo@example.com", password: "password123", name: "Demo" })
      .catch((e) => e);
    expect(signupErr).toBeInstanceOf(TRPCError);
    expect((signupErr as TRPCError).code).toBe("FORBIDDEN");
  });
});

describe("demo catalogue and newsletter", () => {
  it("exposes the public catalogue without a database", async () => {
    const categories = await caller().catalog.categories();
    expect(categories.length).toBeGreaterThan(0);

    const featured = await caller().catalog.featured();
    expect(featured.length).toBeGreaterThan(0);
  });

  it("accepts newsletter subscriptions", async () => {
    const result = await caller().newsletter.subscribe({ email: "guest@example.com" });
    expect(result.subscribed).toBe(true);
  });
});
