import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UnauthorizedError } from "@core/errors";
import { CreditService } from "./credit.service";

const refillSchema = z.object({
  packId: z.string().min(1),
});

export class CreditController {
  constructor(private readonly service: CreditService) {}

  getBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const balance = await this.service.getBalance(organizationId);
      res.json(balance);
    } catch (err) {
      next(err);
    }
  };

  listPacks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const packs = await this.service.listPacks();
      res.json(packs);
    } catch (err) {
      next(err);
    }
  };

  refill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const input = refillSchema.parse(req.body);
      const userId = req.auth?.userId;
      const result = await this.service.refillCredits(organizationId, input.packId, userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getLedger = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const limit = req.query["limit"] ? Number(req.query["limit"]) : 50;
      const ledger = await this.service.getLedger(organizationId, limit);
      res.json(ledger);
    } catch (err) {
      next(err);
    }
  };

  estimateCost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const leadCount = Number(req.query["leadCount"] ?? 1);
      const estimate = await this.service.estimateCost(organizationId, leadCount);
      res.json(estimate);
    } catch (err) {
      next(err);
    }
  };

  reconcile = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.reconcileStaleReservations();
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function requiredOrg(req: Request): string {
  if (!req.organizationId) throw new UnauthorizedError();
  return req.organizationId;
}
