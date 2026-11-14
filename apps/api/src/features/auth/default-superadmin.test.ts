import { describe, it, expect, vi } from "vitest";
import { ensureDefaultSuperAdmin } from "./default-superadmin";
import type { AppConfig } from "@core/config";
import type { PrismaClient } from "@prisma/client";
import type { Auth } from "./better-auth";

function createMockConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    NODE_ENV: "test",
    PORT: 3000,
    LOG_LEVEL: "info",
    DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/test",
    CORS_ORIGINS: "http://localhost:5173",
    WORKER_ENABLED: false,
    REQUEST_BODY_LIMIT: "1mb",
    HTTP_REQUEST_TIMEOUT_MS: 30000,
    GRACEFUL_SHUTDOWN_MS: 10000,
    WORKER_CONCURRENCY: 2,
    WORKER_RETRY_LIMIT: 2,
    WORKER_RETRY_DELAY_SEC: 5,
    WORKER_RETRY_BACKOFF: true,
    WORKER_ARCHIVE_COMPLETED_AFTER_SEC: 86400,
    JOB_TIMEOUT_MS: 120000,
    BETTER_AUTH_SECRET: "12345678901234567890123456789012",
    BETTER_AUTH_URL: "http://localhost:3000",
    EMAIL_FROM: "Rove <onboarding@resend.dev>",
    APP_WEB_URL: "http://localhost:5173",
    ...overrides,
  } as AppConfig;
}

describe("ensureDefaultSuperAdmin", () => {
  it("does nothing if SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD is not set", async () => {
    const prisma = {
      user: {
        findUnique: vi.fn(),
      },
    } as unknown as PrismaClient;

    const auth = {
      api: {
        signUpEmail: vi.fn(),
      },
    } as unknown as Auth;

    const config = createMockConfig();

    await ensureDefaultSuperAdmin({ prisma, auth, config });

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(auth.api.signUpEmail).not.toHaveBeenCalled();
  });

  it("skips if password is less than 10 characters", async () => {
    const prisma = {
      user: {
        findUnique: vi.fn(),
      },
    } as unknown as PrismaClient;

    const auth = {
      api: {
        signUpEmail: vi.fn(),
      },
    } as unknown as Auth;

    const config = createMockConfig({
      SUPERADMIN_EMAIL: "admin@rove.local",
      SUPERADMIN_PASSWORD: "short",
    });

    await ensureDefaultSuperAdmin({ prisma, auth, config });

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(auth.api.signUpEmail).not.toHaveBeenCalled();
  });

  it("is a no-op if user already exists and is already super admin", async () => {
    const prisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "u1",
          email: "admin@rove.local",
          isSuperAdmin: true,
          platformRole: "SUPER_ADMIN",
        }),
        update: vi.fn(),
      },
    } as unknown as PrismaClient;

    const auth = {
      api: {
        signUpEmail: vi.fn(),
      },
    } as unknown as Auth;

    const config = createMockConfig({
      SUPERADMIN_EMAIL: "admin@rove.local",
      SUPERADMIN_PASSWORD: "supersecretpassword123",
    });

    await ensureDefaultSuperAdmin({ prisma, auth, config });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@rove.local" },
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(auth.api.signUpEmail).not.toHaveBeenCalled();
  });

  it("promotes existing user if isSuperAdmin is false or platformRole is not SUPER_ADMIN", async () => {
    const prisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "u1",
          email: "admin@rove.local",
          isSuperAdmin: false,
          platformRole: null,
        }),
        update: vi.fn().mockResolvedValue({
          id: "u1",
          email: "admin@rove.local",
          isSuperAdmin: true,
          platformRole: "SUPER_ADMIN",
        }),
      },
    } as unknown as PrismaClient;

    const auth = {
      api: {
        signUpEmail: vi.fn(),
      },
    } as unknown as Auth;

    const config = createMockConfig({
      SUPERADMIN_EMAIL: "admin@rove.local",
      SUPERADMIN_PASSWORD: "supersecretpassword123",
    });

    await ensureDefaultSuperAdmin({ prisma, auth, config });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { isSuperAdmin: true, platformRole: "SUPER_ADMIN" },
    });
    expect(auth.api.signUpEmail).not.toHaveBeenCalled();
  });

  it("creates super admin user with platformRole without creating any tenant organization", async () => {
    const prisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        update: vi.fn().mockResolvedValue({
          id: "new-admin-id",
          email: "newadmin@rove.local",
          isSuperAdmin: true,
          platformRole: "SUPER_ADMIN",
        }),
      },
    } as unknown as PrismaClient;

    const auth = {
      api: {
        signUpEmail: vi.fn().mockResolvedValue({
          user: { id: "new-admin-id", email: "newadmin@rove.local" },
        }),
      },
    } as unknown as Auth;

    const config = createMockConfig({
      SUPERADMIN_EMAIL: "newadmin@rove.local",
      SUPERADMIN_PASSWORD: "supersecretpassword123",
      SUPERADMIN_NAME: "Platform Admin",
    });

    await ensureDefaultSuperAdmin({ prisma, auth, config });

    expect(auth.api.signUpEmail).toHaveBeenCalledWith({
      body: {
        email: "newadmin@rove.local",
        password: "supersecretpassword123",
        name: "Platform Admin",
      },
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "newadmin@rove.local" },
      data: {
        isSuperAdmin: true,
        platformRole: "SUPER_ADMIN",
        emailVerified: true,
      },
    });
  });
});
