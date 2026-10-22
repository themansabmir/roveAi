import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "http";
import { toNodeHandler } from "better-auth/node";
import { PluginRegistry, registry } from "@core/registry";
import { corsOrigins, loadConfig } from "./core/config";
import { logger } from "./core/logger";
import { requestContext } from "./middleware/requestContext";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { attachSession } from "./middleware/session";
import { healthRouter } from "@features/health/health.routes";
import { createAuth } from "@features/auth/better-auth";
import { meRouter } from "@features/me/me.routes";
import { adminRouter } from "@features/admin/admin.routes";
import { organizationsRouter } from "@features/organizations/organization.routes";
import { workspaceRouter } from "@features/workspaces/workspace.routes";
import { campaignsRouter } from "@features/campaigns/campaign.routes";
import { registerAllPlugins } from "@plugins/register-all";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { IQueueService, QUEUE_PLUGIN } from "@plugins/queue/queue.types";
import { IMapsService, MAPS_PLUGIN } from "@plugins/maps/maps.plugin";
import { IEmailService, EMAIL_PLUGIN } from "@plugins/email/email.plugin";
import { teamRouter, invitationsRouter } from "@features/invitations/invitation.routes";
import { ensureDefaultSuperAdmin } from "@features/auth/default-superadmin";

export interface BootResult {
  app: Express;
  server: Server;
  registry: PluginRegistry;
  shutdown: () => Promise<void>;
}

export async function buildApp(): Promise<{ app: Express; registry: PluginRegistry }> {
  const config = loadConfig();
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigins(config),
      credentials: true,
    })
  );
  app.use(requestContext());

  await registerAllPlugins(registry);

  const prismaPlugin = registry.get<IPrismaService>(PRISMA_PLUGIN);
  const queuePlugin = registry.get<IQueueService>(QUEUE_PLUGIN);
  const mapsPlugin = registry.get<IMapsService>(MAPS_PLUGIN);
  const emailPlugin = registry.get<IEmailService>(EMAIL_PLUGIN);
  const prisma = prismaPlugin.client;
  const auth = createAuth(prisma);

  await ensureDefaultSuperAdmin({ prisma, auth, config });

  // Better Auth reads the raw request body. JSON parsing must come after this handler.
  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json({ limit: config.REQUEST_BODY_LIMIT }));
  app.use(cookieParser());
  app.use(attachSession({ auth, prisma }));
  app.use(healthRouter({ prisma: prismaPlugin, queue: queuePlugin }));
  app.use("/api/me", meRouter({ prisma }));
  app.use("/api/admin", adminRouter({ prisma, maps: mapsPlugin }));
  app.use("/api/workspaces", workspaceRouter({ prisma }));
  app.use("/api/organizations", organizationsRouter({ prisma }));
  app.use(
    "/api/organizations/:organizationId/team",
    teamRouter({ prisma, email: emailPlugin, appWebUrl: config.APP_WEB_URL })
  );
  app.use("/api/invitations", invitationsRouter({ prisma, email: emailPlugin, appWebUrl: config.APP_WEB_URL }));
  app.use("/api/organizations/:organizationId/campaigns", campaignsRouter({ prisma, queue: queuePlugin }));
  app.use(notFoundHandler());
  app.use(errorHandler());

  return { app, registry };
}

export async function startServer(): Promise<BootResult> {
  const config = loadConfig();
  const { app, registry: reg } = await buildApp();

  const server = await new Promise<Server>((resolve) => {
    const listening = app.listen(config.PORT, () => resolve(listening));
  });

  server.requestTimeout = config.HTTP_REQUEST_TIMEOUT_MS;
  logger.info({ port: config.PORT }, "LocalBrief API listening");

  const shutdown = createShutdown(server, reg);
  attachSignals(shutdown);
  return { app, server, registry: reg, shutdown };
}

function createShutdown(server: Server, reg: PluginRegistry): () => Promise<void> {
  let shuttingDown = false;
  return async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    const config = loadConfig();
    logger.info("Graceful shutdown initiated");

    const closed = new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    const timeout = new Promise<void>((resolve) =>
      setTimeout(() => {
        logger.warn("HTTP server did not close in time; forcing shutdown");
        resolve();
      }, config.GRACEFUL_SHUTDOWN_MS)
    );
    await Promise.race([closed, timeout]);

    try {
      await reg.shutdownAll();
    } catch (err) {
      logger.error({ err }, "Error during plugin shutdown");
    }
    logger.info("Shutdown complete");
  };
}

function attachSignals(shutdown: () => Promise<void>): void {
  const handler = (signal: string) => {
    logger.info({ signal }, "Received shutdown signal");
    shutdown()
      .then(() => process.exit(0))
      .catch((err) => {
        logger.error({ err }, "Shutdown error");
        process.exit(1);
      });
  };
  process.once("SIGTERM", () => handler("SIGTERM"));
  process.once("SIGINT", () => handler("SIGINT"));
}
