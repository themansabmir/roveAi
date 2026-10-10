import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../core/errors";

type RequestPart = "body" | "query" | "params";

export function validate(schema: ZodType, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[part]);
    if (!parsed.success) {
      next(new BadRequestError("Validation failed", parsed.error.issues));
      return;
    }
    if (part === "body") {
      req.body = parsed.data;
    }
    next();
  };
}
