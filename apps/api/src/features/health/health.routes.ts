import { Request, Response, Router } from "express";
import { IPrismaService } from "@plugins/prisma/prisma.plugin";
import { IQueueService } from "@plugins/queue/queue.types";

const startedAt = Date.now();

export function healthRouter(deps: { prisma: IPrismaService; queue: IQueueService }): Router {
  const router = Router();

  router.get("/healthz", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "localbrief",
      uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    });
  });

  router.get("/readyz", async (_req: Request, res: Response) => {
    const checks = {
      database: await deps.prisma.isHealthy(),
      queue: deps.queue.isHealthy(),
    };
    const ok = Object.values(checks).every(Boolean);
    res.status(ok ? 200 : 503).json({ status: ok ? "ready" : "degraded", checks });
  });

  return router;
}
