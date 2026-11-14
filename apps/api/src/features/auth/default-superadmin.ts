import type { PrismaClient } from "@prisma/client";
import type { Auth } from "./better-auth";
import type { AppConfig } from "@core/config";
import { logger } from "@core/logger";

export interface EnsureDefaultSuperAdminInput {
  prisma: PrismaClient;
  auth: Auth;
  config: AppConfig;
}

export async function ensureDefaultSuperAdmin({
  prisma,
  auth,
  config,
}: EnsureDefaultSuperAdminInput): Promise<void> {
  const email = (config.SUPERADMIN_EMAIL ?? config.DEFAULT_SUPERADMIN_EMAIL)?.trim().toLowerCase();
  const password = config.SUPERADMIN_PASSWORD ?? config.DEFAULT_SUPERADMIN_PASSWORD;
  const name = config.SUPERADMIN_NAME ?? config.DEFAULT_SUPERADMIN_NAME ?? "Super Admin";

  if (!email || !password) {
    return;
  }

  if (password.length < 10) {
    logger.warn(
      { email },
      "SUPERADMIN_PASSWORD is shorter than 10 characters; skipping default superadmin setup."
    );
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isSuperAdmin || existing.platformRole !== "SUPER_ADMIN") {
        await prisma.user.update({
          where: { id: existing.id },
          data: { isSuperAdmin: true, platformRole: "SUPER_ADMIN" },
        });
        logger.info({ email }, "Promoted existing user to platform super admin");
      }
      return;
    }

    logger.info({ email }, "Creating default platform super admin user from environment...");

    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    await prisma.user.update({
      where: { email },
      data: {
        isSuperAdmin: true,
        platformRole: "SUPER_ADMIN",
        emailVerified: true,
      },
    });

    logger.info({ email }, "Default platform super admin created successfully (no tenant org required)");
  } catch (err) {
    logger.error({ err, email }, "Failed to ensure default super admin");
  }
}
