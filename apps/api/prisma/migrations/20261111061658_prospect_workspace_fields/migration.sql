-- CreateEnum
CREATE TYPE "ProspectStatus" AS ENUM ('NEW', 'RESEARCHED', 'QUALIFIED', 'CONTACTED', 'DISMISSED');

-- AlterTable
ALTER TABLE "campaign_lead" ADD COLUMN     "archivedAt" TIMESTAMPTZ,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "prospectStatus" "ProspectStatus" NOT NULL DEFAULT 'NEW';

-- CreateIndex
CREATE INDEX "campaign_lead_campaignId_prospectStatus_idx" ON "campaign_lead"("campaignId", "prospectStatus");

-- CreateIndex
CREATE INDEX "campaign_lead_campaignId_archivedAt_idx" ON "campaign_lead"("campaignId", "archivedAt");
