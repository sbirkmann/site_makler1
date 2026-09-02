import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container, Section } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Informationen zur Verarbeitung personenbezogener Daten bei ${site.legalName}.`,
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="page-title text-primary-950">Datenschutzerklärung</h1>

        <div className="prose-editorial mt-8">
          <p className="rounded-[var(--radius-md)] border border-line bg-surface-muted px-5 py-4 text-[0.9375rem]">
            <strong>Hinweis:</strong> Diese Datenschutzerklärung ist ein Muster für ein
            Demonstrationsprojekt. Vor einem produktiven Einsatz ist sie an die tatsächliche
            Datenverarbeitung anzupassen und rechtlich zu prüfen.
          </p>

          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            <br />
            {site.legalName}, {site.address.street}, {site.address.zipCode} {site.address.city}
            <br />
            E-Mail: {site.contact.email}, Telefon: {site.contact.phone}
          </p>

          <h2>2. Welche Daten wir verarbeiten</h2>
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung der
            Website und unserer Leistungen erforderlich ist. Konkret sind das:
          </p>
          <ul>
            <li>
              <strong>Kontakt- und Objektanfragen:</strong> Name, E-Mail-Adresse, optional
              Telefonnummer und Ihre Nachricht.
            </li>
            <li>
              <strong>Bewertungs- und Verkaufsanfragen:</strong> zusätzlich Angaben zur Immobilie
              (Typ, Lage, Größe, Baujahr, Zustand) sowie Ihre Verkaufsabsicht.
            </li>
            <li>
              <strong>Server-Logdaten:</strong> technisch notwendige Zugriffsdaten wie IP-Adresse,
              Zeitpunkt, aufgerufene Seite und User-Agent.
            </li>
          </ul>

          <h2>3. Zwecke und Rechtsgrundlagen</h2>
          <p>
            Die Verarbeitung Ihrer Anfragedaten erfolgt zur Bearbeitung Ihres Anliegens sowie zur
            Anbahnung eines Vertragsverhältnisses auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Die
            Verarbeitung technischer Zugriffsdaten stützt sich auf unser berechtigtes Interesse an
            einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
          </p>

          <h2>4. Speicherdauer</h2>
          <p>
            Anfragedaten löschen wir, sobald sie für den Verarbeitungszweck nicht mehr erforderlich
            sind und keine gesetzlichen Aufbewahrungsfristen entgegenstehen – bei
            handels- und steuerrechtlich relevanten Vorgängen sind dies sechs bzw. zehn Jahre.
          </p>

          <h2>5. Empfänger</h2>
          <p>
            Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht, außer wenn dies zur Erfüllung
            unserer vertraglichen Pflichten erforderlich ist oder wir gesetzlich dazu verpflichtet
            sind. Technische Dienstleister (Hosting) werden auf Grundlage einer
            Auftragsverarbeitung nach Art. 28 DSGVO eingebunden.
          </p>

          <h2>6. Externe Bilddienste</h2>
          <p>
            Auf dieser Musterseite werden Beispielbilder von Unsplash geladen. Dabei wird Ihre
            IP-Adresse an den Anbieter übermittelt. In einem produktiven Einsatz empfehlen wir, die
            Bilder lokal auszuliefern.
          </p>

          <h2>7. Ihre Rechte</h2>
          <p>Ihnen stehen folgende Rechte zu:</p>
          <ul>
            <li>Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
          </ul>

          <h2>8. Kontakt in Datenschutzfragen</h2>
          <p>
            Für Auskünfte und zur Ausübung Ihrer Rechte wenden Sie sich an: {site.contact.email}
          </p>
        </div>
      </Container>
    </Section>
  );
}
