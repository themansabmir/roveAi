import "dotenv/config";
import { loadConfig } from "./core/config";
import { logger } from "./core/logger";
import { startServer } from "./server";

async function main(): Promise<void> {
  loadConfig();
  await startServer();
}

main().catch((err) => {
  logger.fatal({ err }, "Bootstrap failed");
  process.exit(1);
});
