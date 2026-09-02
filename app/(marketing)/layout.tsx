import type { ReactNode } from "react";
import { HeaderSwitch } from "@/components/layout/HeaderSwitch";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/site";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zipCode,
      addressLocality: site.address.city,
      addressCountry: "DE",
    },
    areaServed: site.regions.map((r) => ({ "@type": "City", name: r })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.stats.averageRating,
      bestRating: 5,
      ratingCount: 12,
    },
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <HeaderSwitch />
      <main id="hauptinhalt" className="flex-1">
        {children}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </div>
  );
}
