import "dotenv/config";
import { logger } from "@core/logger";
import { runRole } from "./run-role";

runRole("psi").catch((err) => {
  logger.fatal({ err }, "PageSpeed worker failed");
  process.exit(1);
});