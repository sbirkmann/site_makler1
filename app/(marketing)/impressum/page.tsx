import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container, Section } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung von ${site.legalName}.`,
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="page-title text-primary-950">Impressum</h1>

        <div className="prose-editorial mt-8">
          <p className="rounded-[var(--radius-md)] border border-line bg-surface-muted px-5 py-4 text-[0.9375rem]">
            <strong>Hinweis:</strong> Diese Seite ist ein Musterprojekt. Die folgenden Angaben sind
            Platzhalter und müssen vor einem produktiven Einsatz durch die tatsächlichen Daten des
            Betreibers ersetzt und rechtlich geprüft werden.
          </p>

          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            {site.legalName}
            <br />
            {site.address.street}
            <br />
            {site.address.zipCode} {site.address.city}
            <br />
            {site.address.country}
          </p>

          <h2>Vertreten durch</h2>
          <p>Marlene Hoffstett, Geschäftsführerin</p>

          <h2>Kontakt</h2>
          <p>
            Telefon: {site.contact.phone}
            <br />
            E-Mail: {site.contact.email}
          </p>

          <h2>Registereintrag</h2>
          <p>
            Eintragung im Handelsregister
            <br />
            Registergericht: Amtsgericht Köln
            <br />
            Registernummer: HRB 000000 (Platzhalter)
          </p>

          <h2>Umsatzsteuer-Identifikationsnummer</h2>
          <p>Gemäß § 27 a Umsatzsteuergesetz: DE000000000 (Platzhalter)</p>

          <h2>Erlaubnis nach § 34c GewO</h2>
          <p>
            Erteilt durch die Stadt {site.address.city}, Ordnungsamt (Platzhalter). Zuständige
            Aufsichtsbehörde: Stadt {site.address.city}.
          </p>

          <h2>Berufshaftpflichtversicherung</h2>
          <p>
            Name und Sitz des Versicherers sowie Geltungsraum der Versicherung sind hier anzugeben.
          </p>

          <h2>Redaktionell verantwortlich</h2>
          <p>
            Marlene Hoffstett, Anschrift wie oben.
          </p>

          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Wir
            sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Bildnachweise</h2>
          <p>
            Die auf dieser Musterseite verwendeten Objekt- und Personenfotos stammen von Unsplash
            und werden ausschließlich zu Demonstrationszwecken eingebunden. Sie zeigen keine
            tatsächlich vermittelten Immobilien und keine realen Mitarbeitenden.
          </p>
        </div>
      </Container>
    </Section>
  );
}
