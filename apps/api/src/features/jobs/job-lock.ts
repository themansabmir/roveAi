import { PrismaClient } from "@prisma/client";

export type JobClaim = "ready" | "done" | "owned";

export async function claimJob(prisma: PrismaClient, jobId: string, timeoutMs: number): Promise<JobClaim> {
  const staleBefore = new Date(Date.now() - timeoutMs);
  const claimed = await prisma.job.updateMany({
    where: {
      id: jobId,
      OR: [{ status: "PENDING" }, { status: "PROCESSING", updatedAt: { lt: staleBefore } }],
    },
    data: { status: "PROCESSING", attemptCount: { increment: 1 } },
  });
  if (claimed.count === 1) return "ready";

  const job = await prisma.job.findUnique({ where: { id: jobId }, select: { status: true } });
  if (!job || job.status === "CANCELLED" || job.status === "COMPLETED" || job.status === "FAILED") {
    return "done";
  }
  return "owned";
}

export async function releaseJob(prisma: PrismaClient, jobId: string): Promise<void> {
  await prisma.job.updateMany({
    where: { id: jobId, status: "PROCESSING" },
    data: { status: "PENDING" },
  });
}
