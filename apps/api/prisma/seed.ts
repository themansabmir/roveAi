import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Promote a user to platform super admin by email.
 *
 * Usage:
 *   pnpm --filter @rove/api db:promote-admin -- user@example.com
 *   (or) ts-node prisma/seed.ts user@example.com
 *
 * The user must already exist (sign them up through the app first). This script
 * only flips `isSuperAdmin`. There is no self-signup for super admins.
 */
async function main(): Promise<void> {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: db:promote-admin -- <email>");
    process.exit(1);
  }

  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(`No user found with email "${email}". Sign them up first.`);
      process.exit(1);
    }
    if (user.isSuperAdmin) {
      console.log(`User "${email}" is already a super admin.`);
      return;
    }
    await prisma.user.update({
      where: { email },
      data: { isSuperAdmin: true },
    });
    console.log(`Promoted "${email}" to super admin.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
