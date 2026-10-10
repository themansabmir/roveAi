import "dotenv/config";
import { defineConfig } from "prisma/config";

const directUrl = process.env["DIRECT_URL"];
if (!directUrl) {
  throw new Error("DIRECT_URL is required for Prisma CLI migrations. Use the Neon direct host, not the pooler.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: directUrl,
  },
});
