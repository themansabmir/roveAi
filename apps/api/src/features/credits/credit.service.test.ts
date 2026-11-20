import { describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";
import { CreditService, RU_PER_REPORT } from "./credit.service";
import { PaymentRequiredError } from "@core/errors";

describe("CreditService — Revamped Research Unit & Settlement Engine", () => {
  const createMockPrisma = () => ({
    creditAccount: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    creditLedger: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    creditReservation: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    reservationItem: {
      createMany: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    creditPack: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    organization: {
      findUnique: vi.fn(),
    },
    usageEvent: {
      aggregate: vi.fn(),
    },
    $transaction: vi.fn(),
    $queryRaw: vi.fn(),
  });

  describe("Billing Definition", () => {
    it("defines 1 Research Unit as 1 complete business research report", () => {
      expect(RU_PER_REPORT).toBe(1);
    });
  });

  describe("getOrCreateAccount & getBalance", () => {
    it("returns existing account with granted, consumed, reserved, and available", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      const existing = {
        id: "acc_1",
        organizationId: "org_1",
        granted: 100,
        consumed: 15,
        reserved: 10,
        balance: 75,
        lifetimeGranted: 100,
      };
      mockPrisma.creditAccount.findUnique.mockResolvedValueOnce(existing);
      mockPrisma.organization.findUnique.mockResolvedValueOnce({ mapsRecordLimit: 1000 });
      mockPrisma.usageEvent.aggregate.mockResolvedValueOnce({ _sum: { quantity: 240 } });

      const result = await service.getBalance("org_1");
      expect(result.researchUnits.granted).toBe(100);
      expect(result.researchUnits.consumed).toBe(15);
      expect(result.researchUnits.reserved).toBe(10);
      expect(result.researchUnits.available).toBe(75); // 100 - 15 - 10
      expect(result.discovery.monthlyLimit).toBe(1000);
      expect(result.discovery.used).toBe(240);
      expect(result.discovery.remaining).toBe(760);
    });

    it("creates account with 100 welcome credits when not found", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      mockPrisma.creditAccount.findUnique.mockResolvedValueOnce(null);
      const created = {
        id: "acc_2",
        organizationId: "org_2",
        granted: 100,
        consumed: 0,
        reserved: 0,
        balance: 100,
        lifetimeGranted: 100,
      };

      mockPrisma.$transaction.mockImplementationOnce(async (cb: any) => {
        const txPrisma = {
          creditAccount: {
            findUnique: vi.fn().mockResolvedValueOnce(null),
            create: vi.fn().mockResolvedValueOnce(created),
          },
          creditLedger: {
            create: vi.fn().mockResolvedValueOnce({ id: "led_welcome" }),
          },
        };
        return cb(txPrisma);
      });

      const result = await service.getOrCreateAccount("org_2", 100);
      expect(result).toEqual(created);
    });
  });

  describe("estimateCost", () => {
    it("calculates cost as exactly 1 RU per lead and checks balance", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      mockPrisma.creditAccount.findUnique.mockResolvedValueOnce({
        id: "acc_1",
        organizationId: "org_1",
        granted: 100,
        consumed: 20,
        reserved: 10,
        balance: 70, // Available: 70
        lifetimeGranted: 100,
      });

      const estimate = await service.estimateCost("org_1", 25);
      expect(estimate.leadCount).toBe(25);
      expect(estimate.unitsPerLead).toBe(1);
      expect(estimate.totalUnits).toBe(25);
      expect(estimate.availableUnits).toBe(70);
      expect(estimate.hasSufficientBalance).toBe(true);
      expect(estimate.deficit).toBe(0);
    });

    it("reports shortfall when requested leads exceed available units", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      mockPrisma.creditAccount.findUnique.mockResolvedValueOnce({
        id: "acc_1",
        organizationId: "org_1",
        granted: 100,
        consumed: 70,
        reserved: 10,
        balance: 20, // Available: 20
        lifetimeGranted: 100,
      });

      const estimate = await service.estimateCost("org_1", 50);
      expect(estimate.totalUnits).toBe(50);
      expect(estimate.availableUnits).toBe(20);
      expect(estimate.hasSufficientBalance).toBe(false);
      expect(estimate.deficit).toBe(30);
    });
  });

  describe("reserveCredits with Strict Precondition", () => {
    it("throws PaymentRequiredError (402) when available balance < requested leads", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      mockPrisma.creditAccount.findUnique.mockResolvedValueOnce({
        id: "acc_1",
        organizationId: "org_1",
        granted: 100,
        consumed: 60,
        reserved: 10, // Available: 30
        balance: 30,
        lifetimeGranted: 100,
      });

      mockPrisma.$transaction.mockImplementationOnce(async (txCb: any) => {
        const txPrisma = {
          $queryRaw: vi.fn().mockResolvedValueOnce([
            { id: "acc_1", organizationId: "org_1", granted: 100, consumed: 60, reserved: 10, balance: 30 },
          ]),
          creditReservation: { create: vi.fn() },
          reservationItem: { createMany: vi.fn() },
          creditAccount: { update: vi.fn() },
          creditLedger: { create: vi.fn() },
        };
        return txCb(txPrisma);
      });

      // Request 75 leads when only 30 available -> must reject without creating reservation
      await expect(
        service.reserveCredits(
          "org_1",
          Array.from({ length: 75 }, (_, i) => `lead_${i}`),
          { campaignId: "camp_1" }
        )
      ).rejects.toThrow(PaymentRequiredError);
    });

    it("creates reservation and granular items when balance is sufficient", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      mockPrisma.creditAccount.findUnique.mockResolvedValueOnce({
        id: "acc_1",
        organizationId: "org_1",
        granted: 100,
        consumed: 0,
        reserved: 0, // Available: 100
        balance: 100,
        lifetimeGranted: 100,
      });

      const mockReservation = {
        id: "res_batch_25",
        organizationId: "org_1",
        campaignId: "camp_1",
        totalUnits: 25,
        committedUnits: 0,
        releasedUnits: 0,
        status: "OPEN",
      };

      const mockCreateReservation = vi.fn().mockResolvedValueOnce(mockReservation);
      const mockCreateItems = vi.fn().mockResolvedValueOnce({ count: 25 });
      const mockAccountUpdate = vi.fn().mockResolvedValueOnce({ id: "acc_1", reserved: 25, balance: 75 });
      const mockLedgerCreate = vi.fn().mockResolvedValueOnce({ id: "led_res" });

      mockPrisma.$transaction.mockImplementationOnce(async (txCb: any) => {
        const txPrisma = {
          $queryRaw: vi.fn().mockResolvedValueOnce([
            { id: "acc_1", organizationId: "org_1", granted: 100, consumed: 0, reserved: 0, balance: 100 },
          ]),
          creditReservation: { create: mockCreateReservation },
          reservationItem: { createMany: mockCreateItems },
          creditAccount: { update: mockAccountUpdate },
          creditLedger: { create: mockLedgerCreate },
        };
        return txCb(txPrisma);
      });

      const leadIds = Array.from({ length: 25 }, (_, i) => `lead_${i}`);
      const res = await service.reserveCredits("org_1", leadIds, { campaignId: "camp_1" });

      expect(res.id).toBe("res_batch_25");
      expect(mockCreateReservation).toHaveBeenCalledWith({
        data: expect.objectContaining({
          totalUnits: new Prisma.Decimal(25),
          status: "OPEN",
        }),
      });
      expect(mockCreateItems).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            reservationId: "res_batch_25",
            leadId: "lead_0",
            reservedUnits: new Prisma.Decimal(1),
            status: "RESERVED",
          }),
        ]),
        skipDuplicates: true,
      });
      expect(mockAccountUpdate).toHaveBeenCalledWith({
        where: { organizationId: "org_1" },
        data: { reserved: new Prisma.Decimal(25), balance: new Prisma.Decimal(75) },
      });
    });

    it("returns existing reservation if idempotencyKey already processed", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      const existingRes = {
        id: "res_existing",
        idempotencyKey: "idem_key_123",
        totalUnits: 10,
        status: "OPEN",
      };
      mockPrisma.creditReservation.findUnique.mockResolvedValueOnce(existingRes);

      const res = await service.reserveCredits("org_1", ["lead_1"], {
        idempotencyKey: "idem_key_123",
      });

      expect(res.id).toBe("res_existing");
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe("Per-Lead Settlement (settleLeadReport)", () => {
    it("settles exactly 1 RU for a completed lead report", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      const item = {
        id: "item_1",
        reservationId: "res_123",
        leadId: "lead_success",
        reservedUnits: 1,
        status: "RESERVED",
        reservation: { organizationId: "org_1" },
      };

      const mockItemUpdate = vi.fn().mockResolvedValueOnce({ ...item, status: "COMMITTED" });
      const mockAccountUpdate = vi.fn().mockResolvedValueOnce({ id: "acc_1" });
      const mockResUpdate = vi.fn().mockResolvedValueOnce({
        id: "res_123",
        committedUnits: 1,
        releasedUnits: 0,
        totalUnits: 1,
      });
      const mockLedgerCreate = vi.fn().mockResolvedValueOnce({ id: "led_settle" });

      mockPrisma.$transaction.mockImplementationOnce(async (txCb: any) => {
        const txPrisma = {
          reservationItem: {
            findFirst: vi.fn().mockResolvedValueOnce(item),
            update: mockItemUpdate,
          },
          $queryRaw: vi.fn().mockResolvedValueOnce([
            { id: "acc_1", granted: 100, consumed: 0, reserved: 25 },
          ]),
          creditAccount: { update: mockAccountUpdate },
          creditReservation: { update: mockResUpdate },
          creditLedger: { create: mockLedgerCreate },
        };
        return txCb(txPrisma);
      });

      const settled = await service.settleLeadReport("lead_success");
      expect(settled).toBe(true);

      expect(mockItemUpdate).toHaveBeenCalledWith({
        where: { id: "item_1" },
        data: expect.objectContaining({
          status: "COMMITTED",
          committedUnits: new Prisma.Decimal(1),
        }),
      });

      // Account: reserved decremented by 1, consumed incremented by 1
      expect(mockAccountUpdate).toHaveBeenCalledWith({
        where: { organizationId: "org_1" },
        data: {
          reserved: new Prisma.Decimal(24),
          consumed: new Prisma.Decimal(1),
          balance: new Prisma.Decimal(75),
        },
      });

      // Ledger: USAGE recorded
      expect(mockLedgerCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kind: "COMMIT",
          amount: new Prisma.Decimal(-1),
          idempotencyKey: "settle:item_1",
        }),
      });
    });
  });

  describe("Per-Lead Release (releaseLeadReport)", () => {
    it("releases reserved unit and returns 1 RU to balance when lead permanently fails", async () => {
      const mockPrisma = createMockPrisma();
      const service = new CreditService(mockPrisma as any);

      const item = {
        id: "item_fail",
        reservationId: "res_123",
        leadId: "lead_broken",
        reservedUnits: 1,
        status: "RESERVED",
        reservation: { organizationId: "org_1" },
      };

      const mockItemUpdate = vi.fn().mockResolvedValueOnce({ ...item, status: "RELEASED" });
      const mockAccountUpdate = vi.fn().mockResolvedValueOnce({ id: "acc_1" });
      const mockResUpdate = vi.fn().mockResolvedValueOnce({
        id: "res_123",
        committedUnits: 0,
        releasedUnits: 1,
        totalUnits: 1,
      });
      const mockLedgerCreate = vi.fn().mockResolvedValueOnce({ id: "led_rel" });

      mockPrisma.$transaction.mockImplementationOnce(async (txCb: any) => {
        const txPrisma = {
          reservationItem: {
            findFirst: vi.fn().mockResolvedValueOnce(item),
            update: mockItemUpdate,
          },
          $queryRaw: vi.fn().mockResolvedValueOnce([
            { id: "acc_1", granted: 100, consumed: 0, reserved: 25 },
          ]),
          creditAccount: { update: mockAccountUpdate },
          creditReservation: { update: mockResUpdate },
          creditLedger: { create: mockLedgerCreate },
        };
        return txCb(txPrisma);
      });

      const released = await service.releaseLeadReport("lead_broken", "Domain unreachable 404");
      expect(released).toBe(true);

      // Account: reserved decremented by 1, consumed NOT incremented
      expect(mockAccountUpdate).toHaveBeenCalledWith({
        where: { organizationId: "org_1" },
        data: {
          reserved: new Prisma.Decimal(24),
          balance: new Prisma.Decimal(76), // 100 - 0 - 24
        },
      });

      expect(mockLedgerCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kind: "RELEASE",
          amount: new Prisma.Decimal(1),
          idempotencyKey: "release:item_fail",
        }),
      });
    });
  });
});
