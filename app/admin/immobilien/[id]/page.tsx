import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { getAdminProperty } from "@/lib/repositories/admin";
import { findAgents } from "@/lib/repositories/agents";
import { PropertyForm } from "@/app/admin/immobilien/PropertyForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Immobilie bearbeiten" };

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ gespeichert?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const { gespeichert } = await searchParams;

  const [property, agents] = await Promise.all([getAdminProperty(id), findAgents()]);
  if (!property) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/immobilien"
          className="text-[0.8125rem] text-ink-muted underline-offset-4 hover:text-primary-800 hover:underline"
        >
          ← Zurück zur Übersicht
        </Link>
        <h1 className="display-3 mt-3 text-balance text-primary-950">{property.title}</h1>
        <p className="mt-2 text-[0.875rem] text-ink-subtle">/immobilien/{property.slug}</p>
      </div>

      <PropertyForm
        property={property}
        saved={gespeichert === "1"}
        agents={agents.map((a) => ({ id: a.id, firstName: a.firstName, lastName: a.lastName }))}
      />
    </div>
  );
}
