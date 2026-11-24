import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadEnv() {
  const mod = await import("./env");
  return mod.env;
}

describe("demo env", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;
    delete process.env.AUTH_PROVIDER;
    delete process.env.SUPPORT_EMAIL;
    delete process.env.STRIPE_SECRET_KEY;
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.SUPPORT_EMAIL;
    delete process.env.STRIPE_SECRET_KEY;
  });

  it("loads without database or JWT secrets and provides demo defaults", async () => {
    const env = await loadEnv();
    expect(env.databaseUrl).toBe("");
    expect(env.jwtSecret).toBe("demo-jwt-secret");
    expect(env.authProvider).toBe("none");
  });

  it("returns configured user values and falls back when absent", async () => {
    process.env.SUPPORT_EMAIL = "help@example.com";
    const env = await loadEnv();
    expect(env.config("SUPPORT_EMAIL")).toBe("help@example.com");
    expect(env.config("MISSING_CONFIG", "fallback")).toBe("fallback");
  });

  it("throws for a missing required user config or secret", async () => {
    const env = await loadEnv();
    expect(() => env.config("SUPPORT_EMAIL")).toThrow(/SUPPORT_EMAIL/);
    expect(() => env.secret("STRIPE_SECRET_KEY")).toThrow(/STRIPE_SECRET_KEY/);
  });

  it("refuses to read platform variables through user accessors", async () => {
    const env = await loadEnv();
    expect(() => env.config("DATABASE_URL")).toThrow(/platform/i);
    expect(() => env.secret("JWT_SECRET")).toThrow(/platform/i);
  });
});

describe("dotenv precedence (the ground this design stands on)", () => {
  it("lets a later line win over an earlier one for the same key", async () => {
    const dotenv = await import("dotenv");
    const parsed = dotenv.parse("K=first\nK=second\n");
    expect(parsed.K).toBe("second");
  });
});

function quoteEnvValue(value: string): string {
  if (!value.includes("'")) return `'${value}'`;
  if (!value.includes("`")) return "`" + value + "`";
  if (!value.includes('"') && !value.includes("\\")) return `"${value}"`;
  throw new Error("unquotable");
}

describe("dotenv value fidelity (what the platform writes is what the app reads)", () => {
  const cases = [
    "abc#def",
    "postgres://user:p#ss@host/db",
    "plain",
    "with space",
    "#leading",
    "trailing#",
    'has"double',
    "has'single",
    "has`backtick",
    "back\\slash",
    "C:\\new",
    "a'b`c",
    "$dollar{brace}",
    "",
  ];

  it.each(cases)("round-trips %j through dotenv unchanged", async (value) => {
    const dotenv = await import("dotenv");
    const parsed = dotenv.parse(`K=${quoteEnvValue(value)}\nNEXT=sentinel\n`);
    expect(parsed.K).toBe(value);
    expect(parsed.NEXT).toBe("sentinel");
  });

  it("shows what the bare form this replaced actually did", async () => {
    const dotenv = await import("dotenv");
    expect(dotenv.parse("K=abc#def\n").K).toBe("abc");
    expect(dotenv.parse('K="quoted"\n').K).toBe("quoted");
  });
});
