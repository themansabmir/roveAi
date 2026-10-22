import request from "supertest";
import express from "express";
import { healthRouter } from "./health.routes";
import { IPrismaService } from "@plugins/prisma/prisma.plugin";
import { IQueueService } from "@plugins/queue/queue.types";

function buildApp(checks: { database: boolean; queue: boolean }) {
  const app = express();
  const prisma = {
    isHealthy: async () => checks.database,
  } as IPrismaService;
  const queue = {
    isHealthy: () => checks.queue,
  } as IQueueService;
  app.use(healthRouter({ prisma, queue }));
  return app;
}

describe("health routes", () => {
  it("reports liveness without dependencies", async () => {
    const response = await request(buildApp({ database: false, queue: false })).get("/healthz");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("localbrief");
  });

  it("is ready when database and queue are up", async () => {
    const response = await request(buildApp({ database: true, queue: true })).get("/readyz");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ready",
      checks: { database: true, queue: true },
    });
  });

  it("is degraded when a dependency is down", async () => {
    const response = await request(buildApp({ database: false, queue: true })).get("/readyz");
    expect(response.status).toBe(503);
    expect(response.body.status).toBe("degraded");
    expect(response.body.checks.database).toBe(false);
  });
});
