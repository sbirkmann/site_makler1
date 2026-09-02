import "server-only";
import { prisma } from "@/lib/db";

export async function findBlogPosts(options?: { category?: string; take?: number }) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      ...(options?.category ? { category: { slug: options.category } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
    take: options?.take,
  });
}

export async function findBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, published: true },
    include: { category: true, author: true },
  });
}

export async function findBlogCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: { where: { published: true } } } } },
  });
}

export async function findRelatedPosts(postId: string, categoryId: string | null, take = 3) {
  const related = categoryId
    ? await prisma.blogPost.findMany({
        where: { published: true, categoryId, id: { not: postId } },
        orderBy: { publishedAt: "desc" },
        include: { category: true },
        take,
      })
    : [];

  if (related.length >= take) return related;

  const fill = await prisma.blogPost.findMany({
    where: { published: true, id: { notIn: [postId, ...related.map((p) => p.id)] } },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
    take: take - related.length,
  });

  return [...related, ...fill];
}

export async function findAllPostSlugs() {
  return prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
}
