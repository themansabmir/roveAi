import "dotenv/config";
import { logger } from "@core/logger";
import { runRole } from "./run-role";

runRole("discover").catch((err) => {
  logger.fatal({ err }, "Discover worker failed");
  process.exit(1);
});
