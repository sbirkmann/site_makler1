import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { getAllRequests } from "@/lib/repositories/admin";
import { cn, formatArea, formatDateShort } from "@/lib/utils";
import {
  conditionLabels,
  leadSourceLabels,
  propertyTypeLabels,
  requestStatusLabels,
  requestStatusTone,
  sellingIntentLabels,
} from "@/lib/labels";
import { Badge } from "@/components/ui/Badge";
import { StatusSelect } from "@/app/admin/anfragen/StatusSelect";
import { IconMail, IconPhone } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata = { title: "Anfragen" };

type Tab = "leads" | "bewertungen" | "kontakt";

const tabs: { id: Tab; label: string }[] = [
  { id: "leads", label: "Leads" },
  { id: "bewertungen", label: "Bewertungsanfragen" },
  { id: "kontakt", label: "Kontaktanfragen" },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6">
      {children}
    </li>
  );
}

function ContactLinks({ email, phone }: { email: string; phone?: string | null }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem]">
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-2 text-ink-muted transition-colors hover:text-primary-800"
      >
        <IconMail size={15} className="shrink-0 text-primary-500" />
        {email}
      </a>
      {phone ? (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-ink-muted transition-colors hover:text-primary-800"
        >
          <IconPhone size={15} className="shrink-0 text-primary-500" />
          {phone}
        </a>
      ) : null}
    </div>
  );
}

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ typ?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { typ } = await searchParams;
  const active: Tab = tabs.some((t) => t.id === typ) ? (typ as Tab) : "leads";

  const { leads, valuations, contacts } = await getAllRequests();

  const counts: Record<Tab, number> = {
    leads: leads.length,
    bewertungen: valuations.length,
    kontakt: contacts.length,
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="display-3 text-primary-950">Anfragen</h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          Alle eingegangenen Anfragen aus Objektseiten, Funnels und Kontaktformular.
        </p>
      </div>

      <nav aria-label="Anfragetypen" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/anfragen?typ=${t.id}`}
            aria-current={active === t.id ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
              active === t.id
                ? "border-primary-800 bg-primary-800 text-white"
                : "border-line-strong text-ink-muted hover:border-primary-400 hover:text-primary-800",
            )}
          >
            {t.label}
            <span className="text-[0.75rem] opacity-70">{counts[t.id]}</span>
          </Link>
        ))}
      </nav>

      {active === "leads" ? (
        <ul className="flex flex-col gap-4">
          {leads.length === 0 ? (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface px-6 py-16 text-center text-[0.9375rem] text-ink-subtle">
              Noch keine Leads eingegangen.
            </p>
          ) : (
            leads.map((lead) => (
              <Card key={lead.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[1.0625rem] font-medium text-primary-950">
                      {lead.firstName ? `${lead.firstName} ` : ""}
                      {lead.lastName}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-subtle">
                      <Badge tone="muted">{leadSourceLabels[lead.source]}</Badge>
                      <span>{formatDateShort(lead.createdAt)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={requestStatusTone[lead.status]}>
                      {requestStatusLabels[lead.status]}
                    </Badge>
                    <StatusSelect kind="lead" id={lead.id} status={lead.status} />
                  </div>
                </div>

                <ContactLinks email={lead.email} phone={lead.phone} />

                {lead.property ? (
                  <p className="text-[0.875rem] text-ink-muted">
                    Objekt:{" "}
                    <Link
                      href={`/immobilien/${lead.property.slug}`}
                      target="_blank"
                      className="text-primary-800 underline-offset-2 hover:underline"
                    >
                      {lead.property.title}
                    </Link>
                  </p>
                ) : null}

                {lead.message ? (
                  <p className="whitespace-pre-line rounded-[var(--radius-md)] bg-surface-muted px-4 py-3 text-[0.875rem] leading-relaxed text-ink">
                    {lead.message}
                  </p>
                ) : null}
              </Card>
            ))
          )}
        </ul>
      ) : null}

      {active === "bewertungen" ? (
        <ul className="flex flex-col gap-4">
          {valuations.length === 0 ? (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface px-6 py-16 text-center text-[0.9375rem] text-ink-subtle">
              Noch keine Bewertungsanfragen eingegangen.
            </p>
          ) : (
            valuations.map((v) => (
              <Card key={v.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[1.0625rem] font-medium text-primary-950">
                      {v.firstName} {v.lastName}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-subtle">
                      <Badge tone="muted">
                        {v.funnel === "VERKAUF" ? "Verkaufsfunnel" : "Bewertungsfunnel"}
                      </Badge>
                      <span>{formatDateShort(v.createdAt)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={requestStatusTone[v.status]}>
                      {requestStatusLabels[v.status]}
                    </Badge>
                    <StatusSelect kind="valuation" id={v.id} status={v.status} />
                  </div>
                </div>

                <ContactLinks email={v.email} phone={v.phone} />

                <dl className="grid gap-x-6 gap-y-2 rounded-[var(--radius-md)] bg-surface-muted px-4 py-3.5 text-[0.875rem] sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex gap-2">
                    <dt className="text-ink-subtle">Objekt:</dt>
                    <dd className="text-ink">{propertyTypeLabels[v.propertyType]}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-subtle">Lage:</dt>
                    <dd className="text-ink">
                      {v.street ? `${v.street}, ` : ""}
                      {v.zipCode} {v.city}
                    </dd>
                  </div>
                  {v.livingArea ? (
                    <div className="flex gap-2">
                      <dt className="text-ink-subtle">Wohnfläche:</dt>
                      <dd className="text-ink">{formatArea(v.livingArea)}</dd>
                    </div>
                  ) : null}
                  {v.plotArea ? (
                    <div className="flex gap-2">
                      <dt className="text-ink-subtle">Grundstück:</dt>
                      <dd className="text-ink">{formatArea(v.plotArea)}</dd>
                    </div>
                  ) : null}
                  {v.rooms ? (
                    <div className="flex gap-2">
                      <dt className="text-ink-subtle">Zimmer:</dt>
                      <dd className="text-ink">{v.rooms}</dd>
                    </div>
                  ) : null}
                  {v.yearBuilt ? (
                    <div className="flex gap-2">
                      <dt className="text-ink-subtle">Baujahr:</dt>
                      <dd className="text-ink">{v.yearBuilt}</dd>
                    </div>
                  ) : null}
                  {v.condition ? (
                    <div className="flex gap-2">
                      <dt className="text-ink-subtle">Zustand:</dt>
                      <dd className="text-ink">{conditionLabels[v.condition]}</dd>
                    </div>
                  ) : null}
                  {v.sellingIntent ? (
                    <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                      <dt className="text-ink-subtle">Situation:</dt>
                      <dd className="text-ink">{sellingIntentLabels[v.sellingIntent]}</dd>
                    </div>
                  ) : null}
                </dl>

                {v.message ? (
                  <p className="whitespace-pre-line text-[0.875rem] leading-relaxed text-ink">
                    {v.message}
                  </p>
                ) : null}
              </Card>
            ))
          )}
        </ul>
      ) : null}

      {active === "kontakt" ? (
        <ul className="flex flex-col gap-4">
          {contacts.length === 0 ? (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface px-6 py-16 text-center text-[0.9375rem] text-ink-subtle">
              Noch keine Kontaktanfragen eingegangen.
            </p>
          ) : (
            contacts.map((c) => (
              <Card key={c.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[1.0625rem] font-medium text-primary-950">
                      {c.firstName ? `${c.firstName} ` : ""}
                      {c.lastName}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-subtle">
                      {c.subject ? <Badge tone="muted">{c.subject}</Badge> : null}
                      <span>{formatDateShort(c.createdAt)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={requestStatusTone[c.status]}>
                      {requestStatusLabels[c.status]}
                    </Badge>
                    <StatusSelect kind="contact" id={c.id} status={c.status} />
                  </div>
                </div>

                <ContactLinks email={c.email} phone={c.phone} />

                <p className="whitespace-pre-line rounded-[var(--radius-md)] bg-surface-muted px-4 py-3 text-[0.875rem] leading-relaxed text-ink">
                  {c.message}
                </p>
              </Card>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
