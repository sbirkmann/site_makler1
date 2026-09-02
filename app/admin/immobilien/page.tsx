import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { getAdminProperties } from "@/lib/repositories/admin";
import { formatDateShort, formatPrice } from "@/lib/utils";
import { marketingTypeLabels, propertyTypeLabels, statusLabels, statusTone } from "@/lib/labels";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { IconEdit, IconPlus } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const properties = await getAdminProperties();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="display-3 text-primary-950">Immobilien</h1>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            {properties.length} Objekte im Bestand
          </p>
        </div>
        <ButtonLink href="/admin/immobilien/neu">
          <IconPlus size={17} />
          Immobilie anlegen
        </ButtonLink>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
        {properties.length === 0 ? (
          <p className="px-6 py-16 text-center text-[0.9375rem] text-ink-subtle">
            Es sind noch keine Immobilien angelegt.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface-muted">
                  <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                    Objekt
                  </th>
                  <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                    Typ
                  </th>
                  <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                    Preis
                  </th>
                  <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                    Anfragen
                  </th>
                  <th scope="col" className="px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                    Geändert
                  </th>
                  <th scope="col" className="px-5 py-3">
                    <span className="sr-only">Aktionen</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {properties.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-surface-muted/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-surface-sunken">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0].url}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[0.875rem] font-medium text-primary-950">
                            {p.title}
                          </p>
                          <p className="truncate text-[0.75rem] text-ink-subtle">
                            {p.zipCode} {p.city}
                            {p.agent ? ` · ${p.agent.firstName} ${p.agent.lastName}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[0.8125rem] text-ink-muted">
                      {propertyTypeLabels[p.propertyType]}
                      <br />
                      <span className="text-ink-subtle">
                        {marketingTypeLabels[p.marketingType]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[0.875rem] text-primary-900">
                      {p.priceOnRequest ? "Auf Anfrage" : formatPrice(p.price)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-start gap-1.5">
                        <Badge
                          tone={statusTone[p.status] === "success" ? "success" : "muted"}
                        >
                          {statusLabels[p.status]}
                        </Badge>
                        {p.featured ? <Badge tone="accent">Empfehlung</Badge> : null}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[0.875rem] tabular-nums text-ink-muted">
                      {p._count.leads}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[0.8125rem] text-ink-subtle">
                      {formatDateShort(p.updatedAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/immobilien/${p.id}`}
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-line-strong px-3 py-1.5 text-[0.8125rem] font-medium text-ink-muted transition-colors hover:border-primary-400 hover:text-primary-800"
                      >
                        <IconEdit size={15} />
                        Bearbeiten
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
