import "server-only";
import { prisma } from "@/lib/db";

export async function findReviews(take?: number) {
  return prisma.review.findMany({
    where: { published: true },
    orderBy: { reviewedAt: "desc" },
    take,
  });
}

export async function getReviewSummary() {
  const [agg, distribution] = await Promise.all([
    prisma.review.aggregate({
      where: { published: true },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { published: true },
      _count: { _all: true },
    }),
  ]);

  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of distribution) counts[row.rating] = row._count._all;

  return {
    average: Math.round((agg._avg.rating ?? 0) * 10) / 10,
    total: agg._count._all,
    distribution: counts,
  };
}
