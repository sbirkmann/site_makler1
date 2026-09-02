"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

/**
 * Seiten mit vollflaechigem Bild-Hero bekommen den transparenten Header,
 * alle uebrigen die feste helle Leiste.
 */
const overlayRoutes = new Set(["/"]);

export function HeaderSwitch() {
  const pathname = usePathname();
  return <Header overlay={overlayRoutes.has(pathname)} />;
}
