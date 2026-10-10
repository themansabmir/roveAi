import { resetConfigForTests } from "./config";

describe("loadConfig", () => {
  afterEach(() => {
    resetConfigForTests();
  });

  it("reads the database url and auth secret", async () => {
    const { loadConfig } = await import("./config");
    const config = loadConfig();
    expect(config.NODE_ENV).toBe("test");
    expect(config.DATABASE_URL.startsWith("postgresql://")).toBe(true);
    expect(config.BETTER_AUTH_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
