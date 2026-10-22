-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('SUPER_ADMIN', 'MEMBER', 'SUPPORT');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "platformRole" "PlatformRole";
