import "dotenv/config";
import { logger } from "@core/logger";
import { runRole } from "./run-role";

runRole("crawl").catch((err) => {
  logger.fatal({ err }, "Crawl worker failed");
  process.exit(1);
});
