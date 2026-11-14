import request from "supertest";
import type { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { buildApp } from "../../server";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { registry } from "@core/registry";
import { MapsBusiness, MapsProvider, MapsQuotaError } from "@plugins/maps/maps.types";
import { loadConfig } from "@core/config";
import { AuditScheduler } from "@features/audits/audit-scheduler";
import { CampaignRepository } from "./campaign.repository";
import { DiscoveryService } from "./discovery.service";

const origin = "http://localhost:5173";

function cookiesFrom(setCookie: string | string[] | undefined): string {
  if (!setCookie) return "";
  const list = Array.isArray(setCookie) ? setCookie : [setCookie];
  return list.map((cookie) => cookie.split(";")[0]).join("; ");
}

function place(overrides: Partial<MapsBusiness> & Pick<MapsBusiness, "providerId" | "name">): MapsBusiness {
  return {
    phone: "+1 512 555 0101",
    address: "100 Main St",
    city: "Austin",
    region: "Texas",
    country: "United States",
    rating: 4.6,
    reviewCount: 42,
    websiteUrl: "https://harbordental.example",
    ...overrides,
  };
}

class ScriptedMaps implements MapsProvider {
  calls = 0;
  constructor(private readonly onSearch: (call: number) => Promise<MapsBusiness[]>) {}

  async search(): Promise<MapsBusiness[]> {
    this.calls += 1;
    return this.onSearch(this.calls);
  }
}

async function signUp(app: Express.Application, email: string, agencyName: string) {
  const signUpResponse = await request(app)
    .post("/api/auth/sign-up/email")
    .set("Origin", origin)
    .send({ name: "Campaign Tester", email, password: "password1234" });
  expect(signUpResponse.status, JSON.stringify(signUpResponse.body)).toBe(200);
  const cookie = cookiesFrom(signUpResponse.headers["set-cookie"]);
  const workspace = await request(app)
    .post("/api/workspaces")
    .set("Origin", origin)
    .set("Cookie", cookie)
    .send({ name: agencyName });
  expect(workspace.status, JSON.stringify(workspace.body)).toBe(200);
  return { cookie, organizationId: workspace.body.id as string };
}

async function createCampaign(
  app: Express.Application,
  cookie: string,
  organizationId: string,
  extra: Record<string, unknown> = {}
) {
  const response = await request(app)
    .post(`/api/organizations/${organizationId}/campaigns`)
    .set("Origin", origin)
    .set("Cookie", cookie)
    .send({
      niche: "Dentist",
      serviceType: "Local SEO",
      city: "Austin",
      region: "Texas",
      country: "United States",
      maxLeads: 10,
      ...extra,
    });
  expect(response.status, JSON.stringify(response.body)).toBe(201);
  return response.body as { id: string };
}

const hasRealDb = Boolean(
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("HOST-pooler.REGION.aws.neon.tech")
);

describe.skipIf(!hasRealDb)("campaign discovery", () => {
  const emails: string[] = [];
  const organizationIds: string[] = [];
  let app: Express.Application;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const built = await buildApp();
    app = built.app;
    prisma = registry.get<IPrismaService>(PRISMA_PLUGIN).client;
  });

  afterAll(async () => {
    if (emails.length > 0) {
      await prisma.user.deleteMany({ where: { email: { in: emails } } });
    }
    if (organizationIds.length > 0) {
      await prisma.organization.deleteMany({ where: { id: { in: organizationIds } } });
    }
    await registry.shutdownAll();
  });

  async function account(label: string) {
    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const email = `localbrief-sprint2-${label}-${stamp}@example.com`;
    emails.push(email);
    const signed = await signUp(app, email, `${label} studio`);
    organizationIds.push(signed.organizationId);
    return signed;
  }

  async function discover(campaignId: string, jobId: string, maps: MapsProvider) {
    const published: string[] = [];
    const queue = {
      async publish(queueName: string): Promise<string> {
        published.push(queueName);
        return `test-${published.length}`;
      },
    };
    const discovery = new DiscoveryService(
      new CampaignRepository(prisma),
      maps,
      new AuditScheduler(prisma, queue, loadConfig().CRAWL_MAX_PAGES)
    );
    await discovery.run(campaignId, jobId, { retrycount: 0, retrylimit: 2 });
  }

  it("rejects a campaign read from another organization", async () => {
    const owner = await account("owner");
    const other = await account("other");
    const campaign = await createCampaign(app, owner.cookie, owner.organizationId);

    const forbidden = await request(app)
      .get(`/api/organizations/${owner.organizationId}/campaigns/${campaign.id}`)
      .set("Origin", origin)
      .set("Cookie", other.cookie);

    expect(forbidden.status).toBe(403);
  });

  it("returns the same job when run is submitted twice", async () => {
    const owner = await account("double");
    const campaign = await createCampaign(app, owner.cookie, owner.organizationId);
    const first = await request(app)
      .post(`/api/organizations/${owner.organizationId}/campaigns/${campaign.id}/run`)
      .set("Origin", origin)
      .set("Cookie", owner.cookie);
    const second = await request(app)
      .post(`/api/organizations/${owner.organizationId}/campaigns/${campaign.id}/run`)
      .set("Origin", origin)
      .set("Cookie", owner.cookie);

    expect(first.status, JSON.stringify(first.body)).toBe(200);
    expect(second.status, JSON.stringify(second.body)).toBe(200);
    expect(second.body.job.id).toBe(first.body.job.id);
    expect(await prisma.job.count({ where: { campaignId: campaign.id } })).toBe(1);
  });

  it("pauses on HTTP 429 and keeps leads already saved", async () => {
    const owner = await account("quota");
    const campaign = await createCampaign(app, owner.cookie, owner.organizationId);
    const started = await request(app)
      .post(`/api/organizations/${owner.organizationId}/campaigns/${campaign.id}/run`)
      .set("Origin", origin)
      .set("Cookie", owner.cookie);
    expect(started.status).toBe(200);

    const maps = new ScriptedMaps(async (call) => {
      if (call === 1) {
        return [place({ providerId: "quota-a", name: "Alpha Dental" }), place({ providerId: "quota-b", name: "Beta Dental" })];
      }
      throw new MapsQuotaError();
    });
    await discover(campaign.id, started.body.job.id as string, maps);

    const saved = await prisma.campaign.findUniqueOrThrow({
      where: { id: campaign.id },
      include: { leads: true },
    });
    expect(saved.status).toBe("PAUSED");
    expect(saved.leads).toHaveLength(2);
    expect(maps.calls).toBe(2);
  });

  it("completes when the provider returns no businesses", async () => {
    const owner = await account("empty");
    const campaign = await createCampaign(app, owner.cookie, owner.organizationId);
    const started = await request(app)
      .post(`/api/organizations/${owner.organizationId}/campaigns/${campaign.id}/run`)
      .set("Origin", origin)
      .set("Cookie", owner.cookie);

    await discover(campaign.id, started.body.job.id as string, new ScriptedMaps(async () => []));

    const saved = await prisma.campaign.findUniqueOrThrow({
      where: { id: campaign.id },
      include: { leads: true },
    });
    expect(saved.status).toBe("COMPLETED");
    expect(saved.leads).toHaveLength(0);
  });

  it("reuses a business for the same provider id or the same name, phone, and city", async () => {
    const owner = await account("dupe");
    const campaign = await createCampaign(app, owner.cookie, owner.organizationId);
    const started = await request(app)
      .post(`/api/organizations/${owner.organizationId}/campaigns/${campaign.id}/run`)
      .set("Origin", origin)
      .set("Cookie", owner.cookie);
    const shared = {
      name: "Harbor Dental",
      phone: "+1 512 555 0101",
      city: "Austin",
      websiteUrl: "https://harbordental.example",
    };

    await discover(
      campaign.id,
      started.body.job.id as string,
      new ScriptedMaps(async (call) =>
        call === 1
          ? [
              place({ ...shared, providerId: "same-id" }),
              place({ ...shared, providerId: "same-id" }),
              place({ ...shared, providerId: "other-id" }),
            ]
          : []
      )
    );

    expect(await prisma.business.count({ where: { organizationId: owner.organizationId } })).toBe(1);
    expect(await prisma.campaignLead.count({ where: { campaignId: campaign.id } })).toBe(1);
  });

  it("saves an excluded domain once and does not insert a second business for the same provider id", async () => {
    const owner = await account("exclude");
    const campaign = await createCampaign(app, owner.cookie, owner.organizationId, {
      exclusionDomains: ["https://www.harbordental.example/contact"],
    });
    const started = await request(app)
      .post(`/api/organizations/${owner.organizationId}/campaigns/${campaign.id}/run`)
      .set("Origin", origin)
      .set("Cookie", owner.cookie);

    await discover(
      campaign.id,
      started.body.job.id as string,
      new ScriptedMaps(async (call) =>
        call === 1
          ? [
              place({ providerId: "excluded-id", name: "Harbor Dental" }),
              place({ providerId: "excluded-id", name: "Harbor Dental" }),
            ]
          : []
      )
    );

    const leads = await prisma.campaignLead.findMany({
      where: { campaignId: campaign.id },
      include: { business: true },
    });
    expect(leads).toHaveLength(1);
    expect(leads[0]?.qualificationStatus).toBe("EXCLUDED_EXISTING_CLIENT");
    expect(await prisma.business.count({ where: { organizationId: owner.organizationId } })).toBe(1);
  });
});
