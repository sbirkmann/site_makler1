import "server-only";
import { prisma } from "@/lib/db";

export async function findAgents() {
  return prisma.agent.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { lastName: "asc" }],
  });
}

export async function findAgentBySlug(slug: string) {
  return prisma.agent.findUnique({ where: { slug } });
}

export async function findPrimaryAgent() {
  return prisma.agent.findFirst({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}
