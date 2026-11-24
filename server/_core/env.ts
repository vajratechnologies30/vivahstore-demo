// Demo-friendly env access: database/auth/storage secrets are optional.
function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

const isProd = process.env.NODE_ENV === "production";

const RESERVED_ENV_KEYS = new Set([
  "DATABASE_URL",
  "DB_DRIVER",
  "DB_POOL_MAX",
  "JWT_SECRET",
  "AUTH_PROVIDER",
  "APP_SLUG",
  "APP_STORAGE_PRESIGN_URL",
  "APP_STORAGE_TOKEN",
  "NODE_ENV",
  "PORT",
  "API_PORT",
]);

const SETTINGS_HINT =
  `Add it in Web Admin → Secrets (${isProd ? "prod" : "dev"})${isProd ? ", then click Apply to production" : ""}`;

function userVar(name: string): string | undefined {
  if (RESERVED_ENV_KEYS.has(name)) {
    throw new Error(
      `${name} is a platform variable — read it from env.* instead of env.config/env.secret`,
    );
  }
  return process.env[name];
}

export const env = {
  isProd,
  databaseUrl: optional("DATABASE_URL") ?? "",
  dbDriver: (process.env.DB_DRIVER ?? "tcp") as "tcp" | "http",
  dbPoolMax: Math.max(1, Number(process.env.DB_POOL_MAX) || 5),
  jwtSecret: optional("JWT_SECRET") ?? "demo-jwt-secret",
  authProvider: (process.env.AUTH_PROVIDER ?? "none") as "none" | "local" | "sso",
  appSlug: process.env.APP_SLUG ?? "app",
  port: Number(process.env.PORT ?? 3000),
  apiPort: Number(process.env.API_PORT ?? 3001),
  storage: {
    presignUrl: process.env.APP_STORAGE_PRESIGN_URL ?? "",
    token: process.env.APP_STORAGE_TOKEN ?? "",
  },

  config(name: string, fallback?: string): string {
    const v = userVar(name);
    if (v === undefined || v === "") {
      if (fallback !== undefined) return fallback;
      throw new Error(`Missing configuration: ${name}. ${SETTINGS_HINT}.`);
    }
    return v;
  },

  secret(name: string): string {
    const v = userVar(name);
    if (!v) {
      throw new Error(`Missing secret: ${name}. ${SETTINGS_HINT}.`);
    }
    return v;
  },
};
