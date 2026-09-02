import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/services/auth";
import { findAgents } from "@/lib/repositories/agents";
import { PropertyForm } from "@/app/admin/immobilien/PropertyForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Immobilie anlegen" };

export default async function NewPropertyPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const agents = await findAgents();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/immobilien"
          className="text-[0.8125rem] text-ink-muted underline-offset-4 hover:text-primary-800 hover:underline"
        >
          ← Zurück zur Übersicht
        </Link>
        <h1 className="display-3 mt-3 text-primary-950">Immobilie anlegen</h1>
      </div>

      <PropertyForm
        agents={agents.map((a) => ({ id: a.id, firstName: a.firstName, lastName: a.lastName }))}
      />
    </div>
  );
}
