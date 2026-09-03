import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { saveBlogAction } from "@/lib/actions/admin";
export default async function NewBlogPage() {
  if (!(await getSession())) redirect("/admin/login");
  const input = "mt-1 w-full rounded-[var(--radius-sm)] border border-line-strong bg-surface px-3 py-2 text-sm";
  return <div className="max-w-3xl"><h1 className="display-3 text-primary-950">Ratgeberbeitrag anlegen</h1><form action={saveBlogAction} encType="multipart/form-data" className="mt-7 grid gap-5 rounded-[var(--radius-lg)] border border-line bg-surface p-6"><label className="text-sm font-medium">Titel<input name="title" required className={input}/></label><label className="text-sm font-medium">Slug<input name="slug" required pattern="[a-z0-9-]{3,160}" className={input}/></label><label className="text-sm font-medium">Kurzbeschreibung<textarea name="excerpt" required className={input}/></label><label className="text-sm font-medium">Inhalt<textarea name="content" required rows={14} className={input}/></label><label className="text-sm font-medium">Titelbild<input name="coverImage" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-2 block text-sm"/></label><label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked/> Sofort veröffentlichen</label><button className="w-fit rounded-[var(--radius-sm)] bg-primary-800 px-4 py-2 text-sm font-medium text-white">Beitrag speichern</button></form></div>;
}
