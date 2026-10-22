import express, { Request, Response } from "express";
import { Server } from "http";
import { OAuth2Client } from "google-auth-library";
import { loadConfig } from "@core/config";
import { logger } from "@core/logger";
import { registry } from "@core/registry";
import { registerAllPlugins } from "@plugins/register-all";
import { buildAuditHandlers } from "@features/audits/audit.workers";
import { decodeAuditPush, decodeDiscoverPush } from "./push-message";

const authClient = new OAuth2Client();

export async function startPushServer(role: "discover" | "crawl" | "psi"): Promise<Server> {
  const config = loadConfig();
  await registerAllPlugins(registry);
  const handlers = buildAuditHandlers(registry);
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));

  app.get("/healthz", (_req, res) => {
    res.json({ status: "ok", role });
  });

  app.post("/pubsub", async (req: Request, res: Response) => {
    try {
      const allowed = await authorizePush(req);
      if (!allowed) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }
      const meta = { retrycount: 0, retrylimit: config.WORKER_RETRY_LIMIT };
      if (role === "discover") {
        const delivery = decodeDiscoverPush(req.body);
        meta.retrycount = delivery.retrycount;
        await handlers.discover(delivery.payload, meta);
      } else if (role === "crawl") {
        const delivery = decodeAuditPush(req.body);
        meta.retrycount = delivery.retrycount;
        await handlers.crawl(delivery.payload, meta);
      } else {
        const delivery = decodeAuditPush(req.body);
        meta.retrycount = delivery.retrycount;
        await handlers.psi(delivery.payload, meta);
      }
      res.status(204).end();
    } catch (err) {
      logger.error({ err, role }, "Push delivery failed");
      res.status(500).json({ error: "retry" });
    }
  });

  return new Promise((resolve) => {
    const server = app.listen(config.PORT, () => {
      logger.info({ port: config.PORT, role }, "Pub/Sub push worker listening");
      resolve(server);
    });
  });
}

async function authorizePush(req: Request): Promise<boolean> {
  const config = loadConfig();
  if (!config.PUBSUB_PUSH_AUDIENCE) return config.NODE_ENV !== "production";
  const header = req.header("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match?.[1]) return false;
  try {
    const ticket = await authClient.verifyIdToken({
      idToken: match[1],
      audience: config.PUBSUB_PUSH_AUDIENCE,
    });
    const email = ticket.getPayload()?.email;
    if (config.PUBSUB_PUSH_SERVICE_ACCOUNT && email !== config.PUBSUB_PUSH_SERVICE_ACCOUNT) return false;
    return true;
  } catch (err) {
    logger.warn({ err }, "Rejected Pub/Sub push token");
    return false;
  }
}
