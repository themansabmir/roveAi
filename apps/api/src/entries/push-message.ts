import { z } from "zod";
import { AuditJobPayload, DiscoverPayload } from "@plugins/queue/queue.types";

const discoverSchema = z.object({
  campaignId: z.string().min(1),
  jobId: z.string().min(1),
});

const auditSchema = z.object({
  organizationId: z.string().min(1),
  campaignId: z.string().min(1),
  leadId: z.string().min(1),
  businessId: z.string().min(1),
  jobId: z.string().min(1),
  url: z.string().url(),
});

export interface PushDelivery<T> {
  payload: T;
  messageId: string;
  retrycount: number;
}

export function decodeDiscoverPush(body: unknown): PushDelivery<DiscoverPayload> {
  return decodePush(body, discoverSchema);
}

export function decodeAuditPush(body: unknown): PushDelivery<AuditJobPayload> {
  return decodePush(body, auditSchema);
}

function decodePush<T>(body: unknown, schema: z.ZodType<T>): PushDelivery<T> {
  const envelope = z
    .object({
      deliveryAttempt: z.number().int().positive().optional(),
      message: z.object({
        data: z.string().min(1),
        messageId: z.string().min(1),
      }),
    })
    .parse(body);
  const json: unknown = JSON.parse(Buffer.from(envelope.message.data, "base64").toString("utf8"));
  return {
    payload: schema.parse(json),
    messageId: envelope.message.messageId,
    retrycount: (envelope.deliveryAttempt ?? 1) - 1,
  };
}
