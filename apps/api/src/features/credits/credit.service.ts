import {
  CreditAccount,
  CreditReservation,
  CreditTxKind,
  Prisma,
  PrismaClient,
  ReservationItemStatus,
  ReservationStatus,
  UsageKind,
} from "@prisma/client";
import { BadRequestError, NotFoundError, PaymentRequiredError } from "@core/errors";

/**
 * Customer-Facing Billing Rule:
 * 1 Research Unit (RU) = 1 successfully completed end-to-end business research report
 * (inclusive of all enabled audit tools: Crawl, PSI, and AI deliverables).
 */
export const RU_PER_REPORT = 1;

/**
 * Internal cost metrics (for infrastructure tracking, not customer billing).
 */
export const INTERNAL_TASK_COSTS = {
  CRAWL: 0.15,
  PAGESPEED: 0.10,
  AI_BRIEF: 0.25,
} as const;

export function toDecimal(val: Prisma.Decimal | number | string | null | undefined, fallback = 0): Prisma.Decimal {
  if (val == null) return new Prisma.Decimal(fallback);
  if (val instanceof Prisma.Decimal) return val;
  return new Prisma.Decimal(val);
}

export function decimalToNum(val: Prisma.Decimal | number | string | null | undefined): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  if (val instanceof Prisma.Decimal) return val.toNumber();
  return Number(val);
}

export interface CreditBalanceView {
  researchUnits: {
    granted: number;
    reserved: number;
    consumed: number;
    available: number;
  };
  discovery: {
    monthlyLimit: number;
    used: number;
    remaining: number;
  };
  // Backward compatibility aliases for dashboard components
  balance: number;
  reserved: number;
  available: number;
  lifetimeGranted: number;
}

export interface CreditPackView {
  id: string;
  name: string;
  credits: number;
  priceCents: number;
  currency: string;
}

export interface CreditLedgerView {
  id: string;
  kind: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  reservationId: string | null;
  createdAt: string;
}

export interface CostEstimateView {
  leadCount: number;
  unitsPerLead: number;
  totalUnits: number;
  availableUnits: number;
  hasSufficientBalance: boolean;
  deficit: number;
}

export class CreditService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Get or initialize the organization's CreditAccount.
   * New organizations receive an initial welcome grant of 100 free Research Units.
   */
  async getOrCreateAccount(
    organizationId: string,
    initialWelcomeCredits = 100
  ): Promise<CreditAccount> {
    const existing = await this.prisma.creditAccount.findUnique({
      where: { organizationId },
    });
    if (existing) return existing;

    return this.prisma.$transaction(async (tx) => {
      const doubleCheck = await tx.creditAccount.findUnique({
        where: { organizationId },
      });
      if (doubleCheck) return doubleCheck;

      const welcomeDec = toDecimal(initialWelcomeCredits);
      const zeroDec = new Prisma.Decimal(0);

      const account = await tx.creditAccount.create({
        data: {
          organizationId,
          granted: welcomeDec,
          consumed: zeroDec,
          reserved: zeroDec,
          balance: welcomeDec,
          lifetimeGranted: welcomeDec,
        },
      });

      if (initialWelcomeCredits > 0) {
        await tx.creditLedger.create({
          data: {
            organizationId,
            kind: CreditTxKind.GRANT,
            amount: welcomeDec,
            balanceAfter: welcomeDec,
            reason: "Welcome grant: 100 complimentary Research Units",
          },
        });
      }

      return account;
    });
  }

  /**
   * Retrieves organization balance.
   * Available = Granted - Consumed - Reserved
   * Discovery quota is tracked separately from Research Units.
   */
  async getBalance(organizationId: string): Promise<CreditBalanceView> {
    const account = await this.getOrCreateAccount(organizationId);
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { mapsRecordLimit: true },
    });

    const granted = toDecimal(account.granted);
    const consumed = toDecimal(account.consumed);
    const reserved = toDecimal(account.reserved);
    const available = Prisma.Decimal.max(0, granted.minus(consumed).minus(reserved));

    // Monthly discovery usage from usage_event
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const discoveryUsage = await this.prisma.usageEvent.aggregate({
      where: {
        organizationId,
        kind: UsageKind.MAPS_RECORD,
        createdAt: { gte: monthAgo },
      },
      _sum: { quantity: true },
    });
    const discoveryUsed = discoveryUsage._sum?.quantity ?? 0;
    const monthlyLimit = org?.mapsRecordLimit ?? 1000;

    return {
      researchUnits: {
        granted: granted.toNumber(),
        reserved: reserved.toNumber(),
        consumed: consumed.toNumber(),
        available: available.toNumber(),
      },
      discovery: {
        monthlyLimit,
        used: discoveryUsed,
        remaining: Math.max(0, monthlyLimit - discoveryUsed),
      },
      balance: available.toNumber(),
      reserved: reserved.toNumber(),
      available: available.toNumber(),
      lifetimeGranted: toDecimal(account.lifetimeGranted).toNumber(),
    };
  }

  /**
   * Cost estimation helper.
   * Pre-flight calculation before the user triggers a selective audit batch.
   */
  async estimateCost(organizationId: string, leadCount: number): Promise<CostEstimateView> {
    const account = await this.getOrCreateAccount(organizationId);
    const granted = toDecimal(account.granted);
    const consumed = toDecimal(account.consumed);
    const reserved = toDecimal(account.reserved);
    const available = Prisma.Decimal.max(0, granted.minus(consumed).minus(reserved));
    const totalUnits = new Prisma.Decimal(leadCount).times(RU_PER_REPORT);
    const hasSufficientBalance = available.greaterThanOrEqualTo(totalUnits);
    const deficit = Prisma.Decimal.max(0, totalUnits.minus(available));

    return {
      leadCount,
      unitsPerLead: RU_PER_REPORT,
      totalUnits: totalUnits.toNumber(),
      availableUnits: available.toNumber(),
      hasSufficientBalance,
      deficit: deficit.toNumber(),
    };
  }

  /**
   * Atomic Credit Reservation with Strict Balance Precondition.
   *
   * Guarantees:
   * 1. Acquires `FOR UPDATE` row lock on `credit_account`.
   * 2. Evaluates Available = Granted - Consumed - Reserved.
   * 3. If Available < requestedUnits, rejects IMMEDIATELY with 402 PaymentRequiredError
   *    (no reservation created, no jobs dispatched).
   * 4. Creates parent `CreditReservation` and individual `ReservationItem` records per lead.
   * 5. Atomically increments `account.reserved`.
   * 6. Idempotency protection prevents duplicate reservations.
   */
  async reserveCredits(
    organizationId: string,
    leadsOrCount: string[] | number,
    meta: {
      campaignId?: string;
      jobId?: string;
      idempotencyKey?: string;
      reason?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<CreditReservation> {
    const leadIds = Array.isArray(leadsOrCount)
      ? [...new Set(leadsOrCount)]
      : Array.from({ length: leadsOrCount }, (_, i) => `lead_synth_${i}`);

    const requestedUnits = new Prisma.Decimal(leadIds.length).times(RU_PER_REPORT);
    if (requestedUnits.lessThanOrEqualTo(0)) {
      throw new BadRequestError("At least one lead must be selected for audit reservation");
    }

    // Idempotency: if already created under this key, return it
    if (meta.idempotencyKey) {
      const existingRes = await this.prisma.creditReservation.findUnique({
        where: { idempotencyKey: meta.idempotencyKey },
        include: { items: true },
      });
      if (existingRes) {
        return existingRes;
      }
    }

    // Ensure account row exists
    await this.getOrCreateAccount(organizationId);

    return this.prisma.$transaction(async (tx) => {
      // Deterministic row locking
      const [locked] = await tx.$queryRaw<
        { id: string; granted: any; consumed: any; reserved: any; balance: any }[]
      >(
        Prisma.sql`SELECT id, granted, consumed, reserved, balance FROM credit_account WHERE "organizationId" = ${organizationId} FOR UPDATE`
      );

      const granted = toDecimal(locked?.granted);
      const consumed = toDecimal(locked?.consumed);
      const reserved = toDecimal(locked?.reserved);
      const available = Prisma.Decimal.max(0, granted.minus(consumed).minus(reserved));

      // Strict Precondition: reject if insufficient
      if (available.lessThan(requestedUnits)) {
        throw new PaymentRequiredError(
          `Insufficient Research Units: Required ${requestedUnits.toNumber()} RU for ${leadIds.length} leads, but organization has only ${available.toNumber()} RU available.`,
          { required: requestedUnits.toNumber(), available: available.toNumber(), deficit: requestedUnits.minus(available).toNumber() }
        );
      }

      const newReserved = reserved.plus(requestedUnits);
      const newAvailable = granted.minus(consumed).minus(newReserved);

      await tx.creditAccount.update({
        where: { organizationId },
        data: {
          reserved: newReserved,
          balance: newAvailable,
        },
      });

      const expiresAt = meta.expiresAt ?? new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h lease

      const reservation = await tx.creditReservation.create({
        data: {
          organizationId,
          campaignId: meta.campaignId,
          jobId: meta.jobId,
          totalUnits: requestedUnits,
          committedUnits: new Prisma.Decimal(0),
          releasedUnits: new Prisma.Decimal(0),
          estimated: requestedUnits,
          captured: new Prisma.Decimal(0),
          status: ReservationStatus.OPEN,
          idempotencyKey: meta.idempotencyKey,
          expiresAt,
        },
      });

      // Create per-lead reservation items for granular settlement
      if (leadIds.length > 0) {
        await tx.reservationItem.createMany({
          data: leadIds.map((leadId) => ({
            reservationId: reservation.id,
            leadId,
            reservedUnits: new Prisma.Decimal(1),
            committedUnits: new Prisma.Decimal(0),
            releasedUnits: new Prisma.Decimal(0),
            status: ReservationItemStatus.RESERVED,
          })),
          skipDuplicates: true,
        });
      }

      await tx.creditLedger.create({
        data: {
          organizationId,
          kind: CreditTxKind.RESERVE,
          amount: requestedUnits.negated(),
          balanceAfter: newAvailable,
          reservationId: reservation.id,
          idempotencyKey: meta.idempotencyKey ? `reserve:${meta.idempotencyKey}` : undefined,
          reason: meta.reason ?? `Reserved ${requestedUnits.toNumber()} RU for ${leadIds.length} lead audits`,
          metadata: { leadCount: leadIds.length },
        },
      });

      return reservation;
    });
  }

  /**
   * Granular Per-Lead Settlement.
   * Settles exactly 1 RU when a lead's complete business report finishes successfully.
   *
   * State Transition:
   * - ReservationItem: RESERVED -> COMMITTED
   * - CreditAccount: reserved -= 1, consumed += 1
   * - CreditLedger: USAGE -1 RU
   */
  async settleLeadReport(
    leadId: string,
    meta: { reservationId?: string; reason?: string } = {}
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      // Find active reservation item
      const item = await tx.reservationItem.findFirst({
        where: {
          leadId,
          ...(meta.reservationId ? { reservationId: meta.reservationId } : {}),
          status: ReservationItemStatus.RESERVED,
        },
        include: { reservation: true },
      });

      if (!item) {
        return false; // Already settled or no active reservation for this lead
      }

      const orgId = item.reservation.organizationId;
      const reservedUnits = toDecimal(item.reservedUnits, 1);

      // 1. Atomically mark item COMMITTED only if it is still RESERVED
      if (typeof tx.reservationItem.updateMany === "function") {
        const updateResult = await tx.reservationItem.updateMany({
          where: { id: item.id, status: ReservationItemStatus.RESERVED },
          data: {
            status: ReservationItemStatus.COMMITTED,
            committedUnits: reservedUnits,
            settledAt: new Date(),
          },
        });
        if (updateResult.count === 0) {
          return false; // Another concurrent worker already transitioned this item
        }
      } else {
        await tx.reservationItem.update({
          where: { id: item.id },
          data: {
            status: ReservationItemStatus.COMMITTED,
            committedUnits: reservedUnits,
            settledAt: new Date(),
          },
        });
      }

      // 2. Lock and update account
      const [locked] = await tx.$queryRaw<
        { id: string; granted: any; consumed: any; reserved: any }[]
      >(
        Prisma.sql`SELECT id, granted, consumed, reserved FROM credit_account WHERE "organizationId" = ${orgId} FOR UPDATE`
      );

      if (locked) {
        const curReserved = toDecimal(locked.reserved);
        const curConsumed = toDecimal(locked.consumed);
        const curGranted = toDecimal(locked.granted);

        const newReserved = Prisma.Decimal.max(0, curReserved.minus(reservedUnits));
        const newConsumed = curConsumed.plus(reservedUnits);
        const newAvailable = Prisma.Decimal.max(0, curGranted.minus(newConsumed).minus(newReserved));

        await tx.creditAccount.update({
          where: { organizationId: orgId },
          data: {
            reserved: newReserved,
            consumed: newConsumed,
            balance: newAvailable,
          },
        });

        // 3. Update parent reservation committed count
        const updatedParent = await tx.creditReservation.update({
          where: { id: item.reservationId },
          data: {
            committedUnits: { increment: reservedUnits },
            captured: { increment: reservedUnits },
          },
        });

        const parentCommitted = toDecimal(updatedParent.committedUnits);
        const parentReleased = toDecimal(updatedParent.releasedUnits);
        const parentTotal = toDecimal(updatedParent.totalUnits);

        if (parentCommitted.plus(parentReleased).greaterThanOrEqualTo(parentTotal)) {
          await tx.creditReservation.update({
            where: { id: item.reservationId },
            data: { status: ReservationStatus.CAPTURED },
          });
        }

        // 4. Record immutable ledger entry
        await tx.creditLedger.create({
          data: {
            organizationId: orgId,
            kind: CreditTxKind.COMMIT,
            amount: reservedUnits.negated(),
            balanceAfter: newAvailable,
            reservationId: item.reservationId,
            idempotencyKey: `settle:${item.id}`,
            reason: meta.reason ?? `Committed 1 RU for completed report (lead ${leadId})`,
            metadata: { leadId, reservationItemId: item.id },
          },
        });
      }

      return true;
    });
  }

  /**
   * Granular Per-Lead Release.
   * Releases reserved RU when a lead's report fails permanently or cannot be audited.
   *
   * State Transition:
   * - ReservationItem: RESERVED -> RELEASED
   * - CreditAccount: reserved -= 1
   * - CreditLedger: RELEASE +1 RU
   */
  async releaseLeadReport(
    leadId: string,
    reason = "Audit permanently failed or unreachable",
    meta: { reservationId?: string } = {}
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.reservationItem.findFirst({
        where: {
          leadId,
          ...(meta.reservationId ? { reservationId: meta.reservationId } : {}),
          status: ReservationItemStatus.RESERVED,
        },
        include: { reservation: true },
      });

      if (!item) {
        return false;
      }

      const orgId = item.reservation.organizationId;
      const reservedUnits = toDecimal(item.reservedUnits, 1);

      // 1. Atomically mark item RELEASED only if it is still RESERVED
      if (typeof tx.reservationItem.updateMany === "function") {
        const updateResult = await tx.reservationItem.updateMany({
          where: { id: item.id, status: ReservationItemStatus.RESERVED },
          data: {
            status: ReservationItemStatus.RELEASED,
            releasedUnits: reservedUnits,
            failureReason: reason,
            settledAt: new Date(),
          },
        });
        if (updateResult.count === 0) {
          return false; // Another concurrent worker already transitioned this item
        }
      } else {
        await tx.reservationItem.update({
          where: { id: item.id },
          data: {
            status: ReservationItemStatus.RELEASED,
            releasedUnits: reservedUnits,
            failureReason: reason,
            settledAt: new Date(),
          },
        });
      }

      const [locked] = await tx.$queryRaw<
        { id: string; granted: any; consumed: any; reserved: any }[]
      >(
        Prisma.sql`SELECT id, granted, consumed, reserved FROM credit_account WHERE "organizationId" = ${orgId} FOR UPDATE`
      );

      if (locked) {
        const curReserved = toDecimal(locked.reserved);
        const curConsumed = toDecimal(locked.consumed);
        const curGranted = toDecimal(locked.granted);

        const newReserved = Prisma.Decimal.max(0, curReserved.minus(reservedUnits));
        const newAvailable = Prisma.Decimal.max(0, curGranted.minus(curConsumed).minus(newReserved));

        await tx.creditAccount.update({
          where: { organizationId: orgId },
          data: {
            reserved: newReserved,
            balance: newAvailable,
          },
        });

        const updatedParent = await tx.creditReservation.update({
          where: { id: item.reservationId },
          data: {
            releasedUnits: { increment: reservedUnits },
          },
        });

        const parentCommitted = toDecimal(updatedParent.committedUnits);
        const parentReleased = toDecimal(updatedParent.releasedUnits);
        const parentTotal = toDecimal(updatedParent.totalUnits);

        if (parentCommitted.plus(parentReleased).greaterThanOrEqualTo(parentTotal)) {
          const finalStatus =
            parentCommitted.greaterThan(0) ? ReservationStatus.CAPTURED : ReservationStatus.RELEASED;
          await tx.creditReservation.update({
            where: { id: item.reservationId },
            data: { status: finalStatus },
          });
        }

        await tx.creditLedger.create({
          data: {
            organizationId: orgId,
            kind: CreditTxKind.RELEASE,
            amount: reservedUnits,
            balanceAfter: newAvailable,
            reservationId: item.reservationId,
            idempotencyKey: `release:${item.id}`,
            reason: `Released ${reservedUnits.toNumber()} RU: ${reason}`,
            metadata: { leadId, reservationItemId: item.id, reason },
          },
        });
      }

      return true;
    });
  }

  /**
   * Asynchronous Reconciliation Worker.
   * Recovers stale reservations after crashes or orphaned states.
   */
  async reconcileStaleReservations(cutoffMinutes = 30): Promise<{ committed: number; released: number }> {
    const cutoff = new Date(Date.now() - cutoffMinutes * 60 * 1000);
    const staleItems = await this.prisma.reservationItem.findMany({
      where: {
        status: ReservationItemStatus.RESERVED,
        createdAt: { lt: cutoff },
      },
      include: {
        lead: { select: { id: true, auditStatus: true, aiStatus: true } },
        reservation: { select: { expiresAt: true } },
      },
      take: 100,
    });

    let committed = 0;
    let released = 0;

    for (const item of staleItems) {
      if (item.lead.auditStatus === "COMPLETED") {
        await this.settleLeadReport(item.leadId, {
          reservationId: item.reservationId,
          reason: "Reconciliation: lead audit marked COMPLETED",
        });
        committed++;
      } else if (
        item.lead.auditStatus === "FAILED" ||
        (item.reservation.expiresAt && item.reservation.expiresAt < new Date())
      ) {
        await this.releaseLeadReport(
          item.leadId,
          "Reconciliation: job failed or reservation expired",
          { reservationId: item.reservationId }
        );
        released++;
      }
    }

    return { committed, released };
  }

  /**
   * Batch-level settlement (backward compatibility with existing audit batch finishers).
   */
  async commitReservation(reservationId: string, _actualUnits?: number): Promise<void> {
    const reservation = await this.prisma.creditReservation.findUnique({
      where: { id: reservationId },
      include: { items: true },
    });
    if (!reservation || reservation.status !== ReservationStatus.OPEN) return;

    // Settle all remaining reserved items
    for (const item of reservation.items) {
      if (item.status === ReservationItemStatus.RESERVED) {
        await this.settleLeadReport(item.leadId, { reservationId });
      }
    }
  }

  /**
   * Batch-level release (backward compatibility with batch cancellation).
   */
  async releaseReservation(reservationId: string, reason = "Batch cancelled"): Promise<void> {
    const reservation = await this.prisma.creditReservation.findUnique({
      where: { id: reservationId },
      include: { items: true },
    });
    if (!reservation || reservation.status !== ReservationStatus.OPEN) return;

    for (const item of reservation.items) {
      if (item.status === ReservationItemStatus.RESERVED) {
        await this.releaseLeadReport(item.leadId, reason, { reservationId });
      }
    }
  }

  /**
   * Refill credit account with a purchased pack.
   */
  async refillCredits(
    organizationId: string,
    packId: string,
    userId?: string
  ): Promise<{ balance: number; granted: number; packName: string }> {
    const pack = await this.prisma.creditPack.findUnique({ where: { id: packId } });
    if (!pack || !pack.active) {
      throw new NotFoundError("Credit pack not found or inactive");
    }

    await this.getOrCreateAccount(organizationId);

    return this.prisma.$transaction(async (tx) => {
      const [locked] = await tx.$queryRaw<
        { id: string; granted: any; consumed: any; reserved: any }[]
      >(
        Prisma.sql`SELECT id, granted, consumed, reserved FROM credit_account WHERE "organizationId" = ${organizationId} FOR UPDATE`
      );

      const packCredits = toDecimal(pack.credits);
      const curGranted = toDecimal(locked?.granted);
      const curConsumed = toDecimal(locked?.consumed);
      const curReserved = toDecimal(locked?.reserved);

      const newGranted = curGranted.plus(packCredits);
      const newAvailable = Prisma.Decimal.max(0, newGranted.minus(curConsumed).minus(curReserved));

      await tx.creditAccount.update({
        where: { organizationId },
        data: {
          granted: newGranted,
          balance: newAvailable,
          lifetimeGranted: { increment: packCredits },
        },
      });

      await tx.creditLedger.create({
        data: {
          organizationId,
          kind: CreditTxKind.PURCHASE,
          amount: packCredits,
          balanceAfter: newAvailable,
          reason: `Purchased pack: ${pack.name} (+${packCredits.toNumber()} RU)`,
          metadata: { packId, userId, priceCents: pack.priceCents },
        },
      });

      return {
        balance: newAvailable.toNumber(),
        granted: newGranted.toNumber(),
        packName: pack.name,
      };
    });
  }

  async listPacks(): Promise<CreditPackView[]> {
    const existing = await this.prisma.creditPack.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (existing.length > 0) {
      return existing.map((p) => ({
        id: p.id,
        name: p.name,
        credits: decimalToNum(p.credits),
        priceCents: p.priceCents,
        currency: p.currency,
      }));
    }

    const defaultPacks = [
      { id: "pack_starter", name: "Starter Pack", credits: new Prisma.Decimal(100), priceCents: 4900, currency: "usd", sortOrder: 1 },
      { id: "pack_growth", name: "Growth Pack", credits: new Prisma.Decimal(500), priceCents: 19900, currency: "usd", sortOrder: 2 },
      { id: "pack_agency_pro", name: "Agency Pro Pack", credits: new Prisma.Decimal(2000), priceCents: 69900, currency: "usd", sortOrder: 3 },
    ];

    for (const p of defaultPacks) {
      await this.prisma.creditPack.upsert({
        where: { id: p.id },
        update: {},
        create: { ...p, active: true },
      });
    }

    const loaded = await this.prisma.creditPack.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });

    return loaded.map((p) => ({
      id: p.id,
      name: p.name,
      credits: decimalToNum(p.credits),
      priceCents: p.priceCents,
      currency: p.currency,
    }));
  }

  async getLedger(organizationId: string, limit = 50): Promise<CreditLedgerView[]> {
    const rows = await this.prisma.creditLedger.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: Math.min(100, limit),
    });

    return rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      amount: decimalToNum(r.amount),
      balanceAfter: decimalToNum(r.balanceAfter),
      reason: r.reason,
      reservationId: r.reservationId,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}
