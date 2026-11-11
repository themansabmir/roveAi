-- AlterTable
ALTER TABLE "business" ADD COLUMN     "enrichmentState" JSONB;

-- AlterTable
ALTER TABLE "lead_score" ALTER COLUMN "total" DROP NOT NULL,
ALTER COLUMN "evidenceScore" DROP NOT NULL,
ALTER COLUMN "fitScore" DROP NOT NULL,
ALTER COLUMN "relevanceScore" DROP NOT NULL,
ALTER COLUMN "confidence" SET DEFAULT 'LOW';

-- CreateTable
CREATE TABLE "audit_attempt" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "module" "AuditModule" NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "status" "AuditStatus" NOT NULL,
    "score" INTEGER,
    "failureReason" VARCHAR(500),
    "observedAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_attempt_leadId_module_createdAt_idx" ON "audit_attempt"("leadId", "module", "createdAt");

-- CreateIndex
CREATE INDEX "audit_attempt_jobId_idx" ON "audit_attempt"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "audit_attempt_jobId_module_attemptNumber_key" ON "audit_attempt"("jobId", "module", "attemptNumber");

-- AddForeignKey
ALTER TABLE "audit_attempt" ADD CONSTRAINT "audit_attempt_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_attempt" ADD CONSTRAINT "audit_attempt_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
