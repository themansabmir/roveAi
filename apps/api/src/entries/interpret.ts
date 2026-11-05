import "dotenv/config";
import { logger } from "@core/logger";
import { runRole } from "./run-role";

runRole("interpret").catch((err) => {
  logger.fatal({ err }, "Interpret worker failed");
  process.exit(1);
});
