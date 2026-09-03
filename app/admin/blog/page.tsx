import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function AdminBlogPage() {
  if (!(await getSession())) redirect("/admin/login");
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return <div className="flex max-w-4xl flex-col gap-7"><div className="flex items-center justify-between"><div><h1 className="display-3 text-primary-950">Ratgeber</h1><p className="mt-2 text-sm text-ink-muted">Beiträge manuell anlegen oder über die konfigurierte API befüllen.</p></div><Link href="/admin/blog/neu" className="rounded-[var(--radius-sm)] bg-primary-800 px-4 py-2 text-sm font-medium text-white">Beitrag anlegen</Link></div><div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">{posts.map((post) => <div key={post.id} className="flex justify-between border-b border-line px-5 py-4 text-sm"><span><b>{post.title}</b><span className="ml-2 text-ink-subtle">/{post.slug}</span></span><span className="text-ink-subtle">{post.published ? "Veröffentlicht" : "Entwurf"}</span></div>)}{!posts.length && <p className="p-8 text-center text-sm text-ink-subtle">Noch keine Beiträge vorhanden.</p>}</div></div>;
}
