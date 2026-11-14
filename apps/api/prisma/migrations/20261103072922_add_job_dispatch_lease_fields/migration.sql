-- DropIndex
DROP INDEX "job_status_dispatchedAt_idx";

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "dispatchAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dispatchLockedAt" TIMESTAMPTZ,
ADD COLUMN     "dispatchLockedBy" VARCHAR(64),
ADD COLUMN     "nextDispatchAt" TIMESTAMPTZ;

-- CreateIndex
CREATE INDEX "job_status_dispatchedAt_nextDispatchAt_idx" ON "job"("status", "dispatchedAt", "nextDispatchAt");

-- CreateIndex
CREATE INDEX "job_dispatchLockedAt_idx" ON "job"("dispatchLockedAt");
