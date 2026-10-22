-- CreateEnum
CREATE TYPE "InstructionStatus" AS ENUM ('PENDING', 'PARSED', 'NEEDS_CLARIFICATION', 'FAILED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ServiceCode" AS ENUM ('WEBSITE', 'TECHNICAL_SEO', 'LOCAL_SEO', 'PERFORMANCE', 'CONTENT', 'REPUTATION', 'BOOKING_CONVERSION', 'ADS', 'OTHER');

-- CreateEnum
CREATE TYPE "IdentityKind" AS ENUM ('PHONE', 'DOMAIN', 'PROVIDER_PLACE');

-- CreateEnum
CREATE TYPE "CreditTxKind" AS ENUM ('GRANT', 'PURCHASE', 'RESERVE', 'COMMIT', 'RELEASE', 'REFUND', 'ADJUST');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('OPEN', 'CAPTURED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "NotificationKind" AS ENUM ('TASK_COMPLETED', 'TASK_FAILED', 'REVIEW_NEEDED', 'CREDITS_LOW');

-- CreateEnum
CREATE TYPE "ReviewReason" AS ENUM ('LOW_CONFIDENCE', 'CONFLICTING_EVIDENCE', 'AI_UNAVAILABLE', 'NEEDS_CLARIFICATION');

-- CreateEnum
CREATE TYPE "ReviewItemStatus" AS ENUM ('OPEN', 'DISMISSED', 'APPROVED');

-- AlterTable
ALTER TABLE "campaign" ADD COLUMN "instructionId" TEXT;

-- AlterTable
ALTER TABLE "business" ADD COLUMN "duplicateOfBusinessId" TEXT;

-- AlterTable
ALTER TABLE "campaign_lead" ADD COLUMN "savedAt" TIMESTAMPTZ,
ADD COLUMN "savedByUserId" TEXT;

-- AlterTable
ALTER TABLE "job" ADD COLUMN "leadId" TEXT,
ADD COLUMN "module" "AuditModule";

-- CreateTable
CREATE TABLE "instruction" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "status" "InstructionStatus" NOT NULL DEFAULT 'PENDING',
    "parsed" JSONB,
    "plan" JSONB,
    "missingFields" JSONB,
    "modelName" VARCHAR(80),
    "error" VARCHAR(500),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_profile" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "positioning" VARCHAR(500),
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "service_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_offer" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" VARCHAR(1000),
    "codes" "ServiceCode"[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideal_client" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "niches" TEXT[],
    "locations" TEXT[],
    "minRating" DOUBLE PRECISION,
    "websitePref" "WebsiteFilter" NOT NULL DEFAULT 'EITHER',

    CONSTRAINT "ideal_client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_identity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "kind" "IdentityKind" NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "business_identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_opportunity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "suggestedService" "ServiceCode",
    "confidence" "OpportunityConfidence" NOT NULL DEFAULT 'MEDIUM',
    "verificationNeeded" VARCHAR(500),
    "conflictingEvidence" VARCHAR(500),
    "rank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_opportunity_evidence" (
    "opportunityId" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,

    CONSTRAINT "lead_opportunity_evidence_pkey" PRIMARY KEY ("opportunityId","findingId")
);

-- CreateTable
CREATE TABLE "lead_match" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "fit" INTEGER NOT NULL,
    "reasons" JSONB NOT NULL,

    CONSTRAINT "lead_match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_score" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "evidenceScore" INTEGER NOT NULL,
    "fitScore" INTEGER NOT NULL,
    "relevanceScore" INTEGER NOT NULL,
    "confidence" "OpportunityConfidence" NOT NULL DEFAULT 'MEDIUM',
    "breakdown" JSONB NOT NULL,
    "computedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prospect_tag" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prospect_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_tag" (
    "leadId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "lead_tag_pkey" PRIMARY KEY ("leadId","tagId")
);

-- CreateTable
CREATE TABLE "saved_view" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "filters" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_account" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "lifetimeGranted" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "credit_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_reservation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "campaignId" TEXT,
    "jobId" TEXT,
    "estimated" INTEGER NOT NULL,
    "captured" INTEGER NOT NULL DEFAULT 0,
    "status" "ReservationStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "credit_reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_ledger" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "kind" "CreditTxKind" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "reservationId" TEXT,
    "usageEventId" TEXT,
    "paymentId" TEXT,
    "reason" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_pack" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "credits" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'usd',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "credit_pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "packId" TEXT,
    "provider" VARCHAR(40) NOT NULL,
    "providerRef" VARCHAR(255) NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" VARCHAR(8) NOT NULL,
    "creditsGranted" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "raw" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "kind" "NotificationKind" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" VARCHAR(1000),
    "entityType" VARCHAR(40),
    "entityId" TEXT,
    "readAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_item" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "reason" "ReviewReason" NOT NULL,
    "status" "ReviewItemStatus" NOT NULL DEFAULT 'OPEN',
    "detail" VARCHAR(500),
    "resolvedByUserId" TEXT,
    "resolvedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_event" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "name" VARCHAR(80) NOT NULL,
    "properties" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "instruction_organizationId_createdAt_idx" ON "instruction"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "service_profile_organizationId_key" ON "service_profile"("organizationId");

-- CreateIndex
CREATE INDEX "service_offer_organizationId_active_idx" ON "service_offer"("organizationId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "ideal_client_profileId_key" ON "ideal_client"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "business_identity_organizationId_kind_value_key" ON "business_identity"("organizationId", "kind", "value");

-- CreateIndex
CREATE INDEX "business_identity_businessId_idx" ON "business_identity"("businessId");

-- CreateIndex
CREATE INDEX "lead_opportunity_leadId_rank_idx" ON "lead_opportunity"("leadId", "rank");

-- CreateIndex
CREATE INDEX "lead_opportunity_organizationId_idx" ON "lead_opportunity"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_match_leadId_offerId_opportunityId_key" ON "lead_match"("leadId", "offerId", "opportunityId");

-- CreateIndex
CREATE INDEX "lead_match_leadId_idx" ON "lead_match"("leadId");

-- CreateIndex
CREATE INDEX "lead_match_organizationId_idx" ON "lead_match"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_score_leadId_key" ON "lead_score"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "prospect_tag_organizationId_name_key" ON "prospect_tag"("organizationId", "name");

-- CreateIndex
CREATE INDEX "saved_view_organizationId_idx" ON "saved_view"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_account_organizationId_key" ON "credit_account"("organizationId");

-- CreateIndex
CREATE INDEX "credit_reservation_organizationId_status_idx" ON "credit_reservation"("organizationId", "status");

-- CreateIndex
CREATE INDEX "credit_reservation_jobId_idx" ON "credit_reservation"("jobId");

-- CreateIndex
CREATE INDEX "credit_ledger_organizationId_createdAt_idx" ON "credit_ledger"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payment_providerRef_key" ON "payment"("providerRef");

-- CreateIndex
CREATE INDEX "payment_organizationId_createdAt_idx" ON "payment"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "notification_organizationId_createdAt_idx" ON "notification"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "notification_userId_readAt_idx" ON "notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "review_item_organizationId_status_idx" ON "review_item"("organizationId", "status");

-- CreateIndex
CREATE INDEX "review_item_leadId_idx" ON "review_item"("leadId");

-- CreateIndex
CREATE INDEX "analytics_event_organizationId_name_createdAt_idx" ON "analytics_event"("organizationId", "name", "createdAt");

-- CreateIndex
CREATE INDEX "campaign_instructionId_idx" ON "campaign"("instructionId");

-- CreateIndex
CREATE INDEX "business_duplicateOfBusinessId_idx" ON "business"("duplicateOfBusinessId");

-- CreateIndex
CREATE INDEX "campaign_lead_savedByUserId_idx" ON "campaign_lead"("savedByUserId");

-- CreateIndex
CREATE INDEX "job_leadId_kind_idx" ON "job"("leadId", "kind");

-- AddForeignKey
ALTER TABLE "instruction" ADD CONSTRAINT "instruction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruction" ADD CONSTRAINT "instruction_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_profile" ADD CONSTRAINT "service_profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_offer" ADD CONSTRAINT "service_offer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "service_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_offer" ADD CONSTRAINT "service_offer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideal_client" ADD CONSTRAINT "ideal_client_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "service_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "instruction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_duplicateOfBusinessId_fkey" FOREIGN KEY ("duplicateOfBusinessId") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_identity" ADD CONSTRAINT "business_identity_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_lead" ADD CONSTRAINT "campaign_lead_savedByUserId_fkey" FOREIGN KEY ("savedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_opportunity" ADD CONSTRAINT "lead_opportunity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_opportunity_evidence" ADD CONSTRAINT "lead_opportunity_evidence_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "lead_opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_opportunity_evidence" ADD CONSTRAINT "lead_opportunity_evidence_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "audit_finding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_match" ADD CONSTRAINT "lead_match_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_match" ADD CONSTRAINT "lead_match_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "service_offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_match" ADD CONSTRAINT "lead_match_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "lead_opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_score" ADD CONSTRAINT "lead_score_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospect_tag" ADD CONSTRAINT "prospect_tag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_tag" ADD CONSTRAINT "lead_tag_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_tag" ADD CONSTRAINT "lead_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "prospect_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_view" ADD CONSTRAINT "saved_view_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_account" ADD CONSTRAINT "credit_account_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_reservation" ADD CONSTRAINT "credit_reservation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "credit_reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_usageEventId_fkey" FOREIGN KEY ("usageEventId") REFERENCES "usage_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_packId_fkey" FOREIGN KEY ("packId") REFERENCES "credit_pack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "campaign_lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_item" ADD CONSTRAINT "review_item_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
