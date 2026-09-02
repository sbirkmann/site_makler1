import Image from "next/image";
import { site } from "@/lib/site";
import { PropertySearch } from "@/components/property/PropertySearch";

/**
 * Hero als eingerueckte Bildflaeche mit runden Ecken:
 * seitlicher Abstand, begrenzte Maximalbreite, Header liegt transparent darueber.
 * Die Headline ist zweizeilig – erste Zeile als Kontur, zweite vollflaechig.
 */
export function Hero({ cities }: { cities: string[] }) {
  const years = new Date().getFullYear() - site.founded;

  return (
    <section className="bg-surface px-2 pb-5 pt-5">
      <div className="relative min-h-[40rem] w-full overflow-hidden rounded-[var(--radius-xl)] bg-primary-950 lg:min-h-[46rem] lg:rounded-[2rem]">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
          alt="Modernes Wohnhaus mit großzügiger Verglasung und begrüntem Vorgarten"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Abdunklung: oben fuer den Header, unten fuer Headline und Suche */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/55 via-primary-950/20 to-primary-950/80" />

        <div className="relative flex min-h-[40rem] flex-col justify-end px-5 pb-6 pt-[calc(var(--header-height)+3rem)] sm:px-8 lg:min-h-[46rem] lg:px-12 lg:pb-8">
          <h1 className="hero-title max-w-[22ch] text-balance">
            <span className="hero-title-outline block">Immobilien mit Haltung.</span>
            <span className="block text-white">Seit {years} Jahren im Rheinland.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/75">
            Ehrliche Einschätzung statt Wunschpreisen – für Eigentümer, Käufer und alle,
            die eine Entscheidung in Ruhe treffen wollen.
          </p>

          <div className="mt-9 lg:mt-12">
            <PropertySearch cities={cities} />
          </div>
        </div>
      </div>
    </section>
  );
}
