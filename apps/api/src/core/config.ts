import { z } from "zod";

const optionalText = () =>
  z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    });

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
  DB_POOL_MAX: z.coerce.number().int().positive().default(2),
  QUEUE_DRIVER: z.enum(["pgboss", "pubsub"]).default("pgboss"),
  GCP_PROJECT_ID: optionalText(),
  PUBSUB_PUSH_AUDIENCE: optionalText(),
  PUBSUB_PUSH_SERVICE_ACCOUNT: optionalText(),
  GCS_BUCKET: optionalText(),
  LOCAL_OBJECT_DIR: z.string().default(".data/objects"),
  PAGESPEED_API_KEY: optionalText(),
  CRAWL_MAX_PAGES: z.coerce.number().int().min(1).max(10).default(8),
  FETCH_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  FETCH_MAX_BYTES: z.coerce.number().int().positive().default(1_500_000),
  PSI_TIMEOUT_MS: z.coerce.number().int().positive().default(60_000),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  // Apify Google Maps Scraper
  APIFY_TOKEN: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    }),
  APIFY_ACTOR: z
    .string()
    .optional()
    .default("scraperlink/google-maps-scraper")
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : "scraperlink/google-maps-scraper";
    }),
  // Outscraper (legacy — Apify is preferred)
  OUTSCRAPER_API_KEY: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    }),
}).superRefine((value, ctx) => {
  if (value.QUEUE_DRIVER === "pubsub" && !value.GCP_PROJECT_ID) {
    ctx.addIssue({
      code: "custom",
      message: "GCP_PROJECT_ID is required when QUEUE_DRIVER=pubsub",
      path: ["GCP_PROJECT_ID"],
    });
  }
  if (value.NODE_ENV === "production" && value.QUEUE_DRIVER === "pubsub") {
    if (!value.PUBSUB_PUSH_AUDIENCE) {
      ctx.addIssue({
        code: "custom",
        message: "PUBSUB_PUSH_AUDIENCE is required in production",
        path: ["PUBSUB_PUSH_AUDIENCE"],
      });
    }
    if (!value.GCS_BUCKET) {
      ctx.addIssue({
        code: "custom",
        message: "GCS_BUCKET is required in production",
        path: ["GCS_BUCKET"],
      });
    }
    if (!value.PAGESPEED_API_KEY) {
      ctx.addIssue({
        code: "custom",
        message: "PAGESPEED_API_KEY is required in production",
        path: ["PAGESPEED_API_KEY"],
      });
    }
  }
});

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
