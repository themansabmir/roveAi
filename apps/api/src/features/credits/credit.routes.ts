import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireOrgAccess } from "../../middleware/rbac";
import { requireAuth } from "../../middleware/session";
import { CreditController } from "./credit.controller";
import { CreditService } from "./credit.service";

export function creditsRouter(deps: { prisma: PrismaClient }): Router {
  const creditService = new CreditService(deps.prisma);
  const controller = new CreditController(creditService);

  const router = Router({ mergeParams: true });
  router.use(requireAuth(), requireOrgAccess());

  router.get("/", controller.getBalance);
  router.get("/estimate", controller.estimateCost);
  router.get("/packs", controller.listPacks);
  router.post("/refill", controller.refill);
  router.get("/ledger", controller.getLedger);
  router.post("/reconcile", controller.reconcile);

  return router;
}

