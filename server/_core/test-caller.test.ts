// makeCaller exists so a generated app never re-derives how to call its own
// router. A real run invented its own `makeCaller`, then spent 24 turns
// reverse-engineering tRPC's createCaller out of node_modules to fix it. Living
// in _core means the agent imports it and cannot lose it: _core is frozen.
import { describe, expect, it, vi } from "vitest";

// Demo mode: the server no longer uses a database or platform storage/auth integrations.
// These mocks keep makeCaller importable without those runtime dependencies.
vi.mock("./db", () => ({ db: {}, atomic: vi.fn(), schema: {} }));

vi.mock("./auth", () => {
  class AuthError extends Error {}
  return {
    authProvider: () => ({ login: vi.fn(), logout: vi.fn(), getSession: vi.fn(async () => null) }),
    registerLocalUser: vi.fn(),
    AuthError,
    EmailTakenError: class EmailTakenError extends AuthError {},
    accountsEnabled: () => false,
  };
});

vi.mock("./storage", () => ({
  storageCommit: vi.fn(),
  storageDeleteOwned: vi.fn(),
  storageListByOwner: vi.fn(),
  storagePutUrl: vi.fn(),
  StorageError: class StorageError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
    }
  },
}));

const { makeCaller } = await import("./test-caller");

describe("makeCaller", () => {
  it("returns a caller with an anonymous context by default", () => {
    const caller = makeCaller();
    expect(caller).toBeDefined();
  });

  it("lets a test override the current user", () => {
    const caller = makeCaller({ user: { id: "u1" } as never });
    expect(caller).toBeDefined();
  });
});
