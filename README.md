# WohnWert Immobilien – Muster-Website für Immobilienmakler

Eine vollständige, produktionsnahe Muster-Website für einen Immobilienmakler:
Objektsuche aus der Datenbank, mehrstufige Conversion-Funnels, Kundenbewertungen,
Ratgeber und ein vorbereiteter Verwaltungsbereich.

Das Projekt ist als **Grundsystem** angelegt: Marke, Farben, Regionen und Inhalte
lassen sich an einer zentralen Stelle austauschen, ohne die Architektur anzufassen.

---

## 1. Technischer Stack

| Bereich        | Technologie                                   |
| -------------- | --------------------------------------------- |
| Framework      | Next.js 16 (App Router, React 19, Turbopack)   |
| Sprache        | TypeScript (strict, ohne `any`)                |
| Styling        | Tailwind CSS v4 mit eigenem Design-System      |
| Datenbank      | PostgreSQL 16                                  |
| ORM            | Prisma 6                                       |
| Container      | Podman / Podman Compose (kein Docker nötig)    |
| Validierung    | Zod                                            |
| Formulare      | React Server Actions (`useActionState`)        |

Bewusst **ohne** zusätzliche UI-Bibliotheken: Buttons, Formulare, Modals, Icons
und Animationen sind eigenständig umgesetzt.

---

## 2. Schnellstart

### Voraussetzungen

- Node.js ≥ 20
- Podman (mit `podman compose` oder `podman-compose`)

### Installation

```bash
# 1) Abhängigkeiten installieren
npm install

# 2) Umgebungsvariablen anlegen
cp .env.example .env

# 3) PostgreSQL starten
npm run db:up

# 4) Schema anlegen und Demo-Daten einspielen
npx prisma migrate deploy
npm run db:seed

# 5) Entwicklungsserver starten
npm run dev
```

Die Seite läuft anschließend unter **http://localhost:3000**.

> Läuft auf Port 3000 bereits etwas anderes: `PORT=3021 npm run dev`.

---

## 3. Podman-Befehle

```bash
npm run db:up          # PostgreSQL starten
npm run db:down        # PostgreSQL stoppen (Daten bleiben im Volume)

# direkt mit Podman
podman compose -f podman-compose.yml up -d
podman compose -f podman-compose.yml down
podman compose -f podman-compose.yml logs -f postgres

# Status und Verbindung prüfen
podman ps
podman exec makler_postgres pg_isready -U makler -d makler
podman exec -it makler_postgres psql -U makler -d makler

# Daten vollständig verwerfen (Volume löschen)
podman compose -f podman-compose.yml down -v
```

Falls `podman compose` nicht verfügbar ist, funktioniert `podman-compose up -d`
mit derselben Datei. Alternativ ohne Compose:

```bash
podman run -d --name makler_postgres \
  -e POSTGRES_USER=makler -e POSTGRES_PASSWORD=makler -e POSTGRES_DB=makler \
  -p 5471:5432 -v makler_pgdata:/var/lib/postgresql/data \
  docker.io/library/postgres:16-alpine
```

---

## 4. Datenbank-Konfiguration

Der Container veröffentlicht PostgreSQL auf **Port 5471** (bewusst nicht 5432,
um Konflikte mit lokal laufenden Instanzen zu vermeiden).

```env
DATABASE_URL="postgresql://makler:makler@localhost:5471/makler?schema=public"
```

| Einstellung | Wert     |
| ----------- | -------- |
| Host        | localhost |
| Port        | 5471     |
| Datenbank   | makler   |
| Benutzer    | makler   |
| Passwort    | makler   |

### Nützliche Datenbank-Befehle

```bash
npm run db:migrate     # neue Migration erzeugen (Entwicklung)
npm run db:seed        # Demo-Daten neu einspielen
npm run db:reset       # Datenbank zurücksetzen + neu seeden
npm run db:studio      # Prisma Studio öffnen
```

---

## 5. Verfügbare Seiten

### Öffentlicher Bereich

| Route                      | Inhalt                                                        |
| -------------------------- | ------------------------------------------------------------- |
| `/`                        | Startseite: Hero mit Suche, Auszeichnungen, Leistungen, Trust-Bar, Objekte, Prozess, Bewertungen, Ratgeber, FAQ |
| `/immobilien`              | Objektübersicht mit Filtern, Sortierung und Pagination         |
| `/immobilien/[slug]`       | Detailseite: Galerie, Eckdaten, Ausstattung, Energie, Ansprechpartner, Anfrageformular, ähnliche Objekte |
| `/immobilie-verkaufen`     | Verkaufsfunnel (6 Schritte) + Prozessdarstellung + FAQ         |
| `/immobilienbewertung`     | Bewertungsfunnel (5 Schritte) + Methodik + FAQ                 |
| `/bewertungen`             | Kundenbewertungen mit Durchschnitt und Verteilung              |
| `/ueber-uns`               | Markenstory, Werte, Team, Marktkenntnis                        |
| `/ratgeber`                | Artikelübersicht mit Kategoriefilter                           |
| `/ratgeber/[slug]`         | Artikeldetail mit SEO-Metadaten und Artikel-Schema             |
| `/kontakt`                 | Kontaktdaten, Öffnungszeiten, Formular, Ansprechpartner        |
| `/impressum`, `/datenschutz`, `/widerruf` | Rechtliche Seiten (Muster, `noindex`)           |
| `/sitemap.xml`, `/robots.txt` | Automatisch generiert                                       |

### Verwaltungsbereich

| Route                       | Inhalt                                                     |
| --------------------------- | ---------------------------------------------------------- |
| `/admin/login`              | Anmeldung                                                   |
| `/admin`                    | Dashboard: Objektzahl, neue Leads, Bewertungs- und Kontaktanfragen |
| `/admin/immobilien`         | Objektliste mit Anfragezähler                               |
| `/admin/immobilien/neu`     | Objekt anlegen                                              |
| `/admin/immobilien/[id]`    | Objekt bearbeiten und löschen                               |
| `/admin/anfragen`           | Alle Anfragen mit Statuswechsel (Neu → In Bearbeitung → Kontaktiert → Abgeschlossen) |

---

## 6. Demo-Zugang für die Verwaltung

```
URL:      http://localhost:3000/admin
E-Mail:   admin@wohnwert-immobilien.example
Passwort: makler2024
```

Beides ist über `ADMIN_EMAIL` und `ADMIN_PASSWORD` in der `.env` konfigurierbar.
Die Session läuft über ein **HMAC-signiertes, httpOnly-Cookie** (8 Stunden Gültigkeit);
der Signaturschlüssel steht in `ADMIN_SESSION_SECRET`.

> Für den produktiven Einsatz ist diese Lösung bewusst nur eine Grundlage – siehe
> „Offene Erweiterungspunkte".

---

## 7. Projektstruktur

```
app/
  (marketing)/              # Öffentliche Seiten mit Header/Footer
    page.tsx                # Startseite
    immobilien/             # Übersicht (+ Filter, Sortierung, Pagination)
      [slug]/               # Detailseite
    immobilie-verkaufen/    # Verkaufsfunnel
    immobilienbewertung/    # Bewertungsfunnel
    bewertungen/            # Kundenbewertungen
    ueber-uns/              # Team & Werte
    ratgeber/               # Artikelübersicht
      [slug]/               # Artikeldetail
    kontakt/                # Kontaktseite
    impressum/ datenschutz/ widerruf/
  admin/                    # Verwaltung (eigenes Layout, noindex)
    login/ immobilien/ anfragen/
  globals.css               # Design-System (Tokens, Typografie, Utilities)
  layout.tsx sitemap.ts robots.ts error.tsx not-found.tsx

components/
  layout/     Header, HeaderSwitch, MobileMenu, Footer, Logo, nav
  ui/         Button, Badge, Card, Field (Input/Select/Textarea/Checkbox/OptionCard),
              Accordion, Container/Section, SectionHeading, Reveal, FormStatus
  property/   PropertyCard, PropertyGrid, PropertySearch, PropertyFilters,
              PropertyGallery, PropertyFacts, PropertyInquiryForm
  funnel/     FunnelLayout, FunnelProgress, ValuationFunnel, PropertyTypeSelector
  reviews/    ReviewCard, RatingStars, ReviewSummary
  marketing/  Hero, Credentials, Services, TrustBar, ProcessSteps, CTASection, FAQ, ContactForm
  icons/      Eigenes Icon-System (~50 SVG-Icons)

lib/
  db.ts                     # Prisma-Client (Singleton)
  site.ts                   # Marke, Adresse, Regionen, Kennzahlen
  labels.ts                 # Deutsche Beschriftungen aller Enums
  utils.ts                  # Formatierung (Preis, Fläche, Datum), cn(), slugify()
  search-params.ts          # URL-Parameter ↔ typisierte Query
  validations/forms.ts      # Zod-Schemata für alle Formulare
  actions/                  # Server Actions (inquiries, admin) + form-state
  repositories/             # Datenzugriff (properties, reviews, agents, blog, admin)
  services/                 # Business-Logik (leads, valuation, auth)

prisma/
  schema.prisma             # Datenmodell
  migrations/               # Versionierte Migrationen
  seed.ts                   # Demo-Daten

middleware.ts               # Zugriffsschutz für /admin
podman-compose.yml          # PostgreSQL-Container
```

### Schichtentrennung

```
Seite (Server Component)
   ↓ ruft
Repository  (lib/repositories) – reine Leseabfragen, typisiert über Prisma
   ↓ bzw.
Service     (lib/services)     – Business-Logik, schreibende Vorgänge
   ↓ aufgerufen von
Server Action (lib/actions)    – Validierung via Zod, Fehlerbehandlung, Revalidierung
```

Client-Komponenten enthalten ausschließlich Interaktionslogik und erhalten ihre
Daten als Props – kein direkter Datenbankzugriff im Browser-Bundle.

---

## 8. Datenmodell

| Modell             | Zweck                                                       |
| ------------------ | ----------------------------------------------------------- |
| `Property`         | Immobilie mit Preis, Flächen, Energiedaten, Lage, Highlights |
| `PropertyImage`    | Bilder mit Sortierung und Titelbild-Kennzeichnung            |
| `PropertyDocument` | Exposé, Grundriss, Energieausweis                            |
| `Agent`            | Team-Mitglieder, Zuordnung zu Objekten und Leads             |
| `Lead`             | Alle Anfragen gebündelt (Quelle + Status)                    |
| `ValuationRequest` | Verkaufs- und Bewertungsfunnel inkl. Objektdaten             |
| `ContactRequest`   | Kontaktformular                                              |
| `Review`           | Kundenbewertungen (mit `isDemo`-Kennzeichnung)               |
| `BlogPost`/`BlogCategory` | Ratgeberartikel mit SEO-Feldern                       |
| `SavedSearch`      | Vorbereitet für gespeicherte Suchaufträge                    |

---

## 9. Demo-Daten

`npm run db:seed` legt an:

- **20 Immobilien** (Häuser, Wohnungen, Mehrfamilienhaus, Grundstück, Gewerbe;
  Kauf und Miete; 190.000 € bis 2,45 Mio. €; Köln, Bonn, Düsseldorf, Eifel u. a.;
  5 davon als Empfehlung markiert)
- **80 Objektbilder**
- **4 Team-Mitglieder**
- **12 Kundenbewertungen** (inkl. zwei kritischerer Stimmen)
- **6 Ratgeberartikel** in 4 Kategorien
- Beispielhafte Leads, Bewertungs- und Kontaktanfragen

### Bildarchitektur

Bilder werden als URL im Feld `PropertyImage.url` gespeichert und über
`next/image` ausgeliefert. Für die Demo verweisen sie auf Unsplash.

**Umstellung auf lokale Uploads oder Object Storage:** nur zwei Stellen anpassen –
die URLs in der Datenbank und `images.remotePatterns` in `next.config.ts`.
Die Anwendung selbst liest ausschließlich das URL-Feld.

---

## 10. Design-System

Alle Gestaltungsvorgaben liegen als CSS-Variablen in `app/globals.css` unter
`@theme` – eine Anpassung an eine andere Marke betrifft nur diese Datei.

- **Primary** – Navy (`#1b365d`), Überschriften und primäre Aktionen
- **Secondary** – warmes Sand für dezente Flächen
- **Accent** – Terrakotta (`#c79674`), CTAs und Hervorhebungen
- **Flächen** – `surface` / `surface-muted` (`#f3f3f3`) / `surface-sunken`
- **Text** – `ink` / `ink-muted` / `ink-subtle` / `ink-inverse`
- **Linien** – `line` / `line-strong`
- **Typografie** – Montserrat (Display) + Inter (Fließtext), Skala `display-1` … `heading-4`
- **Radien** – `xs` (4px) bis `2xl` (32px)
- **Schatten** – `subtle`, `card`, `lift`, `float`
- **Icons** – ca. 50 eigene Outline-Icons auf 24er-Raster, einheitliche Strichstärke 1.5

Sämtliche Icons und grafischen Elemente (Logo, Auszeichnungs-Siegel, Prozess-Timeline)
sind eigenständig gezeichnet.

---

## 11. Funktionsumfang

**Objektsuche** – Filter nach Vermarktungsart, Typ (Mehrfachauswahl), Ort,
Preisbereich, Zimmern und Wohnfläche; vier Sortierungen; Pagination.
Alle Filter sind vollständig über URL-Parameter abbildbar und damit teilbar
(`/immobilien?marketing=kauf&typ=HAUS&ort=Köln&preis_max=800000&sort=preis-auf`).

**Funnels** – Fortschrittsanzeige, Zurück-Navigation mit Datenerhalt,
Validierung pro Schritt, typabhängige Felder (Grundstücke fragen keine Wohnfläche ab),
Zusammenfassung vor dem Absenden, Erfolgszustand.

**Formulare** – Zod-Validierung server- und clientseitig, Honeypot-Feld gegen Bots,
Pflicht-Einwilligung zum Datenschutz, sprechende Fehlermeldungen pro Feld.

**Conversion-Tracking** – Nach erfolgreicher Übermittlung wird ein Browser-Event
`makler:lead` mit dem Anfragetyp ausgelöst. Ein Tag-Manager oder Analytics-Tool
kann direkt darauf hören:

```js
window.addEventListener("makler:lead", (e) => console.log(e.detail));
// { type: "objektanfrage" | "verkaufsfunnel" | "bewertungsfunnel" | "kontaktformular" }
```

**SEO** – dynamische Metadaten je Seite, Open Graph, Canonical-URLs,
`sitemap.xml`, `robots.txt` sowie strukturierte Daten nach schema.org
(`RealEstateAgent`, `Residence`, `FAQPage`, `Article`).

**Performance** – Server Components als Standard, Client-Komponenten nur für
Interaktion; `next/image` mit AVIF/WebP; Streaming über Suspense mit Skeletons;
ISR über `revalidate`; Scroll-Animationen über IntersectionObserver statt
Animationsbibliothek; `prefers-reduced-motion` wird respektiert.

---

## 12. Geprüfter Funktionsumfang

Getestet wurde gegen die laufende Datenbank:

- Alle Filterkombinationen, Sortierungen und Pagination liefern korrekte Ergebnisse
- Objektanfrage, Verkaufsfunnel, Bewertungsfunnel und Kontaktformular speichern
  vollständig (inkl. automatischer Zuordnung des zuständigen Maklers)
- Validierung weist fehlerhafte Eingaben ab, Honeypot blockiert Bot-Einträge
- Admin-Login: gültig signiertes Cookie erhält Zugriff, gefälschtes wird abgewiesen
- Admin-CRUD: Anlegen, Bearbeiten, Löschen (inkl. Bild-Kaskade), doppelte Slugs
  werden abgelehnt, Statuswechsel funktioniert
- Funnel-Durchlauf im Browser: Schrittvalidierung, Datenerhalt beim Zurückgehen,
  Zusammenfassung, Einwilligungspflicht, Erfolgszustand
- Bildergalerie: Lightbox mit Vor/Zurück und Tastaturbedienung
- Darstellung geprüft bei 375 px, 768 px, 1024 px, 1440 px und 1600 px

---

## 13. Bewusst offene Erweiterungspunkte

1. **Authentifizierung** – Aktuell ein signiertes Cookie mit Zugangsdaten aus der
   Umgebung. Für den Produktiveinsatz: Benutzertabelle mit gehashten Passwörtern
   (argon2/bcrypt), Rollen und 2FA. Der Zugriff ist in `lib/services/auth.ts`
   gekapselt – ein Wechsel auf Auth.js betrifft nur diese Datei und die Login-Action.

2. **Bewertungs-API** – `lib/services/valuation.ts` definiert das Interface
   `ValuationProvider` samt vorbereiteter HTTP-Implementierung. Sie aktiviert sich,
   sobald `VALUATION_API_URL` und `VALUATION_API_KEY` gesetzt sind. Aktuell ist
   bewusst kein externer Dienst angebunden.

3. **Bild-Uploads** – Derzeit URL-basiert. Ein Upload-Endpunkt mit S3-kompatiblem
   Storage lässt sich ergänzen, ohne das Datenmodell zu ändern.

4. **E-Mail-Benachrichtigung** – Anfragen werden gespeichert, aber nicht versendet.
   Anknüpfungspunkt: `lib/services/leads.ts` nach dem jeweiligen `create`.

5. **Karten** – Lage- und Standortbereiche enthalten gestaltete Platzhalter.
   Koordinaten (`latitude`/`longitude`) sind im Modell vorhanden.

6. **Cookie-Consent** – Für den Produktiveinsatz erforderlich, sobald Analytics
   oder externe Medien eingebunden werden.

7. **Gespeicherte Suchen** – Modell `SavedSearch` ist angelegt, die Oberfläche
   dazu noch nicht.

8. **Rechtstexte** – Impressum, Datenschutz und Widerruf sind Muster mit
   Platzhaltern und vor Veröffentlichung rechtlich zu prüfen.

---

## 14. Anpassung an eine andere Marke

1. `lib/site.ts` – Name, Claim, Adresse, Kontakt, Regionen, Kennzahlen
2. `app/globals.css` – Farbtokens im `@theme`-Block
3. `components/layout/Logo.tsx` – Bildzeichen und Wortmarke
4. `prisma/seed.ts` – eigene Objekte, Team-Mitglieder und Artikel
5. `components/marketing/Credentials.tsx` – tatsächliche Auszeichnungen

---

## 15. Hinweis zu den Demo-Inhalten

Objekte, Personen, Bewertungen und Auszeichnungen dieses Projekts sind frei
erfunden und dienen ausschließlich der Demonstration. Die Bewertungsseite weist
ausdrücklich darauf hin. Vor einem produktiven Einsatz sind sämtliche Inhalte
durch echte Daten zu ersetzen.
