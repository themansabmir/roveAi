import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { Logger } from "pino";
import { logger as rootLogger } from "../core/logger";

declare global {
  namespace Express {
    interface Request {
      id: string;
      log: Logger;
      organizationId?: string;
    }
  }
}

export function requestContext() {
  return (req: Request, res: Response, next: NextFunction) => {
    const incoming = req.header("X-Request-Id");
    const id = incoming && /^[A-Za-z0-9_-]{8,128}$/.test(incoming) ? incoming : randomUUID();
    req.id = id;
    req.log = rootLogger.child({ reqId: id, method: req.method, path: req.path });
    res.setHeader("X-Request-Id", id);
    next();
  };
}
