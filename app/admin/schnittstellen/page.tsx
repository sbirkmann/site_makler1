import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { prisma } from "@/lib/db";
import { createFtpAccountAction, deleteFtpAccountAction, saveBlogApiSettingsAction, saveLeadPushProvidersAction } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

const providers = ["ONOFFICE", "PROPSTACK", "FLOWFACT"] as const;

export default async function IntegrationsPage() {
  if (!(await getSession())) redirect("/admin/login");
  const [accounts, configured, blogApi] = await Promise.all([
    prisma.ftpAccount.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.leadPushProvider.findMany(),
    prisma.blogApiSettings.findUnique({ where: { id: "default" } }),
  ]);
  const byProvider = Object.fromEntries(configured.map((p) => [p.provider, p]));
  const input = "mt-1 w-full rounded-[var(--radius-sm)] border border-line-strong bg-surface px-3 py-2 text-[0.875rem] text-primary-950";

  return <div className="flex max-w-4xl flex-col gap-10">
    <div><h1 className="display-3 text-primary-950">Schnittstellen</h1><p className="mt-2 text-[0.9375rem] text-ink-muted">FTP-Import, CRM-Übergaben und die API für automatisierte Ratgeberinhalte.</p></div>
    <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold text-primary-950">OpenImmo-FTP</h2><p className="mt-1 text-sm text-ink-muted">ZIP-Dateien mit <code>openimmo.xml</code> und Bildern nach <code>/imports</code> hochladen. Der Importdienst löscht erfolgreich verarbeitete und doppelte Dateien.</p>
      <form action={createFtpAccountAction} className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Benutzername<input required name="username" pattern="[a-z0-9][a-z0-9_-]{2,63}" className={input} /></label><label className="text-sm font-medium">Passwort (mind. 12 Zeichen)<input required name="password" type="password" minLength={12} className={input} /></label><button className="w-fit rounded-[var(--radius-sm)] bg-primary-800 px-4 py-2 text-sm font-medium text-white">FTP-Zugang anlegen</button></form>
      <div className="mt-5 divide-y divide-line">{accounts.length ? accounts.map((account) => <div key={account.id} className="flex items-center justify-between py-3 text-sm"><span><b>{account.username}</b><span className="ml-2 text-ink-subtle">{account.homeDir}</span></span><form action={deleteFtpAccountAction}><input type="hidden" name="id" value={account.id}/><button className="text-red-700">Entfernen</button></form></div>) : <p className="py-3 text-sm text-ink-subtle">Noch kein FTP-Zugang angelegt.</p>}</div>
    </section>
    <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-6"><h2 className="text-lg font-semibold text-primary-950">Anfragen an CRM weiterleiten</h2><p className="mt-1 text-sm text-ink-muted">Pro Anbieter die jeweilige Webhook-/API-URL und den API-Key eintragen. Nur aktivierte Ziele erhalten neue Anfragen.</p><form action={saveLeadPushProvidersAction} className="mt-5 space-y-5">{providers.map((name) => { const p = byProvider[name]; return <fieldset key={name} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[auto_1fr_1fr]"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name={`${name}_enabled`} defaultChecked={p?.enabled}/>{name}</label><label className="text-sm">Endpoint<input name={`${name}_endpoint`} type="url" defaultValue={p?.endpoint ?? ""} placeholder="https://…" className={input}/></label><label className="text-sm">API-Key<input name={`${name}_apiKey`} type="password" defaultValue={p?.apiKey ?? ""} className={input}/></label></fieldset>; })}<button className="rounded-[var(--radius-sm)] bg-primary-800 px-4 py-2 text-sm font-medium text-white">CRM-Einstellungen speichern</button></form></section>
    <section className="rounded-[var(--radius-lg)] border border-line bg-surface p-6"><h2 className="text-lg font-semibold text-primary-950">Ratgeber-API</h2><p className="mt-1 text-sm text-ink-muted">POST <code>/api/blog-import</code> akzeptiert title, slug, excerpt, content, coverImage und published. Damit kann eine KI Inhalte als Entwurf oder veröffentlicht anlegen/aktualisieren.</p><form action={saveBlogApiSettingsAction} className="mt-4 grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-2 text-sm"><input name="enabled" type="checkbox" defaultChecked={blogApi?.enabled}/> API aktiv</label><label className="flex items-center gap-2 text-sm"><input name="allowUnauthenticated" type="checkbox" defaultChecked={blogApi?.allowUnauthenticated}/> ohne Auth erlauben</label><label className="text-sm sm:col-span-2">API-Key<input name="apiKey" type="password" defaultValue={blogApi?.apiKey ?? ""} className={input}/></label><button className="w-fit rounded-[var(--radius-sm)] bg-primary-800 px-4 py-2 text-sm font-medium text-white">API-Einstellungen speichern</button></form></section>
  </div>;
}
