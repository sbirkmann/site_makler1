import type { Metadata } from "next";
import { site } from "@/lib/site";
import { FunnelLayout } from "@/components/funnel/FunnelLayout";
import { SearchProfileFunnel } from "@/components/funnel/SearchProfileFunnel";

export const metadata: Metadata = {
  title: "Suchprofil hinterlegen",
  description:
    "Sagen Sie uns, was Sie suchen: Wir gleichen Ihre Kriterien laufend mit unserem Bestand ab – auch mit Objekten, die nicht öffentlich inseriert werden.",
  alternates: { canonical: "/suchprofil" },
  openGraph: {
    title: "Suchprofil hinterlegen – WohnWert Immobilien",
    description:
      "Passende Immobilien im Rheinland finden – wir melden uns, sobald etwas Passendes in die Vermarktung geht.",
    url: `${site.url}/suchprofil`,
  },
};

export default function SearchProfilePage() {
  return (
    <FunnelLayout
      eyebrow="Suchprofil"
      title="Sagen Sie uns, was Sie suchen"
      description="Ein spürbarer Teil unserer Objekte wechselt den Eigentümer, bevor eine Anzeige erscheint. Mit einem Suchprofil sind Sie von Anfang an dabei."
      benefits={[
        "Wir informieren Sie vor der öffentlichen Vermarktung",
        "Kein Portal-Account, keine automatisierten Massenmails",
        "Ihre Kriterien lassen sich jederzeit anpassen",
        "In fünf Minuten ausgefüllt",
      ]}
    >
      <SearchProfileFunnel />
    </FunnelLayout>
  );
}
