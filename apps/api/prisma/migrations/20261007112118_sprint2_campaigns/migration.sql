-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'QUEUED', 'DISCOVERING', 'PROCESSING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'PAUSED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WebsiteFilter" AS ENUM ('OWNED', 'MISSING', 'EITHER');

-- CreateEnum
CREATE TYPE "WebsiteClass" AS ENUM ('OWNED_SITE', 'SOCIAL', 'DIRECTORY', 'BOOKING', 'MISSING');

-- CreateEnum
CREATE TYPE "QualificationStatus" AS ENUM ('NEW', 'QUALIFIED', 'EXCLUDED_EXISTING_CLIENT', 'LOW_RATING', 'LOW_PRIORITY', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'SKIPPED_NO_WEBSITE', 'SKIPPED_NOT_OWNED_SITE', 'SKIPPED_BY_ROBOTS', 'UNREACHABLE', 'BLOCKED', 'LOW_TEXT', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UsageKind" AS ENUM ('MAPS_RECORD', 'WEBSITE_PAGE', 'LLM_INPUT_TOKEN', 'LLM_OUTPUT_TOKEN');

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "llmTokenLimit" INTEGER NOT NULL DEFAULT 500000,
ADD COLUMN     "mapsRecordLimit" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "pageFetchLimit" INTEGER NOT NULL DEFAULT 2000;

-- CreateTable
CREATE TABLE "campaign" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "niche" VARCHAR(120) NOT NULL,
    "serviceType" VARCHAR(120) NOT NULL,
    "city" VARCHAR(120) NOT NULL,
    "region" VARCHAR(120) NOT NULL,
    "country" VARCHAR(120) NOT NULL,
    "maxLeads" INTEGER NOT NULL,
    "minRating" DOUBLE PRECISION,
    "minReviewCount" INTEGER,
    "websiteFilter" "WebsiteFilter" NOT NULL DEFAULT 'EITHER',
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exclusion_domain" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exclusion_domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" VARCHAR(40) NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "normalizedName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40),
    "normalizedPhone" VARCHAR(40),
    "address" VARCHAR(500),
    "city" VARCHAR(120),
    "region" VARCHAR(120),
    "country" VARCHAR(120),
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "websiteUrl" VARCHAR(1000),
    "normalizedDomain" VARCHAR(255),
    "websiteClass" "WebsiteClass" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_lead" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "qualificationStatus" "QualificationStatus" NOT NULL DEFAULT 'NEW',
    "auditStatus" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "kind" VARCHAR(40) NOT NULL DEFAULT 'discover',
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "queueJobId" VARCHAR(64),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_event" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "campaignId" TEXT,
    "kind" "UsageKind" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaign_organizationId_createdAt_idx" ON "campaign"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "exclusion_domain_campaignId_domain_key" ON "exclusion_domain"("campaignId", "domain");

-- CreateIndex
CREATE INDEX "business_organizationId_normalizedName_normalizedPhone_city_idx" ON "business"("organizationId", "normalizedName", "normalizedPhone", "city");

-- CreateIndex
CREATE UNIQUE INDEX "business_organizationId_provider_providerId_key" ON "business"("organizationId", "provider", "providerId");

-- CreateIndex
CREATE INDEX "campaign_lead_campaignId_idx" ON "campaign_lead"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_lead_campaignId_businessId_key" ON "campaign_lead"("campaignId", "businessId");

-- CreateIndex
CREATE INDEX "job_campaignId_createdAt_idx" ON "job"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "usage_event_organizationId_kind_createdAt_idx" ON "usage_event"("organizationId", "kind", "createdAt");

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exclusion_domain" ADD CONSTRAINT "exclusion_domain_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_lead" ADD CONSTRAINT "campaign_lead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_lead" ADD CONSTRAINT "campaign_lead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_event" ADD CONSTRAINT "usage_event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_event" ADD CONSTRAINT "usage_event_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
