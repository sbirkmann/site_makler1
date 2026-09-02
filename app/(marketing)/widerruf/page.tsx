import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container, Section } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Widerrufsrecht für Verbraucher bei außerhalb von Geschäftsräumen geschlossenen Verträgen.",
  alternates: { canonical: "/widerruf" },
  robots: { index: false, follow: true },
};

export default function WiderrufPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="page-title text-primary-950">Widerrufsbelehrung</h1>

        <div className="prose-editorial mt-8">
          <p className="rounded-[var(--radius-md)] border border-line bg-surface-muted px-5 py-4 text-[0.9375rem]">
            <strong>Hinweis:</strong> Muster für ein Demonstrationsprojekt. Vor produktivem Einsatz
            rechtlich prüfen lassen.
          </p>

          <h2>Widerrufsrecht</h2>
          <p>
            Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen einen
            Vertrag zu widerrufen, der außerhalb von Geschäftsräumen oder im Fernabsatz geschlossen
            wurde. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
          </p>

          <h2>Ausübung des Widerrufsrechts</h2>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
          </p>
          <p>
            {site.legalName}
            <br />
            {site.address.street}, {site.address.zipCode} {site.address.city}
            <br />
            E-Mail: {site.contact.email}
            <br />
            Telefon: {site.contact.phone}
          </p>
          <p>
            mittels einer eindeutigen Erklärung (z. B. per Post oder E-Mail) über Ihren Entschluss
            informieren, diesen Vertrag zu widerrufen. Zur Wahrung der Widerrufsfrist reicht es
            aus, dass Sie die Mitteilung vor Ablauf der Frist absenden.
          </p>

          <h2>Folgen des Widerrufs</h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
            erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
            zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.
          </p>

          <h2>Vorzeitiges Erlöschen</h2>
          <p>
            Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll,
            so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zum
            Widerruf erbrachten Leistungen entspricht. Das Widerrufsrecht erlischt, wenn wir die
            Dienstleistung vollständig erbracht haben und Sie dem vorher ausdrücklich zugestimmt
            haben.
          </p>
        </div>
      </Container>
    </Section>
  );
}
