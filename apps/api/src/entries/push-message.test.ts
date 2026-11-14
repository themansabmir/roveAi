import { decodeAuditPush } from "./push-message";

describe("pubsub push messages", () => {
  it("decodes an id-only payload and the delivery attempt", () => {
    const payload = {
      organizationId: "org",
      campaignId: "camp",
      leadId: "lead",
      businessId: "biz",
      jobId: "job",
      url: "https://harbor.example/",
    };
    const delivery = decodeAuditPush({
      deliveryAttempt: 2,
      message: {
        data: Buffer.from(JSON.stringify(payload)).toString("base64"),
        messageId: "m1",
      },
      subscription: "projects/p/subscriptions/audit.crawl",
    });
    expect(delivery.payload).toEqual(payload);
    expect(delivery.retrycount).toBe(1);
    expect(JSON.stringify(delivery.payload)).not.toMatch(/<html/);
  });
});
