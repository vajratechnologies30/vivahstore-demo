import { describe, expect, it } from "vitest";

import { isUniqueViolation } from "./db-errors";

class FakeDrizzleQueryError extends Error {
  constructor(message: string, _params: unknown[], cause: unknown) {
    super(message);
    this.name = "DrizzleQueryError";
    (this as Error & { cause?: unknown }).cause = cause;
  }
}

// The real driver error, as node-postgres builds it: the SQLSTATE and the
// constraint name live on the error object, and the human-readable wording is
// Postgres's own.
function pgUniqueViolation(constraint = "users_email_unique"): Error {
  return Object.assign(
    new Error(`duplicate key value violates unique constraint "${constraint}"`),
    { code: "23505", constraint, severity: "ERROR" },
  );
}

describe("isUniqueViolation", () => {
  it("sees through a wrapped query error to the driver's SQLSTATE", () => {
    const wrapped = new FakeDrizzleQueryError(
      'insert into "users" ("id", "email", "password_hash") values (default, $1, $2)',
      ["asce1885@gmail.com", "$2b$10$lz3khdQ4ZWLRwguG"],
      pgUniqueViolation(),
    );

    expect(wrapped.message).not.toMatch(/unique|duplicate/i);
    expect(isUniqueViolation(wrapped)).toBe(true);
  });

  it("recognises a bare driver error that was never wrapped", () => {
    expect(isUniqueViolation(pgUniqueViolation())).toBe(true);
  });

  it("matches a named constraint so callers can tell two unique indexes apart", () => {
    const e = pgUniqueViolation("notes_owner_title_unique");
    expect(isUniqueViolation(e, "notes_owner_title_unique")).toBe(true);
    expect(isUniqueViolation(e, "users_email_unique")).toBe(false);
  });

  it("falls back to Postgres's wording when the driver omits the code", () => {
    const e = new Error('duplicate key value violates unique constraint "users_email_unique"');
    expect(isUniqueViolation(e)).toBe(true);
    expect(isUniqueViolation(e, "users_email_unique")).toBe(true);
    expect(isUniqueViolation(e, "notes_owner_title_unique")).toBe(false);
  });

  it("is false for every other failure - a FK violation is not a duplicate", () => {
    const fk = Object.assign(new Error("violates foreign key constraint"), { code: "23503" });
    expect(isUniqueViolation(new FakeDrizzleQueryError("insert into ...", [], fk))).toBe(false);
    expect(isUniqueViolation(new Error("connection terminated"))).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation("23505")).toBe(false);
  });

  it("does not hang on an error whose cause chain loops", () => {
    const a = new Error("a") as Error & { cause?: unknown };
    const b = new Error("b") as Error & { cause?: unknown };
    a.cause = b;
    b.cause = a;
    expect(isUniqueViolation(a)).toBe(false);
  });
});
