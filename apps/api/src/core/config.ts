import { z } from "zod";

const envFlag = (defaultValue: boolean) =>
  z
    .string()
    .nullish()
    .transform((raw) => {
      if (raw == null || raw.trim() === "") return defaultValue;
      return !/^(false|0|no|off)$/i.test(raw.trim());
    });

const ConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1).optional(),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  WORKER_ENABLED: envFlag(false),
  REQUEST_BODY_LIMIT: z.string().default("1mb"),
  HTTP_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  GRACEFUL_SHUTDOWN_MS: z.coerce.number().int().positive().default(10_000),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(2),
  WORKER_RETRY_LIMIT: z.coerce.number().int().nonnegative().default(2),
  WORKER_RETRY_DELAY_SEC: z.coerce.number().int().nonnegative().default(5),
  WORKER_RETRY_BACKOFF: envFlag(true),
  WORKER_ARCHIVE_COMPLETED_AFTER_SEC: z.coerce.number().int().positive().default(60 * 60 * 24),
  JOB_TIMEOUT_MS: z.coerce.number().int().positive().default(120_000),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  OUTSCRAPER_API_KEY: optionalTrimmed(),
  SERPAPI_API_KEY: optionalTrimmed(),
  GOOGLE_PLACES_API_KEY: optionalTrimmed(),
  RESEND_API_KEY: optionalTrimmed(),
  EMAIL_FROM: z.string().min(1).default("Rove <onboarding@resend.dev>"),
  APP_WEB_URL: z.string().url().default("http://localhost:5173"),
  SUPERADMIN_EMAIL: optionalTrimmed(),
  SUPERADMIN_PASSWORD: optionalTrimmed(),
  SUPERADMIN_NAME: optionalTrimmed(),
  DEFAULT_SUPERADMIN_EMAIL: optionalTrimmed(),
  DEFAULT_SUPERADMIN_PASSWORD: optionalTrimmed(),
  DEFAULT_SUPERADMIN_NAME: optionalTrimmed(),
});

function optionalTrimmed() {
  return z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    });
}

export type AppConfig = z.infer<typeof ConfigSchema>;

let cached: AppConfig | undefined;

export function loadConfig(): AppConfig {
  if (cached) return cached;
  const parsed = ConfigSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid environment: ${message}`);
  }
  cached = parsed.data;
  return cached;
}

export function resetConfigForTests(): void {
  cached = undefined;
}

export function corsOrigins(config: AppConfig): string[] | true {
  const raw = config.CORS_ORIGINS.trim();
  if (raw === "*") return true;
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function trustedOrigins(config: AppConfig): string[] {
  const fromCors = corsOrigins(config);
  const list = fromCors === true ? ["http://localhost:5173"] : fromCors;
  return Array.from(new Set([...list, config.BETTER_AUTH_URL]));
}
