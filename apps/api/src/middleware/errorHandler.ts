import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError, InternalServerError } from "../core/errors";
import { logger } from "../core/logger";

export function notFoundHandler() {
  return (req: Request, res: Response) => {
    res.status(404).json({
      error: { code: "NOT_FOUND", message: `Route ${req.method} ${req.path} not found` },
    });
  };
}

export function errorHandler() {
  return (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const log = req.log ?? logger;

    if (err instanceof HttpError) {
      log.warn({ code: err.code, statusCode: err.statusCode }, err.message);
      res.status(err.statusCode).json(err.toJSON());
      return;
    }

    if (err instanceof ZodError) {
      const details = err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      log.warn({ details }, "validation error");
      res.status(400).json({
        error: { code: "BAD_REQUEST", message: "Validation failed", details },
      });
      return;
    }

    log.error({ err }, "unhandled error");
    const internal = new InternalServerError();
    res.status(internal.statusCode).json(internal.toJSON());
  };
}
