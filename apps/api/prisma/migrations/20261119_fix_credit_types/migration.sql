-- Migration: Fix credit columns to DOUBLE PRECISION + add AuditBatch fields
-- Bug #1: Int → Float for all credit numeric fields
-- Bug #6: Add idempotencyKey to AuditBatch
-- Bug #4: Add topNBriefsCount + completedLeadCount to AuditBatch

ALTER TABLE credit_account
  ALTER COLUMN granted TYPE DOUBLE PRECISION,
  ALTER COLUMN consumed TYPE DOUBLE PRECISION,
  ALTER COLUMN reserved TYPE DOUBLE PRECISION,
  ALTER COLUMN balance TYPE DOUBLE PRECISION,
  ALTER COLUMN "lifetimeGranted" TYPE DOUBLE PRECISION;

ALTER TABLE credit_reservation
  ALTER COLUMN "totalUnits" TYPE DOUBLE PRECISION,
  ALTER COLUMN "committedUnits" TYPE DOUBLE PRECISION,
  ALTER COLUMN "releasedUnits" TYPE DOUBLE PRECISION,
  ALTER COLUMN estimated TYPE DOUBLE PRECISION,
  ALTER COLUMN captured TYPE DOUBLE PRECISION;

ALTER TABLE credit_ledger
  ALTER COLUMN amount TYPE DOUBLE PRECISION,
  ALTER COLUMN "balanceAfter" TYPE DOUBLE PRECISION;

ALTER TABLE reservation_item
  ALTER COLUMN "reservedUnits" TYPE DOUBLE PRECISION,
  ALTER COLUMN "committedUnits" TYPE DOUBLE PRECISION,
  ALTER COLUMN "releasedUnits" TYPE DOUBLE PRECISION;

ALTER TABLE audit_batch
  ALTER COLUMN "unitsEstimated" TYPE DOUBLE PRECISION,
  ALTER COLUMN "unitsConsumed" TYPE DOUBLE PRECISION;

ALTER TABLE audit_batch ADD COLUMN IF NOT EXISTS "idempotencyKey" VARCHAR(128) UNIQUE;
ALTER TABLE audit_batch ADD COLUMN IF NOT EXISTS "topNBriefsCount" INTEGER;
ALTER TABLE audit_batch ADD COLUMN IF NOT EXISTS "completedLeadCount" INTEGER NOT NULL DEFAULT 0;
