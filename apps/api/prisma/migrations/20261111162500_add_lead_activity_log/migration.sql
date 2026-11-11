-- CreateTable
CREATE TABLE "lead_activity_log" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "userId" TEXT,
    "action" VARCHAR(60) NOT NULL,
    "previousState" JSONB,
    "newState" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_activity_log_leadId_createdAt_idx" ON "lead_activity_log"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "lead_activity_log_organizationId_createdAt_idx" ON "lead_activity_log"("organizationId", "createdAt");

-- AddForeignKey
ALTER TABLE "lead_activity_log" ADD CONSTRAINT "lead_activity_log_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activity_log" ADD CONSTRAINT "lead_activity_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

