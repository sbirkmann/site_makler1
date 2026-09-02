import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { getDashboardStats, getRecentActivity } from "@/lib/repositories/admin";
import { formatDateShort } from "@/lib/utils";
import { leadSourceLabels, requestStatusLabels, requestStatusTone } from "@/lib/labels";
import { Badge } from "@/components/ui/Badge";
import { IconArrowRight, IconHouse, IconInbox, IconUsers, IconValuation } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [stats, activity] = await Promise.all([getDashboardStats(), getRecentActivity()]);

  const cards = [
    {
      label: "Immobilien",
      value: stats.propertyCount,
      detail: `${stats.publishedCount} veröffentlicht · ${stats.featuredCount} hervorgehoben`,
      href: "/admin/immobilien",
      Icon: IconHouse,
    },
    {
      label: "Neue Leads",
      value: stats.newLeads,
      detail: `${stats.totalLeads} insgesamt`,
      href: "/admin/anfragen?typ=leads",
      Icon: IconUsers,
    },
    {
      label: "Neue Bewertungsanfragen",
      value: stats.newValuations,
      detail: `${stats.totalValuations} insgesamt`,
      href: "/admin/anfragen?typ=bewertungen",
      Icon: IconValuation,
    },
    {
      label: "Neue Kontaktanfragen",
      value: stats.newContacts,
      detail: `${stats.totalContacts} insgesamt`,
      href: "/admin/anfragen?typ=kontakt",
      Icon: IconInbox,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="display-3 text-primary-950">Dashboard</h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          Überblick über Bestand und eingegangene Anfragen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-3 rounded-[var(--radius-lg)] border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <span className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-primary-700">
                <Icon size={19} />
              </span>
              <IconArrowRight
                size={17}
                className="text-ink-subtle transition-transform group-hover:translate-x-0.5"
              />
            </span>
            <span className="font-[family-name:var(--font-display)] text-[2.25rem] font-semibold leading-none text-primary-900">
              {value}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[0.9375rem] font-medium text-primary-950">{label}</span>
              <span className="text-[0.8125rem] text-ink-subtle">{detail}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Letzte Aktivitaet */}
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-[var(--radius-lg)] border border-line bg-surface">
          <h2 className="border-b border-line px-6 py-4 text-[0.9375rem] font-medium text-primary-950">
            Letzte Leads
          </h2>
          <ul className="divide-y divide-line">
            {activity.leads.length === 0 ? (
              <li className="px-6 py-8 text-center text-[0.875rem] text-ink-subtle">
                Noch keine Leads eingegangen.
              </li>
            ) : (
              activity.leads.map((lead) => (
                <li key={lead.id} className="flex flex-col gap-1.5 px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[0.9375rem] font-medium text-primary-950">
                      {lead.firstName ? `${lead.firstName} ` : ""}
                      {lead.lastName}
                    </span>
                    <Badge tone={requestStatusTone[lead.status]}>
                      {requestStatusLabels[lead.status]}
                    </Badge>
                  </div>
                  <span className="truncate text-[0.8125rem] text-ink-muted">
                    {leadSourceLabels[lead.source]}
                    {lead.property ? ` · ${lead.property.title}` : ""}
                  </span>
                  <span className="text-[0.75rem] text-ink-subtle">
                    {formatDateShort(lead.createdAt)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-line bg-surface">
          <h2 className="border-b border-line px-6 py-4 text-[0.9375rem] font-medium text-primary-950">
            Letzte Bewertungsanfragen
          </h2>
          <ul className="divide-y divide-line">
            {activity.valuations.length === 0 ? (
              <li className="px-6 py-8 text-center text-[0.875rem] text-ink-subtle">
                Noch keine Anfragen eingegangen.
              </li>
            ) : (
              activity.valuations.map((v) => (
                <li key={v.id} className="flex flex-col gap-1.5 px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[0.9375rem] font-medium text-primary-950">
                      {v.firstName} {v.lastName}
                    </span>
                    <Badge tone={requestStatusTone[v.status]}>
                      {requestStatusLabels[v.status]}
                    </Badge>
                  </div>
                  <span className="truncate text-[0.8125rem] text-ink-muted">
                    {v.zipCode} {v.city} · {v.funnel === "VERKAUF" ? "Verkauf" : "Bewertung"}
                  </span>
                  <span className="text-[0.75rem] text-ink-subtle">
                    {formatDateShort(v.createdAt)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-line bg-surface">
          <h2 className="border-b border-line px-6 py-4 text-[0.9375rem] font-medium text-primary-950">
            Letzte Kontaktanfragen
          </h2>
          <ul className="divide-y divide-line">
            {activity.contacts.length === 0 ? (
              <li className="px-6 py-8 text-center text-[0.875rem] text-ink-subtle">
                Noch keine Anfragen eingegangen.
              </li>
            ) : (
              activity.contacts.map((c) => (
                <li key={c.id} className="flex flex-col gap-1.5 px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[0.9375rem] font-medium text-primary-950">
                      {c.firstName ? `${c.firstName} ` : ""}
                      {c.lastName}
                    </span>
                    <Badge tone={requestStatusTone[c.status]}>
                      {requestStatusLabels[c.status]}
                    </Badge>
                  </div>
                  <span className="truncate text-[0.8125rem] text-ink-muted">
                    {c.subject ?? "Allgemeine Anfrage"}
                  </span>
                  <span className="text-[0.75rem] text-ink-subtle">
                    {formatDateShort(c.createdAt)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
