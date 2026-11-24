import type { Context } from "hono";
import { TRPCError } from "@trpc/server";
import type { SessionUser } from "../../shared/types";

export interface AuthProvider {
  getSession(c: Context): Promise<SessionUser | null>;
  login(c: Context, email: string, password: string): Promise<SessionUser>;
  logout(c: Context): Promise<void>;
}

export class AuthError extends Error {}
export class EmailTakenError extends AuthError {}

const NO_ACCOUNTS_MESSAGE = "This app does not have user accounts.";

function noAccountsError(): TRPCError {
  return new TRPCError({ code: "FORBIDDEN", message: NO_ACCOUNTS_MESSAGE });
}

class DemoAuthProvider implements AuthProvider {
  async getSession(): Promise<SessionUser | null> {
    return null;
  }

  async login(): Promise<SessionUser> {
    throw noAccountsError();
  }

  async logout(): Promise<void> {
    // No session cookie or stored user in the demo.
  }
}

let _provider: AuthProvider | undefined;

export function authProvider(): AuthProvider {
  if (!_provider) _provider = new DemoAuthProvider();
  return _provider;
}

export function accountsEnabled(): boolean {
  return false;
}

export async function registerLocalUser(
  _email: string,
  _password: string,
  _name?: string,
): Promise<SessionUser> {
  throw noAccountsError();
}
