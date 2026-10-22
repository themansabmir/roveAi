-- AlterEnum
ALTER TYPE "AuditStatus" ADD VALUE 'SKIPPED_BUDGET';
ALTER TYPE "FileKind" ADD VALUE 'HTML';
ALTER TYPE "FileKind" ADD VALUE 'PSI_JSON';

-- AlterTable
ALTER TABLE "organization" ADD COLUMN "lighthouseRunLimit" INTEGER NOT NULL DEFAULT 300;

ALTER TABLE "job" ADD COLUMN "leadId" TEXT;

ALTER TABLE "snapshot_page" ADD COLUMN "htmlFileId" TEXT;

ALTER TABLE "technical_audit" ADD COLUMN "jobId" TEXT;

-- CreateIndex
CREATE INDEX "job_leadId_kind_idx" ON "job"("leadId", "kind");

CREATE UNIQUE INDEX "technical_audit_jobId_module_key" ON "technical_audit"("jobId", "module");

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "snapshot_page" ADD CONSTRAINT "snapshot_page_htmlFileId_fkey" FOREIGN KEY ("htmlFileId") REFERENCES "stored_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "technical_audit" ADD CONSTRAINT "technical_audit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
