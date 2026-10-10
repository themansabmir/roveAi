/*
  Warnings:

  - The `kind` column on the `job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `campaign_lead` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditModule" AS ENUM ('TECHNICAL_SEO', 'PERFORMANCE', 'SECURITY', 'ACCESSIBILITY', 'WEBSITE_EXPERIENCE', 'LOCAL_SEO', 'REPUTATION', 'CONTENT', 'TECHNOLOGY', 'COMPETITOR');

-- CreateEnum
CREATE TYPE "EvidenceSource" AS ENUM ('LAB', 'FIELD', 'PROFILE', 'CRAWL', 'DERIVED');

-- CreateEnum
CREATE TYPE "FindingSeverity" AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FindingKind" AS ENUM ('FINDING', 'OPPORTUNITY', 'HYPOTHESIS');

-- CreateEnum
CREATE TYPE "AiStatus" AS ENUM ('PENDING', 'SKIPPED_GATE', 'COMPLETED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "OpportunityConfidence" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "BriefStatus" AS ENUM ('DRAFT', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobKind" AS ENUM ('DISCOVER', 'CRAWL', 'AUDIT', 'INTERPRET', 'COMPETITOR', 'REAUDIT', 'EXPORT');

-- CreateEnum
CREATE TYPE "ReviewSentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'MIXED');

-- CreateEnum
CREATE TYPE "ReauditCadence" AS ENUM ('OFF', 'WEEKLY', 'MONTHLY', 'QUARTERLY');

-- CreateEnum
CREATE TYPE "ChangeKind" AS ENUM ('SCORE_UP', 'SCORE_DOWN', 'FINDING_RESOLVED', 'FINDING_NEW', 'CONTENT_CHANGED', 'WENT_OFFLINE', 'CAME_ONLINE');

-- CreateEnum
CREATE TYPE "CrmProvider" AS ENUM ('HUBSPOT', 'PIPEDRIVE', 'SALESFORCE', 'ZOHO', 'CSV', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "CrmSyncStatus" AS ENUM ('PENDING', 'SYNCED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('SCREENSHOT', 'PDF_REPORT', 'CSV_EXPORT', 'LOGO', 'OTHER');

-- AlterEnum
ALTER TYPE "MembershipRole" ADD VALUE 'admin';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UsageKind" ADD VALUE 'LIGHTHOUSE_RUN';
ALTER TYPE "UsageKind" ADD VALUE 'FILE_STORED';

-- AlterTable
ALTER TABLE "business" ADD COLUMN     "category" VARCHAR(160),
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "providerRaw" JSONB;

-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "lastReauditAt" TIMESTAMPTZ,
ADD COLUMN     "name" VARCHAR(160),
ADD COLUMN     "reauditCadence" "ReauditCadence" NOT NULL DEFAULT 'OFF';

-- AlterTable
ALTER TABLE "campaign_lead" ADD COLUMN     "aiStatus" "AiStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "opportunityScore" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "error" VARCHAR(1000),
DROP COLUMN "kind",
ADD COLUMN     "kind" "JobKind" NOT NULL DEFAULT 'DISCOVER';

-- AlterTable
ALTER TABLE "membership" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "brandColor" VARCHAR(16),
ADD COLUMN     "contactEmail" VARCHAR(255),
ADD COLUMN     "contactPhone" VARCHAR(40),
ADD COLUMN     "logoFileId" TEXT,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "usage_event" ADD COLUMN     "providerCost" DECIMAL(12,6);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "website_snapshot" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "fetchedUrl" VARCHAR(1000) NOT NULL,
    "finalUrl" VARCHAR(1000),
    "httpStatus" INTEGER,
    "contentHash" VARCHAR(64) NOT NULL,
    "pageCount" INTEGER NOT NULL DEFAULT 0,
    "robotsOutcome" VARCHAR(40),
    "title" VARCHAR(500),
    "headings" JSONB,
    "techStack" JSONB,
    "rawTextSize" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshot_page" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "httpStatus" INTEGER,
    "role" VARCHAR(40),
    "screenshotFileId" TEXT,
    "extracted" JSONB,

    CONSTRAINT "snapshot_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_audit" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "snapshotId" TEXT,
    "module" "AuditModule" NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "score" INTEGER,
    "metrics" JSONB,
    "toolName" VARCHAR(80),
    "toolVersion" VARCHAR(40),
    "deviceProfile" VARCHAR(40),
    "observedAt" TIMESTAMPTZ NOT NULL,
    "failureReason" VARCHAR(500),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technical_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_finding" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "kind" "FindingKind" NOT NULL DEFAULT 'FINDING',
    "severity" "FindingSeverity" NOT NULL DEFAULT 'INFO',
    "source" "EvidenceSource" NOT NULL DEFAULT 'DERIVED',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "message" VARCHAR(1000) NOT NULL,
    "evidence" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_finding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gbp_profile" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "primaryCategory" VARCHAR(160),
    "categories" JSONB,
    "completeness" INTEGER,
    "hoursPresent" BOOLEAN NOT NULL DEFAULT false,
    "photosCount" INTEGER,
    "postsPresent" BOOLEAN NOT NULL DEFAULT false,
    "ownerResponses" INTEGER,
    "napConsistent" BOOLEAN,
    "observedAt" TIMESTAMPTZ NOT NULL,
    "raw" JSONB,

    CONSTRAINT "gbp_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "provider" VARCHAR(40) NOT NULL,
    "providerReviewId" VARCHAR(120),
    "rating" INTEGER,
    "text" TEXT,
    "authorHash" VARCHAR(64),
    "sentiment" "ReviewSentiment",
    "themes" JSONB,
    "ownerResponded" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_set" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "subjectBusinessId" TEXT NOT NULL,
    "geography" VARCHAR(160) NOT NULL,
    "category" VARCHAR(160) NOT NULL,
    "observedAt" TIMESTAMPTZ NOT NULL,
    "summary" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitor_set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor" (
    "id" TEXT NOT NULL,
    "competitorSetId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "websiteUrl" VARCHAR(1000),
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "recentReviews" INTEGER,
    "signals" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brief" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" "BriefStatus" NOT NULL DEFAULT 'DRAFT',
    "aiStatus" "AiStatus" NOT NULL DEFAULT 'PENDING',
    "content" JSONB NOT NULL,
    "headlineOpportunity" VARCHAR(300),
    "suggestedService" VARCHAR(200),
    "confidence" "OpportunityConfidence" NOT NULL DEFAULT 'MEDIUM',
    "valueProposition" TEXT,
    "outreachAngle" TEXT,
    "coldEmailDraft" TEXT,
    "callScriptDraft" TEXT,
    "publicToken" VARCHAR(64),
    "pdfFileId" TEXT,
    "modelName" VARCHAR(80),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "publishedAt" TIMESTAMPTZ,

    CONSTRAINT "brief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brief_event" (
    "id" TEXT NOT NULL,
    "briefId" TEXT NOT NULL,
    "kind" VARCHAR(40) NOT NULL,
    "visitorHash" VARCHAR(64),
    "suspectedBot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brief_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_change" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "kind" "ChangeKind" NOT NULL,
    "previousScore" INTEGER,
    "currentScore" INTEGER,
    "detail" JSONB,
    "detectedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_connection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" "CrmProvider" NOT NULL,
    "label" VARCHAR(120),
    "credentials" JSONB,
    "webhookUrl" VARCHAR(1000),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "crm_connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_export" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "crmConnectionId" TEXT,
    "leadId" TEXT NOT NULL,
    "provider" "CrmProvider" NOT NULL,
    "status" "CrmSyncStatus" NOT NULL DEFAULT 'PENDING',
    "externalId" VARCHAR(255),
    "payload" JSONB,
    "error" VARCHAR(1000),
    "exportedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_export_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stored_file" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "kind" "FileKind" NOT NULL,
    "bucket" VARCHAR(120) NOT NULL,
    "objectKey" VARCHAR(500) NOT NULL,
    "contentType" VARCHAR(120),
    "sizeBytes" INTEGER,
    "checksum" VARCHAR(64),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stored_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "website_snapshot_businessId_createdAt_idx" ON "website_snapshot"("businessId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "website_snapshot_organizationId_businessId_contentHash_key" ON "website_snapshot"("organizationId", "businessId", "contentHash");

-- CreateIndex
CREATE INDEX "snapshot_page_snapshotId_idx" ON "snapshot_page"("snapshotId");

-- CreateIndex
CREATE INDEX "technical_audit_leadId_module_idx" ON "technical_audit"("leadId", "module");

-- CreateIndex
CREATE INDEX "technical_audit_organizationId_module_idx" ON "technical_audit"("organizationId", "module");

-- CreateIndex
CREATE INDEX "audit_finding_auditId_idx" ON "audit_finding"("auditId");

-- CreateIndex
CREATE INDEX "audit_finding_code_idx" ON "audit_finding"("code");

-- CreateIndex
CREATE UNIQUE INDEX "gbp_profile_businessId_key" ON "gbp_profile"("businessId");

-- CreateIndex
CREATE INDEX "gbp_profile_organizationId_idx" ON "gbp_profile"("organizationId");

-- CreateIndex
CREATE INDEX "review_businessId_reviewedAt_idx" ON "review"("businessId", "reviewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "review_businessId_provider_providerReviewId_key" ON "review"("businessId", "provider", "providerReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_set_leadId_key" ON "competitor_set"("leadId");

-- CreateIndex
CREATE INDEX "competitor_set_organizationId_idx" ON "competitor_set"("organizationId");

-- CreateIndex
CREATE INDEX "competitor_competitorSetId_idx" ON "competitor"("competitorSetId");

-- CreateIndex
CREATE UNIQUE INDEX "brief_leadId_key" ON "brief"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "brief_publicToken_key" ON "brief"("publicToken");

-- CreateIndex
CREATE INDEX "brief_organizationId_status_idx" ON "brief"("organizationId", "status");

-- CreateIndex
CREATE INDEX "brief_event_briefId_kind_idx" ON "brief_event"("briefId", "kind");

-- CreateIndex
CREATE INDEX "audit_change_organizationId_detectedAt_idx" ON "audit_change"("organizationId", "detectedAt");

-- CreateIndex
CREATE INDEX "audit_change_leadId_detectedAt_idx" ON "audit_change"("leadId", "detectedAt");

-- CreateIndex
CREATE INDEX "crm_connection_organizationId_idx" ON "crm_connection"("organizationId");

-- CreateIndex
CREATE INDEX "crm_export_organizationId_status_idx" ON "crm_export"("organizationId", "status");

-- CreateIndex
CREATE INDEX "crm_export_leadId_idx" ON "crm_export"("leadId");

-- CreateIndex
CREATE INDEX "stored_file_organizationId_kind_idx" ON "stored_file"("organizationId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "stored_file_bucket_objectKey_key" ON "stored_file"("bucket", "objectKey");

-- CreateIndex
CREATE INDEX "business_organizationId_normalizedDomain_idx" ON "business"("organizationId", "normalizedDomain");

-- CreateIndex
CREATE INDEX "campaign_organizationId_status_idx" ON "campaign"("organizationId", "status");

-- CreateIndex
CREATE INDEX "campaign_lead_campaignId_opportunityScore_idx" ON "campaign_lead"("campaignId", "opportunityScore");

-- CreateIndex
CREATE INDEX "job_organizationId_status_idx" ON "job"("organizationId", "status");

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_logoFileId_fkey" FOREIGN KEY ("logoFileId") REFERENCES "stored_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_snapshot" ADD CONSTRAINT "website_snapshot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshot_page" ADD CONSTRAINT "snapshot_page_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "website_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshot_page" ADD CONSTRAINT "snapshot_page_screenshotFileId_fkey" FOREIGN KEY ("screenshotFileId") REFERENCES "stored_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_audit" ADD CONSTRAINT "technical_audit_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_audit" ADD CONSTRAINT "technical_audit_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "website_snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_finding" ADD CONSTRAINT "audit_finding_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "technical_audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gbp_profile" ADD CONSTRAINT "gbp_profile_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_set" ADD CONSTRAINT "competitor_set_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_set" ADD CONSTRAINT "competitor_set_subjectBusinessId_fkey" FOREIGN KEY ("subjectBusinessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor" ADD CONSTRAINT "competitor_competitorSetId_fkey" FOREIGN KEY ("competitorSetId") REFERENCES "competitor_set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brief" ADD CONSTRAINT "brief_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brief" ADD CONSTRAINT "brief_pdfFileId_fkey" FOREIGN KEY ("pdfFileId") REFERENCES "stored_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brief_event" ADD CONSTRAINT "brief_event_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "brief"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_connection" ADD CONSTRAINT "crm_connection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_export" ADD CONSTRAINT "crm_export_crmConnectionId_fkey" FOREIGN KEY ("crmConnectionId") REFERENCES "crm_connection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_export" ADD CONSTRAINT "crm_export_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stored_file" ADD CONSTRAINT "stored_file_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
