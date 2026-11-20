import { Request, Response, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { AppConfig, loadConfig } from "@core/config";

export function createAuthRateLimiter(config: AppConfig = loadConfig()): RequestHandler {
  return rateLimit({
    windowMs: config.RATE_LIMIT_AUTH_WINDOW_MIN * 60 * 1000,
    limit: config.RATE_LIMIT_AUTH_MAX,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => config.NODE_ENV === "test",
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        code: "TOO_MANY_REQUESTS",
        message: `Too many authentication attempts. Please try again after ${config.RATE_LIMIT_AUTH_WINDOW_MIN} minutes.`,
      });
    },
  });
}

export function createMutationRateLimiter(config: AppConfig = loadConfig()): RequestHandler {
  return rateLimit({
    windowMs: config.RATE_LIMIT_MUTATION_WINDOW_MIN * 60 * 1000,
    limit: config.RATE_LIMIT_MUTATION_MAX,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    validate: {
      keyGeneratorIpFallback: false,
      xForwardedForHeader: false,
    },
    skip: () => config.NODE_ENV === "test",
    keyGenerator: (req: Request) => {
      const user = (req as any).auth?.userId;
      const org = (req as any).auth?.organizationId || req.params?.["organizationId"];
      if (user) return `user_${user}`;
      if (org) return `org_${org}`;
      return req.ip || "unknown_client";
    },
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        code: "TOO_MANY_REQUESTS",
        message: "Audit rate limit exceeded. Please wait a moment before scheduling more audits.",
      });
    },
  });
}
