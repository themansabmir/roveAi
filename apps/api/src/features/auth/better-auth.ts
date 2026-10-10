import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { PrismaClient } from "@prisma/client";
import { loadConfig, trustedOrigins } from "@core/config";

export type Auth = ReturnType<typeof createAuth>;

export function createAuth(prisma: PrismaClient) {
  const config = loadConfig();
  const secureCookie = config.NODE_ENV === "production";

  return betterAuth({
    appName: "LocalBrief",
    secret: config.BETTER_AUTH_SECRET,
    baseURL: config.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: trustedOrigins(config),
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      additionalFields: {
        activeOrganizationId: {
          type: "string",
          required: false,
          input: false,
        },
      },
    },
    advanced: {
      defaultCookieAttributes: {
        secure: secureCookie,
        sameSite: "lax",
        httpOnly: true,
      },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            if (user.emailVerified) return;
            await prisma.user.update({
              where: { id: user.id },
              data: { emailVerified: true },
            });
          },
        },
      },
    },
  });
}
