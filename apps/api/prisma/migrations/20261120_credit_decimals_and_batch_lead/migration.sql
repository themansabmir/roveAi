-- AlterTable credit_account
ALTER TABLE "credit_account" ALTER COLUMN "granted" TYPE DECIMAL(12,2) USING "granted"::DECIMAL(12,2);
ALTER TABLE "credit_account" ALTER COLUMN "consumed" TYPE DECIMAL(12,2) USING "consumed"::DECIMAL(12,2);
ALTER TABLE "credit_account" ALTER COLUMN "balance" TYPE DECIMAL(12,2) USING "balance"::DECIMAL(12,2);
ALTER TABLE "credit_account" ALTER COLUMN "reserved" TYPE DECIMAL(12,2) USING "reserved"::DECIMAL(12,2);
ALTER TABLE "credit_account" ALTER COLUMN "lifetimeGranted" TYPE DECIMAL(12,2) USING "lifetimeGranted"::DECIMAL(12,2);

-- AlterTable credit_reservation
ALTER TABLE "credit_reservation" ALTER COLUMN "totalUnits" TYPE DECIMAL(12,2) USING "totalUnits"::DECIMAL(12,2);
ALTER TABLE "credit_reservation" ALTER COLUMN "committedUnits" TYPE DECIMAL(12,2) USING "committedUnits"::DECIMAL(12,2);
ALTER TABLE "credit_reservation" ALTER COLUMN "releasedUnits" TYPE DECIMAL(12,2) USING "releasedUnits"::DECIMAL(12,2);
ALTER TABLE "credit_reservation" ALTER COLUMN "estimated" TYPE DECIMAL(12,2) USING "estimated"::DECIMAL(12,2);
ALTER TABLE "credit_reservation" ALTER COLUMN "captured" TYPE DECIMAL(12,2) USING "captured"::DECIMAL(12,2);

-- AlterTable reservation_item
ALTER TABLE "reservation_item" ALTER COLUMN "reservedUnits" TYPE DECIMAL(12,2) USING "reservedUnits"::DECIMAL(12,2);
ALTER TABLE "reservation_item" ALTER COLUMN "committedUnits" TYPE DECIMAL(12,2) USING "committedUnits"::DECIMAL(12,2);
ALTER TABLE "reservation_item" ALTER COLUMN "releasedUnits" TYPE DECIMAL(12,2) USING "releasedUnits"::DECIMAL(12,2);

-- AlterTable credit_ledger
ALTER TABLE "credit_ledger" ALTER COLUMN "amount" TYPE DECIMAL(12,2) USING "amount"::DECIMAL(12,2);
ALTER TABLE "credit_ledger" ALTER COLUMN "balanceAfter" TYPE DECIMAL(12,2) USING "balanceAfter"::DECIMAL(12,2);

-- AlterTable credit_pack
ALTER TABLE "credit_pack" ALTER COLUMN "credits" TYPE DECIMAL(12,2) USING "credits"::DECIMAL(12,2);

-- AlterTable audit_batch
ALTER TABLE "audit_batch" ALTER COLUMN "unitsEstimated" TYPE DECIMAL(12,2) USING "unitsEstimated"::DECIMAL(12,2);
ALTER TABLE "audit_batch" ALTER COLUMN "unitsConsumed" TYPE DECIMAL(12,2) USING "unitsConsumed"::DECIMAL(12,2);

-- Add auditBatchId to campaign_lead
ALTER TABLE "campaign_lead" ADD COLUMN IF NOT EXISTS "auditBatchId" TEXT;
CREATE INDEX IF NOT EXISTS "campaign_lead_auditBatchId_idx" ON "campaign_lead"("auditBatchId");

-- Add foreign key constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'campaign_lead_auditBatchId_fkey'
    ) THEN
        ALTER TABLE "campaign_lead" ADD CONSTRAINT "campaign_lead_auditBatchId_fkey"
            FOREIGN KEY ("auditBatchId") REFERENCES "audit_batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
