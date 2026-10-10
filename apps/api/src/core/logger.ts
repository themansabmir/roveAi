import { Logger } from "pino";
import pino from "pino";
import { loadConfig } from "./config";

const config = loadConfig();

function hasPrettyTransport(): boolean {
  try {
    require.resolve("pino-pretty");
    return true;
  } catch {
    return false;
  }
}

const transport =
  config.NODE_ENV === "development" && hasPrettyTransport()
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      }
    : undefined;

export const logger: Logger = pino({
  level: config.LOG_LEVEL,
  base: { service: "localbrief", env: config.NODE_ENV },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.token",
      "*.apiKey",
      "*.api_key",
      "*.DATABASE_URL",
      "*.DIRECT_URL",
    ],
    censor: "[REDACTED]",
  },
  transport,
});
