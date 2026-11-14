import "dotenv/config";
import { logger } from "@core/logger";
import { runRole } from "./entries/run-role";

runRole("discover").catch((err) => {
  logger.fatal({ err }, "Worker bootstrap failed");
  process.exit(1);
});
