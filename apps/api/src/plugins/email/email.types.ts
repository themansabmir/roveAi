export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export class EmailProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailProviderError";
  }
}
