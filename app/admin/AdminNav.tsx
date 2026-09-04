"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconClock, IconDashboard, IconHouse, IconInbox, IconKey } from "@/components/icons";

const items = [
  { href: "/admin", label: "Dashboard", Icon: IconDashboard, exact: true },
  { href: "/admin/immobilien", label: "Immobilien", Icon: IconHouse },
  { href: "/admin/anfragen", label: "Anfragen", Icon: IconInbox },
  { href: "/admin/blog", label: "Ratgeber", Icon: IconHouse },
  { href: "/admin/oeffnungszeiten", label: "Öffnungszeiten", Icon: IconClock },
  { href: "/admin/schnittstellen", label: "Schnittstellen", Icon: IconKey },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Verwaltungsnavigation" className="mx-auto max-w-[100rem] px-5 sm:px-8">
      <ul className="hide-scrollbar -mb-px flex gap-1 overflow-x-auto">
        {items.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-[0.875rem] font-medium transition-colors",
                  active
                    ? "border-primary-800 text-primary-900"
                    : "border-transparent text-ink-muted hover:text-primary-800",
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
