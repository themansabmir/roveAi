-- AlterEnum
ALTER TYPE "AuditStatus" ADD VALUE IF NOT EXISTS 'NOT_AUDITED';
ALTER TYPE "AuditStatus" ADD VALUE IF NOT EXISTS 'QUEUED';
ALTER TYPE "AuditStatus" ADD VALUE IF NOT EXISTS 'RUNNING';
ALTER TYPE "AuditStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_COMPLETED';

-- AlterEnum
ALTER TYPE "AiStatus" ADD VALUE IF NOT EXISTS 'NOT_REQUESTED';
ALTER TYPE "AiStatus" ADD VALUE IF NOT EXISTS 'QUEUED';
ALTER TYPE "AiStatus" ADD VALUE IF NOT EXISTS 'FAILED';

-- AlterTable
ALTER TABLE "campaign_lead" ALTER COLUMN "auditStatus" SET DEFAULT 'NOT_AUDITED';
ALTER TABLE "campaign_lead" ALTER COLUMN "aiStatus" SET DEFAULT 'NOT_REQUESTED';

-- CreateTable
CREATE TABLE IF NOT EXISTS "audit_batch" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "leadCount" INTEGER NOT NULL,
    "toolsRequested" "AuditModule"[],
    "generateAiBrief" BOOLEAN NOT NULL DEFAULT false,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ,

    CONSTRAINT "audit_batch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_batch_organizationId_createdAt_idx" ON "audit_batch"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "audit_batch_campaignId_createdAt_idx" ON "audit_batch"("campaignId", "createdAt");

-- AddForeignKey
ALTER TABLE "audit_batch" ADD CONSTRAINT "audit_batch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_batch" ADD CONSTRAINT "audit_batch_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_batch" ADD CONSTRAINT "audit_batch_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

