import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { EmailMessage, EmailProvider } from "./email.types";
import { ResendEmailProvider } from "./resend.provider";
import { LogEmailProvider } from "./log.provider";

export const EMAIL_PLUGIN = "EmailPlugin";

export interface IEmailService extends IPlugin, EmailProvider {}

/**
 * Swappable transactional email. Uses Resend when RESEND_API_KEY is present,
 * otherwise falls back to a dev log provider so flows work locally.
 */
export class EmailPlugin implements IEmailService {
  public name = EMAIL_PLUGIN;
  private provider: EmailProvider = new LogEmailProvider();

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    if (config.RESEND_API_KEY) {
      this.provider = new ResendEmailProvider(config.RESEND_API_KEY, config.EMAIL_FROM);
      logger.info("Email provider: Resend");
      return;
    }
    this.provider = new LogEmailProvider();
    logger.warn("RESEND_API_KEY is missing; emails will be logged, not delivered");
  }

  send(message: EmailMessage): Promise<void> {
    return this.provider.send(message);
  }

  async shutdown(): Promise<void> {}
}
