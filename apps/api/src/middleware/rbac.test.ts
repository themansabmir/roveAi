import { describe, it, expect, vi } from "vitest";
import { requirePlatformRole, requireSuperAdmin, requireOrgAccess, requireOrgRole } from "./rbac";
import type { Request, Response, NextFunction } from "express";

function createMockReq(overrides: Partial<Request> = {}): Request {
  return {
    params: { organizationId: "org-123" },
    method: "GET",
    ...overrides,
  } as unknown as Request;
}

describe("requirePlatformRole", () => {
  it("rejects unauthenticated requests", () => {
    const req = createMockReq({ auth: undefined });
    const next = vi.fn();

    requirePlatformRole(["SUPER_ADMIN"])(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: "UNAUTHORIZED", statusCode: 401 }));
  });

  it("rejects users without a platform role", () => {
    const req = createMockReq({
      auth: {
        userId: "u1",
        email: "user@example.com",
        name: "User",
        emailVerified: true,
        platformRole: null,
        isSuperAdmin: false,
        sessionId: "s1",
        activeOrganizationId: "org-123",
        memberships: [{ organizationId: "org-123", role: "owner" }],
      },
    });
    const next = vi.fn();

    requirePlatformRole(["SUPER_ADMIN", "MEMBER"])(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: "FORBIDDEN", statusCode: 403 }));
  });

  it("allows users with matching platform role", () => {
    const req = createMockReq({
      auth: {
        userId: "u1",
        email: "staff@rove.local",
        name: "Staff",
        emailVerified: true,
        platformRole: "MEMBER",
        isSuperAdmin: false,
        sessionId: "s1",
        activeOrganizationId: null,
        memberships: [],
      },
    });
    const next = vi.fn();

    requirePlatformRole(["MEMBER", "SUPER_ADMIN"])(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("requireSuperAdmin allows isSuperAdmin", () => {
    const req = createMockReq({
      auth: {
        userId: "u1",
        email: "admin@rove.local",
        name: "Admin",
        emailVerified: true,
        platformRole: "SUPER_ADMIN",
        isSuperAdmin: true,
        sessionId: "s1",
        activeOrganizationId: null,
        memberships: [],
      },
    });
    const next = vi.fn();

    requireSuperAdmin()(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });
});

describe("requireOrgAccess with dual-plane RBAC", () => {
  it("allows platform SUPER_ADMIN without membership", () => {
    const req = createMockReq({
      auth: {
        userId: "u1",
        email: "admin@rove.local",
        name: "Admin",
        emailVerified: true,
        platformRole: "SUPER_ADMIN",
        isSuperAdmin: true,
        sessionId: "s1",
        activeOrganizationId: null,
        memberships: [],
      },
    });
    const next = vi.fn();

    requireOrgAccess()(req, {} as Response, next);

    expect(req.organizationId).toBe("org-123");
    expect(next).toHaveBeenCalledWith();
  });

  it("allows platform MEMBER without membership", () => {
    const req = createMockReq({
      auth: {
        userId: "u2",
        email: "member@rove.local",
        name: "Member",
        emailVerified: true,
        platformRole: "MEMBER",
        isSuperAdmin: false,
        sessionId: "s2",
        activeOrganizationId: null,
        memberships: [],
      },
    });
    const next = vi.fn();

    requireOrgAccess()(req, {} as Response, next);

    expect(req.organizationId).toBe("org-123");
    expect(next).toHaveBeenCalledWith();
  });

  it("allows platform SUPPORT on GET request without membership", () => {
    const req = createMockReq({
      method: "GET",
      auth: {
        userId: "u3",
        email: "support@rove.local",
        name: "Support",
        emailVerified: true,
        platformRole: "SUPPORT",
        isSuperAdmin: false,
        sessionId: "s3",
        activeOrganizationId: null,
        memberships: [],
      },
    });
    const next = vi.fn();

    requireOrgAccess()(req, {} as Response, next);

    expect(req.organizationId).toBe("org-123");
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects platform SUPPORT on POST mutation request", () => {
    const req = createMockReq({
      method: "POST",
      auth: {
        userId: "u3",
        email: "support@rove.local",
        name: "Support",
        emailVerified: true,
        platformRole: "SUPPORT",
        isSuperAdmin: false,
        sessionId: "s3",
        activeOrganizationId: null,
        memberships: [],
      },
    });
    const next = vi.fn();

    requireOrgAccess()(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: "FORBIDDEN", statusCode: 403 }));
  });

  it("allows tenant member on their own organization", () => {
    const req = createMockReq({
      auth: {
        userId: "u4",
        email: "client@agency.com",
        name: "Agency Owner",
        emailVerified: true,
        platformRole: null,
        isSuperAdmin: false,
        sessionId: "s4",
        activeOrganizationId: "org-123",
        memberships: [{ organizationId: "org-123", role: "owner" }],
      },
    });
    const next = vi.fn();

    requireOrgAccess()(req, {} as Response, next);

    expect(req.organizationId).toBe("org-123");
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects tenant user accessing another organization", () => {
    const req = createMockReq({
      params: { organizationId: "other-org" },
      auth: {
        userId: "u4",
        email: "client@agency.com",
        name: "Agency Owner",
        emailVerified: true,
        platformRole: null,
        isSuperAdmin: false,
        sessionId: "s4",
        activeOrganizationId: "org-123",
        memberships: [{ organizationId: "org-123", role: "owner" }],
      },
    });
    const next = vi.fn();

    requireOrgAccess()(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: "FORBIDDEN", statusCode: 403 }));
  });
});
