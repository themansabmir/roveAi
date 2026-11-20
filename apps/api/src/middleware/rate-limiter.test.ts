import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { createAuthRateLimiter, createMutationRateLimiter } from "./rate-limiter";

describe("Rate Limiting Middleware", () => {
  it("throttles authentication requests when limit is exceeded", async () => {
    const app = express();
    // Test config: max 2 requests per window, skip: false
    const limiter = createAuthRateLimiter({
      RATE_LIMIT_AUTH_MAX: 2,
      RATE_LIMIT_AUTH_WINDOW_MIN: 1,
      NODE_ENV: "production",
    } as any);

    app.use("/api/auth/sign-in", limiter, (_req, res) => {
      res.json({ ok: true });
    });

    // 1st request -> ok
    const res1 = await request(app).post("/api/auth/sign-in");
    expect(res1.status).toBe(200);

    // 2nd request -> ok
    const res2 = await request(app).post("/api/auth/sign-in");
    expect(res2.status).toBe(200);

    // 3rd request -> 429
    const res3 = await request(app).post("/api/auth/sign-in");
    expect(res3.status).toBe(429);
    expect(res3.body).toEqual({
      code: "TOO_MANY_REQUESTS",
      message: "Too many authentication attempts. Please try again after 1 minutes.",
    });
  });

  it("throttles mutation requests per user/org", async () => {
    const app = express();
    const limiter = createMutationRateLimiter({
      RATE_LIMIT_MUTATION_MAX: 2,
      RATE_LIMIT_MUTATION_WINDOW_MIN: 1,
      NODE_ENV: "production",
    } as any);

    app.post(
      "/api/organizations/:organizationId/campaigns/:campaignId/leads/audit",
      limiter,
      (_req, res) => {
        res.json({ queued: true });
      }
    );

    const agent = request(app);

    const r1 = await agent.post("/api/organizations/org_1/campaigns/c1/leads/audit");
    expect(r1.status).toBe(200);

    const r2 = await agent.post("/api/organizations/org_1/campaigns/c1/leads/audit");
    expect(r2.status).toBe(200);

    const r3 = await agent.post("/api/organizations/org_1/campaigns/c1/leads/audit");
    expect(r3.status).toBe(429);
    expect(r3.body.code).toBe("TOO_MANY_REQUESTS");
  });
});

