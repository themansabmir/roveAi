-- AlterTable
ALTER TABLE "job" ADD COLUMN     "dispatchedAt" TIMESTAMPTZ;

-- CreateIndex
CREATE INDEX "job_status_dispatchedAt_idx" ON "job"("status", "dispatchedAt");
