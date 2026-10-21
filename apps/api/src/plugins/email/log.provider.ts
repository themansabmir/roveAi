import { logger } from "@core/logger";
import { EmailMessage, EmailProvider } from "./email.types";

/**
 * Dev fallback used when no RESEND_API_KEY is set. Logs the message (including a
 * plain-text preview) instead of delivering it, so flows like invites still work
 * end to end locally.
 */
export class LogEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<void> {
    logger.info(
      { to: message.to, subject: message.subject, text: message.text ?? stripHtml(message.html) },
      "Email (dev log provider — not delivered)"
    );
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
