import request from "supertest";
import type { Express } from "express";
import { buildApp } from "../../server";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { registry } from "@core/registry";

const origin = "http://localhost:5173";

function cookiesFrom(setCookie: string | string[] | undefined): string {
  if (!setCookie) return "";
  const list = Array.isArray(setCookie) ? setCookie : [setCookie];
  return list.map((cookie) => cookie.split(";")[0]).join("; ");
}

async function signUpAndCreateWorkspace(
  app: Express.Application,
  input: { name: string; email: string; password: string; agencyName: string }
) {
  const signUp = await request(app)
    .post("/api/auth/sign-up/email")
    .set("Origin", origin)
    .send({ name: input.name, email: input.email, password: input.password });

  expect(signUp.status, JSON.stringify(signUp.body)).toBe(200);
  const cookie = cookiesFrom(signUp.headers["set-cookie"]);
  expect(cookie).not.toBe("");

  const workspace = await request(app)
    .post("/api/workspaces")
    .set("Origin", origin)
    .set("Cookie", cookie)
    .send({ name: input.agencyName });

  expect(workspace.status, JSON.stringify(workspace.body)).toBe(200);
  return { cookie, organizationId: workspace.body.id as string };
}

const hasRealDb = Boolean(
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("HOST-pooler.REGION.aws.neon.tech")
);

describe.skipIf(!hasRealDb)("organization access", () => {
  const emails: string[] = [];
  const organizationIds: string[] = [];
  let app: Express.Application;

  beforeAll(async () => {
    const built = await buildApp();
    app = built.app;
  });

  afterAll(async () => {
    const prisma = registry.get<IPrismaService>(PRISMA_PLUGIN).client;
    if (emails.length > 0) {
      await prisma.user.deleteMany({ where: { email: { in: emails } } });
    }
    if (organizationIds.length > 0) {
      await prisma.organization.deleteMany({ where: { id: { in: organizationIds } } });
    }
    await registry.shutdownAll();
  });

  it("rejects a user who requests another organization", async () => {
    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const password = "password1234";
    const emailA = `localbrief-sprint1-a-${stamp}@example.com`;
    const emailB = `localbrief-sprint1-b-${stamp}@example.com`;
    emails.push(emailA, emailB);

    const agencyA = await signUpAndCreateWorkspace(app, {
      name: "Ada Agency",
      email: emailA,
      password,
      agencyName: "Ada Studio",
    });
    const agencyB = await signUpAndCreateWorkspace(app, {
      name: "Bea Agency",
      email: emailB,
      password,
      agencyName: "Bea Studio",
    });
    organizationIds.push(agencyA.organizationId, agencyB.organizationId);

    const repeated = await request(app)
      .post("/api/workspaces")
      .set("Origin", origin)
      .set("Cookie", agencyA.cookie)
      .send({ name: "Ada Studio Again" });
    expect(repeated.status).toBe(200);
    expect(repeated.body.id).toBe(agencyA.organizationId);

    const own = await request(app)
      .get(`/api/organizations/${agencyA.organizationId}`)
      .set("Origin", origin)
      .set("Cookie", agencyA.cookie);
    expect(own.status).toBe(200);
    expect(own.body.name).toBe("Ada Studio");

    const cross = await request(app)
      .get(`/api/organizations/${agencyB.organizationId}`)
      .set("Origin", origin)
      .set("Cookie", agencyA.cookie);
    expect(cross.status).toBe(403);

    const reverse = await request(app)
      .get(`/api/organizations/${agencyA.organizationId}`)
      .set("Origin", origin)
      .set("Cookie", agencyB.cookie);
    expect(reverse.status).toBe(403);
  });
});
