import "dotenv/config";
import { defineConfig } from "prisma/config";

const directUrl = process.env["DIRECT_URL"] || process.env["DATABASE_URL"];
if (!directUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL is required for Prisma CLI migrations.");
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
