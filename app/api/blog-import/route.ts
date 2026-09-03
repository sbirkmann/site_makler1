import { createHash, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function same(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

export async function POST(request: Request) {
  const settings = await prisma.blogApiSettings.findUnique({ where: { id: "default" } });
  if (!settings?.enabled) return Response.json({ error: "Blog-API ist deaktiviert." }, { status: 404 });

  const provided = request.headers.get("x-api-key") ?? "";
  if (!settings.allowUnauthenticated && (!settings.apiKey || !same(provided, settings.apiKey))) {
    return Response.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Ungültiges JSON." }, { status: 400 });
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const excerpt = typeof body?.excerpt === "string" ? body.excerpt.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!title || !excerpt || !content || !/^[a-z0-9-]{3,160}$/.test(slug)) {
    return Response.json({ error: "title, slug, excerpt und content sind erforderlich." }, { status: 400 });
  }

  const post = await prisma.blogPost.upsert({
    where: { slug },
    create: { title, slug, excerpt, content, coverImage: typeof body.coverImage === "string" ? body.coverImage : null, published: body.published !== false, publishedAt: body.published === false ? null : new Date() },
    update: { title, excerpt, content, coverImage: typeof body.coverImage === "string" ? body.coverImage : undefined, published: body.published !== false, publishedAt: body.published === false ? null : new Date() },
  });
  return Response.json({ id: post.id, slug: post.slug, checksum: createHash("sha256").update(post.content).digest("hex") }, { status: 201 });
}
