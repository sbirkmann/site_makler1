import { PrismaClient, Prisma } from "@prisma/client";
import { seedBlog } from "./seed-blog";

const prisma = new PrismaClient();

/**
 * Bildquelle: Unsplash-Platzhalter ueber eine kleine Helper-Funktion.
 * Erweiterungspunkt: Sobald lokale Uploads oder ein Object Storage
 * angebunden werden, aendert sich nur diese Funktion bzw. die in der DB
 * gespeicherten URLs – die Anwendung liest ausschliesslich `PropertyImage.url`.
 */
const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTOS = {
  villa: ["1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c", "1600566753190-17f0baa2a6c3", "1600566753086-00f18fb6b3ea"],
  altbau: ["1560448204-e02f11c3d0e2", "1560185007-cde436f6a4d0", "1502672260266-1c1ef2d93688", "1493809842364-78817add7ffb"],
  penthouse: ["1512917774080-9991f1c4c750", "1600210492486-724fe5c67fb0", "1600210491892-03d54c0aaf87", "1600566752355-35792bedcfea"],
  loft: ["1502005229762-cf1b2da7c5d6", "1522708323590-d24dbb6b0267", "1484154218962-a197022b5858", "1556909212-d5b604d0c90d"],
  reihenhaus: ["1570129477492-45c003edd2be", "1568605114967-8130f3a36994", "1583608205776-bfd35f0d9f83", "1600607687920-4e2a09cf159d"],
  bungalow: ["1580587771525-78b9dba3b914", "1600596542815-ffad4c1539a9", "1600573472550-8090b5e0745e", "1600585154526-990dced4db0d"],
  neubau: ["1613490493576-7fde63acd811", "1600047509807-ba8f99d2cdde", "1600585152220-90363fe7e115", "1600566753051-6057b1e17b9c"],
  landhaus: ["1523217582562-09d0def993a6", "1600607687644-c7171b42498b", "1600566752229-250ed79470f8", "1598928506311-c55ded91a20c"],
  buero: ["1497366754035-f200968a6e72", "1497366811353-6870744d04b2", "1524758631624-e2822e304c36", "1600585154340-be6161a56a0c"],
  grundstueck: ["1500382017468-9049fed747ef", "1416879595882-3373a0480b5b", "1441974231531-c6227db76b6e", "1470071459604-3b5ec3a7fe05"],
  stadtwohnung: ["1522708323590-d24dbb6b0267", "1493809842364-78817add7ffb", "1505873242700-f289a29e1e0f", "1586023492125-27b2c045efd7"],
  maisonette: ["1560185893-a55cbc8c57e8", "1600121848594-d8644e57abab", "1560448204-e02f11c3d0e2", "1600607687126-8a3414349a51"],
  seeblick: ["1499793983690-e29da59ef1c2", "1613977257363-707ba9348227", "1600566753376-12c8ab7fb75b", "1600210492493-0946911123ea"],
  mfh: ["1545324418-cc1a3fa10c00", "1518780664697-55e3ad937233", "1512917774080-9991f1c4c750", "1560448204-e02f11c3d0e2"],
  gewerbehalle: ["1553413077-190dd305871c", "1587293852726-70cdb56c2866", "1565793298595-6a879b1d9492", "1497366754035-f200968a6e72"],
  dachgeschoss: ["1560448075-bb485b067938", "1522771739844-6a9f6d5f14af", "1600573472592-401b489a3cdc", "1600566752447-f4c9fb2c0a0e"],
  stadthaus: ["1512915922686-57c11dde9b6b", "1600566753086-00f18fb6b3ea", "1600585153490-76fb20a32601", "1600607686527-6fb886090705"],
  ferienhaus: ["1449158743715-0a90ebb6d2d8", "1510798831971-661eb04b3739", "1600585154340-be6161a56a0c", "1600607687644-c7171b42498b"],
} as const;

type PhotoKey = keyof typeof PHOTOS;

const D = (n: number) => new Prisma.Decimal(n);
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

interface SeedProperty {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  marketingType: "KAUF" | "MIETE";
  propertyType: "HAUS" | "WOHNUNG" | "MEHRFAMILIENHAUS" | "GRUNDSTUECK" | "GEWERBE";
  status?: "VERFUEGBAR" | "RESERVIERT" | "VERKAUFT" | "VERMIETET" | "IN_VORBEREITUNG";
  price?: number;
  priceOnRequest?: boolean;
  serviceCharge?: number;
  livingArea?: number;
  plotArea?: number;
  usableArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  condition?: "NEUWERTIG" | "SANIERT" | "GEPFLEGT" | "RENOVIERUNGSBEDUERFTIG" | "ABRISSOBJEKT";
  energyCertificateType?: "VERBRAUCHSAUSWEIS" | "BEDARFSAUSWEIS" | "NICHT_ERFORDERLICH";
  energyEfficiencyClass?: "A_PLUS" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  energyConsumption?: number;
  heatingType?: "GAS" | "OEL" | "FERNWAERME" | "WAERMEPUMPE" | "PELLET" | "SOLAR" | "BLOCKHEIZKRAFTWERK" | "ELEKTRO";
  street?: string;
  zipCode: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  highlights: string[];
  features: string[];
  locationDescription: string;
  featured?: boolean;
  publishedDaysAgo: number;
  photos: PhotoKey;
  agent: number;
  documents?: { title: string; kind: string }[];
}

const properties: SeedProperty[] = [
  {
    slug: "villa-marienburg-rheinblick",
    title: "Architektenvilla mit Rheinblick in Marienburg",
    shortDescription:
      "Zurückgenommene Moderne auf 1.240 m² Grund: bodentiefe Verglasung, Wasserblick und ein Garten, der wie ein zweites Wohnzimmer wirkt.",
    description:
      "In einer der ruhigsten Straßen Marienburgs liegt dieses Haus so selbstverständlich in seinem Grundstück, als sei es dort gewachsen. Der Entwurf stammt von einem Kölner Architekturbüro, das konsequent mit Sichtachsen arbeitet: Vom Eingang aus fällt der Blick durch das gesamte Erdgeschoss hindurch bis auf den Rhein.\n\nDas Erdgeschoss ist ein offener, aber klar gegliederter Raum. Der Wohnbereich orientiert sich nach Südwesten, die Küche mit Kochinsel liegt zum Garten, dazwischen vermittelt ein Kaminblock als Raumteiler. Bodentiefe Fenster lassen sich vollständig zur Seite schieben, sodass Terrasse und Wohnraum im Sommer zu einer Fläche verschmelzen.\n\nIm Obergeschoss liegen vier Schlafzimmer, davon ein Elternbereich mit Ankleide, eigenem Bad und einer nach Westen ausgerichteten Loggia. Das Untergeschoss ist voll ausgebaut und bietet neben Hauswirtschaft und Technik einen Fitnessraum mit Lichtgraben sowie einen Weinkeller.\n\nDie Ausstattung folgt einer klaren Linie: geölte Eichendielen, Kalkputz, Naturstein in den Bädern. Die Technik ist auf dem Stand eines Neubaus, ohne sich in den Vordergrund zu drängen.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    price: 2450000,
    livingArea: 342,
    plotArea: 1240,
    rooms: 7,
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 2016,
    condition: "NEUWERTIG",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "A",
    energyConsumption: 42,
    heatingType: "WAERMEPUMPE",
    street: "Musterallee 8",
    zipCode: "50968",
    city: "Köln",
    region: "Marienburg",
    latitude: 50.9022,
    longitude: 6.9705,
    highlights: [
      "Direkter Rheinblick aus Wohn- und Elternbereich",
      "1.240 m² parkähnliches Grundstück mit altem Baumbestand",
      "Vollständig ausgebautes Untergeschoss mit Lichtgräben",
      "Wärmepumpe mit Photovoltaik – Effizienzklasse A",
    ],
    features: [
      "Kamin im Wohnbereich",
      "Kochinsel mit Naturstein-Arbeitsplatte",
      "Fußbodenheizung in allen Räumen",
      "Elektrische Außenjalousien",
      "Doppelgarage mit Wallbox",
      "Bewässerungsanlage im Garten",
      "Alarmanlage mit Aufschaltung",
      "Weinkeller",
    ],
    locationDescription:
      "Marienburg gilt seit über hundert Jahren als die erste Adresse Kölns. Die Straßen sind breit, die Grundstücke groß, der Rheinpark liegt fußläufig. In wenigen Minuten erreichen Sie die Rheinuferstraße und damit die Innenstadt; die internationale Schule und mehrere Gymnasien liegen im direkten Umfeld.",
    featured: true,
    publishedDaysAgo: 4,
    photos: "villa",
    agent: 0,
    documents: [
      { title: "Exposé (PDF)", kind: "EXPOSE" },
      { title: "Grundriss Erdgeschoss", kind: "GRUNDRISS" },
      { title: "Energieausweis", kind: "ENERGIEAUSWEIS" },
    ],
  },
  {
    slug: "altbau-etage-suedstadt",
    title: "Altbauetage mit Stuck und Südbalkon in der Kölner Südstadt",
    shortDescription:
      "3,40 m Deckenhöhe, Fischgrätparkett, Flügeltüren – eine Wohnung, die ihre Herkunft zeigt und trotzdem heutigen Ansprüchen genügt.",
    description:
      "Diese Etage im ersten Obergeschoss eines gepflegten Gründerzeithauses vereint, was sich schwer zusammenbringen lässt: originale Substanz und eine Haustechnik, die keine Kompromisse verlangt. Bei der Sanierung 2021 wurden Stuck, Türblätter und Parkett aufwendig aufgearbeitet, Leitungen und Bäder dagegen vollständig erneuert.\n\nDie Räume sind klassisch enfiladeartig angeordnet. Zwei zusammenhängende Zimmer zur Straße dienen heute als Wohn- und Esszimmer, verbunden durch eine zweiflügelige Schiebetür. Zum begrünten Innenhof liegen die beiden Schlafzimmer und die Wohnküche mit Zugang zum Südbalkon.\n\nBesonders angenehm ist die Ruhe: Die Straße ist verkehrsberuhigt, die Hoflage nach hinten praktisch geräuschfrei. Zur Wohnung gehören ein Kellerabteil sowie ein Fahrradraum im Hof.",
    marketingType: "KAUF",
    propertyType: "WOHNUNG",
    price: 795000,
    livingArea: 138,
    rooms: 4,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 1904,
    condition: "SANIERT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "D",
    energyConsumption: 118,
    heatingType: "GAS",
    street: "Beispielring 44",
    zipCode: "50678",
    city: "Köln",
    region: "Südstadt",
    latitude: 50.9182,
    longitude: 6.9601,
    highlights: [
      "3,40 m Deckenhöhe mit erhaltenem Originalstuck",
      "Süd-Balkon zum ruhigen, begrünten Innenhof",
      "Kernsanierung 2021 bei erhaltener Substanz",
      "Fischgrätparkett in allen Wohnräumen",
    ],
    features: [
      "Zweiflügelige Schiebetür zwischen den Wohnräumen",
      "Wohnküche mit Einbauküche",
      "Tageslichtbad mit freistehender Wanne",
      "Zweites Duschbad",
      "Kellerabteil und Fahrradraum",
      "Glasfaseranschluss",
    ],
    locationDescription:
      "Die Südstadt ist das Viertel, in dem Köln am wenigsten anstrengend ist. Der Volksgarten liegt fünf Gehminuten entfernt, der Chlodwigplatz mit Wochenmarkt, Cafés und Bahnanschluss ebenso. Kitas, Grundschule und Gymnasium befinden sich im Viertel.",
    featured: true,
    publishedDaysAgo: 9,
    photos: "altbau",
    agent: 1,
    documents: [
      { title: "Exposé (PDF)", kind: "EXPOSE" },
      { title: "Grundriss", kind: "GRUNDRISS" },
    ],
  },
  {
    slug: "penthouse-rheinauhafen",
    title: "Penthouse mit umlaufender Dachterrasse im Rheinauhafen",
    shortDescription:
      "Oberste Etage, 96 m² Terrasse, Blick über Rhein und Dom. Eine Wohnung für Menschen, die Stadt lieben, aber Abstand brauchen.",
    description:
      "Das Penthouse belegt die gesamte oberste Etage eines der ruhigeren Hafengebäude. Die Wohnfläche ist großzügig, entscheidend ist aber die Terrasse: Sie läuft um drei Seiten und ist in Zonen gegliedert – Morgensonne im Osten, Abendsonne mit Domblick im Westen.\n\nInnen dominiert eine reduzierte, helle Materialität. Der Wohnraum öffnet sich über eine 6 m breite Hebeschiebetür nach Westen. Die Küche ist als offener, aber abtrennbarer Bereich ausgeführt. Zwei Schlafzimmer verfügen jeweils über ein eigenes Bad, das Hauptschlafzimmer zusätzlich über eine begehbare Ankleide.\n\nZur Wohnung gehören zwei Tiefgaragenstellplätze mit Ladeinfrastruktur sowie ein separater Abstellraum. Das Gebäude verfügt über einen Concierge-Service werktags.",
    marketingType: "KAUF",
    propertyType: "WOHNUNG",
    price: 1690000,
    livingArea: 184,
    rooms: 4,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2012,
    condition: "NEUWERTIG",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "B",
    energyConsumption: 68,
    heatingType: "FERNWAERME",
    street: "Hafenpromenade 21",
    zipCode: "50678",
    city: "Köln",
    region: "Rheinauhafen",
    latitude: 50.9256,
    longitude: 6.9633,
    highlights: [
      "96 m² umlaufende Dachterrasse",
      "Blick auf Rhein, Dom und Severinsbrücke",
      "Zwei Tiefgaragenstellplätze mit Wallbox",
      "Concierge-Service im Haus",
    ],
    features: [
      "6 m Hebeschiebetür zur Terrasse",
      "Zwei En-Suite-Bäder",
      "Begehbare Ankleide",
      "Klimatisierung in Wohn- und Schlafbereich",
      "Elektrische Markisen",
      "Aufzug direkt in die Wohnung",
    ],
    locationDescription:
      "Der Rheinauhafen verbindet Wasserlage mit Innenstadtnähe. Die Altstadt ist zu Fuß erreichbar, Schokoladenmuseum und Rheinpromenade liegen direkt vor der Tür. Gleichzeitig ist das Quartier abends deutlich ruhiger als die angrenzenden Viertel.",
    featured: true,
    publishedDaysAgo: 2,
    photos: "penthouse",
    agent: 0,
    documents: [{ title: "Exposé (PDF)", kind: "EXPOSE" }],
  },
  {
    slug: "loft-ehrenfeld-fabriketage",
    title: "Loft in einer ehemaligen Maschinenfabrik in Ehrenfeld",
    shortDescription:
      "Sichtbeton, Stahlfenster, 4,80 m Raumhöhe: 210 m² Fläche, die man nach eigenen Vorstellungen bespielen kann.",
    description:
      "Die Fabrik wurde 1923 gebaut und 2019 behutsam in Wohnraum überführt. Was tragend war, blieb sichtbar: Stahlstützen, Betondecken, die originalen Sprossenfenster wurden nach historischem Vorbild in Wärmeschutzausführung nachgebaut.\n\nDie Fläche ist bewusst offen gelassen. Ein eingestellter Kubus nimmt Bad und Hauswirtschaft auf und trägt eine Galerie, die sich als Arbeits- oder Schlafebene nutzen lässt. Zwei abgeschlossene Räume befinden sich an der Nordseite.\n\nDas Loft eignet sich für Wohnen mit Atelier oder Büro – die Teilungsgenehmigung für gemischte Nutzung liegt vor.",
    marketingType: "KAUF",
    propertyType: "WOHNUNG",
    price: 985000,
    livingArea: 210,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 1923,
    condition: "SANIERT",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "C",
    energyConsumption: 89,
    heatingType: "FERNWAERME",
    street: "Beispielstraße 190",
    zipCode: "50825",
    city: "Köln",
    region: "Ehrenfeld",
    latitude: 50.9527,
    longitude: 6.9145,
    highlights: [
      "4,80 m Raumhöhe über die gesamte Fläche",
      "Originale Stahlsprossenfenster als Wärmeschutznachbau",
      "Galerieebene über eingestelltem Kubus",
      "Genehmigung für gemischte Wohn-/Büronutzung",
    ],
    features: [
      "Sichtbetondecken",
      "Industrieparkett Eiche",
      "Offene Küche mit Edelstahlarbeitsplatte",
      "Lastenaufzug im Haus",
      "Stellplatz im Innenhof",
    ],
    locationDescription:
      "Ehrenfeld ist Kölns produktivstes Viertel – Werkstätten, Agenturen, Musikclubs und Wochenmarkt auf engem Raum. Die Körnerstraße mit ihrer Gastronomie liegt um die Ecke, S-Bahn und KVB bringen Sie in zehn Minuten zum Hauptbahnhof.",
    publishedDaysAgo: 16,
    photos: "loft",
    agent: 2,
  },
  {
    slug: "reihenhaus-bonn-endenich",
    title: "Modernisiertes Reihenmittelhaus in Bonn-Endenich",
    shortDescription:
      "Familiengerecht geschnitten, energetisch auf aktuellem Stand und mit einem Garten nach Westen, in den nachmittags die Sonne fällt.",
    description:
      "Das Haus stammt aus den frühen 1970er-Jahren und wurde 2020 konsequent modernisiert: neue Fenster, Dämmung von Dach und Kellerdecke, neue Gasbrennwertheizung, neue Elektrik. Der Grundriss wurde dabei behutsam geöffnet – Küche und Essbereich bilden heute eine Einheit.\n\nIm Erdgeschoss liegen Wohn- und Essbereich mit Terrassenzugang sowie ein Gäste-WC. Das Obergeschoss nimmt drei Schlafzimmer und das Familienbad auf, das ausgebaute Dachgeschoss bietet ein weiteres Zimmer mit Duschbad – ideal als Gäste- oder Jugendzimmer.\n\nDer Garten ist 140 m² groß, nach Westen ausgerichtet und durch eine Hainbuchenhecke gefasst. Ein Stellplatz vor dem Haus gehört zum Objekt.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    price: 639000,
    livingArea: 156,
    plotArea: 248,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    yearBuilt: 1972,
    condition: "SANIERT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "C",
    energyConsumption: 94,
    heatingType: "GAS",
    street: "Am Musterberg 17",
    zipCode: "53121",
    city: "Bonn",
    region: "Endenich",
    latitude: 50.7291,
    longitude: 7.0721,
    highlights: [
      "Modernisierung 2020 inkl. Dämmung und neuer Heizung",
      "Westgarten mit Nachmittagssonne",
      "Ausgebautes Dachgeschoss mit eigenem Bad",
      "Stellplatz direkt am Haus",
    ],
    features: [
      "Offene Wohnküche",
      "Gäste-WC im Erdgeschoss",
      "Neue Kunststofffenster mit 3-fach-Verglasung",
      "Gartenhaus",
      "Glasfaseranschluss",
    ],
    locationDescription:
      "Endenich ist ein gewachsener Bonner Stadtteil mit eigenem Ortskern. Grundschule, Kitas und Nahversorgung sind fußläufig, die Universitätskliniken und das Zentrum in wenigen Minuten erreichbar.",
    featured: true,
    publishedDaysAgo: 12,
    photos: "reihenhaus",
    agent: 1,
    documents: [{ title: "Grundriss alle Geschosse", kind: "GRUNDRISS" }],
  },
  {
    slug: "bungalow-bergisch-gladbach",
    title: "Ebenerdiger Bungalow am Waldrand in Bergisch Gladbach",
    shortDescription:
      "Alles auf einer Ebene, 890 m² Grundstück, direkter Waldanschluss – ein Haus, das langfristig funktioniert.",
    description:
      "Der Bungalow wurde 1986 gebaut und 2018 modernisiert. Sein größter Vorzug ist die Schwellenlosigkeit: Alle Wohnräume, das Bad und die Terrasse sind ohne Stufe erreichbar, Türbreiten und Bad wurden bei der Modernisierung barrierearm ausgeführt.\n\nDer Wohnbereich mit Kamin öffnet sich über eine große Fensterfront nach Süden zur Terrasse. Drei Schlafzimmer liegen an der ruhigen Nordseite. Die Küche ist separat, aber über eine Durchreiche mit dem Essbereich verbunden.\n\nDas Grundstück grenzt rückwärtig unmittelbar an Waldbestand, eine Bebauung dahinter ist ausgeschlossen. Zum Haus gehören eine Garage sowie ein Carport.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    price: 749000,
    livingArea: 148,
    plotArea: 890,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1986,
    condition: "GEPFLEGT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "D",
    energyConsumption: 126,
    heatingType: "WAERMEPUMPE",
    street: "Waldwinkel 5",
    zipCode: "51469",
    city: "Bergisch Gladbach",
    region: "Rheinisch-Bergischer Kreis",
    latitude: 50.9925,
    longitude: 7.1281,
    highlights: [
      "Alle Wohnräume schwellenlos auf einer Ebene",
      "890 m² Grundstück mit direktem Waldanschluss",
      "Wärmepumpe seit 2018",
      "Garage und Carport",
    ],
    features: [
      "Kamin im Wohnbereich",
      "Barrierearmes Tageslichtbad",
      "Große Südterrasse",
      "Wintergarten",
      "Vollkeller",
    ],
    locationDescription:
      "Bergisch Gladbach verbindet Kölner Nähe mit bergischer Landschaft. Der Königsforst beginnt vor der Haustür, die Innenstadt von Bergisch Gladbach ist in zehn Autominuten erreichbar, Köln-Deutz in rund 25 Minuten.",
    publishedDaysAgo: 21,
    photos: "bungalow",
    agent: 3,
  },
  {
    slug: "neubau-doppelhaus-hennef",
    title: "Neubau-Doppelhaushälfte mit KfW-40-Standard in Hennef",
    shortDescription:
      "Bezugsfertig im Frühjahr: Wärmepumpe, Photovoltaik, Fußbodenheizung und ein Grundriss, der Familien ernst nimmt.",
    description:
      "Die Doppelhaushälfte entsteht in einem kleinen Neubauquartier am Rand von Hennef. Der Standard entspricht KfW 40 – Luft-Wasser-Wärmepumpe, 9,8 kWp Photovoltaik mit Speicher, kontrollierte Wohnraumlüftung mit Wärmerückgewinnung.\n\nIm Erdgeschoss liegt ein 42 m² großer Wohn-Ess-Bereich mit bodentiefen Fenstern zum Garten sowie ein Hauswirtschafts- und Technikraum. Das Obergeschoss nimmt drei Zimmer und das Familienbad auf; das Dachgeschoss ist als Studio mit Duschbad ausgebaut.\n\nKäufer können bis zum Innenausbau noch Einfluss auf Böden, Sanitärobjekte und Elektroplanung nehmen.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    status: "RESERVIERT",
    price: 689000,
    livingArea: 164,
    plotArea: 310,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    yearBuilt: 2026,
    condition: "NEUWERTIG",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "A_PLUS",
    energyConsumption: 28,
    heatingType: "WAERMEPUMPE",
    street: "Am Sonnenhang 14",
    zipCode: "53773",
    city: "Hennef",
    region: "Rhein-Sieg-Kreis",
    latitude: 50.7737,
    longitude: 7.2836,
    highlights: [
      "KfW-40-Standard mit Wärmepumpe und Photovoltaik",
      "9,8 kWp PV-Anlage inklusive Speicher",
      "Ausstattung teilweise noch wählbar",
      "Bezugsfertig Frühjahr 2026",
    ],
    features: [
      "Kontrollierte Wohnraumlüftung mit Wärmerückgewinnung",
      "Fußbodenheizung in allen Geschossen",
      "Ausgebautes Studio im Dachgeschoss",
      "Stellplatz mit Wallbox-Vorrüstung",
      "Südgarten",
    ],
    locationDescription:
      "Hennef liegt an der Sieg, zwischen Bonn und dem Westerwald. Der Bahnhof mit direkter Verbindung nach Köln und Bonn ist in wenigen Minuten erreichbar, Schulen und Einkaufsmöglichkeiten liegen im Ort.",
    publishedDaysAgo: 27,
    photos: "neubau",
    agent: 2,
  },
  {
    slug: "landhaus-eifel-blankenheim",
    title: "Saniertes Landhaus mit Scheune in der Eifel",
    shortDescription:
      "Bruchstein, alte Balken, 3.400 m² Grund – dazu eine Scheune, aus der sich noch etwas machen lässt.",
    description:
      "Das Haus stammt aus dem 19. Jahrhundert und wurde zwischen 2015 und 2018 von den heutigen Eigentümern saniert. Bruchsteinmauerwerk und Deckenbalken wurden freigelegt, Dach und Fenster erneuert, eine Pelletheizung eingebaut.\n\nIm Erdgeschoss liegen eine große Wohnküche mit Kaminofen, ein Wohnzimmer und ein Arbeitszimmer. Im Obergeschoss befinden sich drei Schlafzimmer und ein Bad mit Wanne unter der Dachschräge.\n\nDie angeschlossene Scheune mit rund 120 m² Grundfläche ist derzeit ungenutzt. Eine Voranfrage zur Umnutzung als Wohn- oder Atelierfläche wurde von der Gemeinde positiv beschieden.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    price: 429000,
    livingArea: 187,
    plotArea: 3400,
    usableArea: 120,
    rooms: 6,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1878,
    condition: "SANIERT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "E",
    energyConsumption: 148,
    heatingType: "PELLET",
    street: "Dorfstraße 3",
    zipCode: "53945",
    city: "Blankenheim",
    region: "Eifel",
    latitude: 50.4372,
    longitude: 6.6489,
    highlights: [
      "3.400 m² Grundstück mit Obstwiese",
      "Scheune mit positiver Bauvoranfrage zur Umnutzung",
      "Freigelegtes Bruchsteinmauerwerk und Deckenbalken",
      "Pelletheizung von 2017",
    ],
    features: [
      "Kaminofen in der Wohnküche",
      "Gewölbekeller",
      "Zwei Brunnen auf dem Grundstück",
      "Streuobstwiese",
      "Nebengebäude für Geräte",
    ],
    locationDescription:
      "Blankenheim liegt im Naturpark Nordeifel, am Oberlauf der Ahr. Der Ortskern mit Nahversorgung ist fußläufig, Köln und Bonn sind über die A1 in etwa einer Stunde erreichbar.",
    publishedDaysAgo: 34,
    photos: "landhaus",
    agent: 3,
  },
  {
    slug: "mehrfamilienhaus-koeln-nippes",
    title: "Mehrfamilienhaus mit sechs Einheiten in Köln-Nippes",
    shortDescription:
      "Voll vermietet, gepflegter Bestand, 4,1 % Bruttorendite – ein solides Objekt in einem Viertel mit stabiler Nachfrage.",
    description:
      "Das Haus wurde 1958 errichtet und in den vergangenen zehn Jahren kontinuierlich instand gehalten: Dach 2016 neu eingedeckt, Fenster 2019 erneuert, Heizungsanlage 2021 modernisiert. Die Fassade wurde 2014 gedämmt.\n\nDie sechs Wohnungen sind zwischen 58 und 82 m² groß, alle mit Balkon und separatem Bad. Sämtliche Einheiten sind langfristig vermietet, die Mieterstruktur ist stabil. Die aktuelle Jahresnettokaltmiete liegt bei 71.400 €, die durchschnittliche Miete deutlich unter dem Mietspiegel – hier besteht Entwicklungspotenzial.\n\nZum Objekt gehören sechs Kellerräume, ein Fahrradraum sowie vier Stellplätze im Hof.",
    marketingType: "KAUF",
    propertyType: "MEHRFAMILIENHAUS",
    price: 1740000,
    livingArea: 428,
    plotArea: 462,
    rooms: 18,
    bathrooms: 6,
    yearBuilt: 1958,
    condition: "GEPFLEGT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "D",
    energyConsumption: 132,
    heatingType: "GAS",
    street: "Musterstraße 210",
    zipCode: "50733",
    city: "Köln",
    region: "Nippes",
    latitude: 50.9631,
    longitude: 6.9539,
    highlights: [
      "Sechs Einheiten, vollständig vermietet",
      "Jahresnettokaltmiete 71.400 € – Bruttorendite 4,1 %",
      "Mieten deutlich unter Mietspiegel",
      "Dach 2016, Fenster 2019, Heizung 2021 erneuert",
    ],
    features: [
      "Alle Wohnungen mit Balkon",
      "Vier Stellplätze im Hof",
      "Gedämmte Fassade (2014)",
      "Kellerräume je Einheit",
      "Fahrradraum",
    ],
    locationDescription:
      "Nippes ist seit Jahren einer der nachgefragtesten Kölner Stadtteile für Mieter: gute Anbindung über KVB und S-Bahn, funktionierender Ortskern, hohe Wohnzufriedenheit. Die Nachfrage nach kleinen und mittleren Wohnungen ist konstant hoch.",
    publishedDaysAgo: 18,
    photos: "mfh",
    agent: 0,
    documents: [{ title: "Mieterliste (anonymisiert)", kind: "EXPOSE" }],
  },
  {
    slug: "grundstueck-huerth-efeld",
    title: "Baugrundstück für Einfamilienhaus in Hürth-Efferen",
    shortDescription:
      "Erschlossen, 620 m², Bebauungsplan lässt zwei Vollgeschosse zu. Sofort planbar.",
    description:
      "Das Grundstück liegt in zweiter Reihe einer ruhigen Wohnstraße und ist vollständig erschlossen – Wasser, Abwasser, Strom und Glasfaser liegen an der Grundstücksgrenze an.\n\nDer geltende Bebauungsplan erlaubt zwei Vollgeschosse bei einer Grundflächenzahl von 0,4. Damit sind je nach Entwurf bis zu 180 m² Wohnfläche realisierbar. Eine Doppelhausbebauung ist ebenfalls zulässig.\n\nDas Grundstück ist eben, rechteckig geschnitten und nach Süden ausgerichtet. Altlasten sind nicht bekannt, ein Bodengutachten aus 2023 liegt vor.",
    marketingType: "KAUF",
    propertyType: "GRUNDSTUECK",
    price: 385000,
    plotArea: 620,
    zipCode: "50354",
    city: "Hürth",
    region: "Rhein-Erft-Kreis",
    street: "Beispielweg 88a",
    latitude: 50.8843,
    longitude: 6.8752,
    energyCertificateType: "NICHT_ERFORDERLICH",
    highlights: [
      "Vollständig erschlossen inkl. Glasfaser",
      "Zwei Vollgeschosse zulässig, GRZ 0,4",
      "Südausrichtung, ebener Zuschnitt",
      "Bodengutachten aus 2023 liegt vor",
    ],
    features: [
      "Doppelhausbebauung zulässig",
      "Keine bekannten Altlasten",
      "Rechteckiger Zuschnitt",
      "Ruhige Zweitreihenlage",
    ],
    locationDescription:
      "Efferen ist über die Stadtbahnlinie 18 direkt mit der Kölner Innenstadt und der Universität verbunden. Grundschule, Kita und Nahversorgung befinden sich im Ort, der Kölner Grüngürtel ist in wenigen Minuten erreichbar.",
    publishedDaysAgo: 30,
    photos: "grundstueck",
    agent: 2,
  },
  {
    slug: "buerohaus-koeln-deutz",
    title: "Bürofläche mit 640 m² in Köln-Deutz",
    shortDescription:
      "Vier Minuten zum Bahnhof Deutz, flexible Grundrisse, Ausbaustandard 2019 – zur Miete verfügbar.",
    description:
      "Die Fläche verteilt sich auf zwei zusammenhängende Etagen eines 2019 sanierten Bürogebäudes. Die Grundrisse sind stützenfrei und lassen sich sowohl als Open Space als auch zellular gliedern; leichte Trennwandsysteme sind vorhanden.\n\nDie technische Ausstattung umfasst Doppelboden mit Kabelführung, Kühldecken, LED-Beleuchtung mit Präsenzsteuerung und eine Zugangskontrolle über Transponder. Pro Etage stehen Teeküche und Sanitärbereich zur Verfügung.\n\nZur Fläche gehören acht Tiefgaragenstellplätze. Der Mietvertrag ist ab einer Laufzeit von fünf Jahren möglich, ein Ausbaukostenzuschuss ist verhandelbar.",
    marketingType: "MIETE",
    propertyType: "GEWERBE",
    price: 9600,
    serviceCharge: 1920,
    usableArea: 640,
    rooms: 12,
    yearBuilt: 1998,
    condition: "SANIERT",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "B",
    energyConsumption: 74,
    heatingType: "FERNWAERME",
    street: "Musterplatz 4",
    zipCode: "50679",
    city: "Köln",
    region: "Deutz",
    latitude: 50.9407,
    longitude: 6.9738,
    highlights: [
      "Vier Gehminuten zum Bahnhof Köln Messe/Deutz",
      "Stützenfreie, flexibel teilbare Grundrisse",
      "Ausbaustandard 2019 mit Kühldecken",
      "Acht Tiefgaragenstellplätze inklusive",
    ],
    features: [
      "Doppelboden mit Kabelführung",
      "LED-Beleuchtung mit Präsenzsteuerung",
      "Transponder-Zugangskontrolle",
      "Zwei Teeküchen",
      "Ausbaukostenzuschuss verhandelbar",
    ],
    locationDescription:
      "Deutz ist Kölns bestangebundener Bürostandort: ICE-Halt, Flughafenanbindung in 15 Minuten, Messe und Innenstadt fußläufig bzw. eine Brücke entfernt.",
    publishedDaysAgo: 14,
    photos: "buero",
    agent: 0,
  },
  {
    slug: "stadtwohnung-koeln-agnesviertel",
    title: "Helle 3-Zimmer-Wohnung im Agnesviertel",
    shortDescription:
      "Zweiter Stock, Balkon nach Süden, direkt am Rand des Agnesviertels – zur Miete ab sofort.",
    description:
      "Die Wohnung liegt im zweiten Obergeschoss eines gepflegten Mehrfamilienhauses aus den 1990er-Jahren. Der Schnitt ist klar: ein großes Wohnzimmer mit Zugang zum Südbalkon, zwei Schlafzimmer nach hinten, dazwischen ein Tageslichtbad mit Wanne und Dusche.\n\nDie Küche ist separat und mit einer neuwertigen Einbauküche ausgestattet, die übernommen werden kann. Die Böden wurden 2023 erneuert, die Wände frisch gestrichen.\n\nEin Kellerabteil gehört zur Wohnung, ein Tiefgaragenstellplatz kann für 95 € monatlich zusätzlich angemietet werden.",
    marketingType: "MIETE",
    propertyType: "WOHNUNG",
    price: 1490,
    serviceCharge: 280,
    livingArea: 86,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    yearBuilt: 1994,
    condition: "GEPFLEGT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "C",
    energyConsumption: 96,
    heatingType: "GAS",
    street: "Musterstraße 41",
    zipCode: "50670",
    city: "Köln",
    region: "Agnesviertel",
    latitude: 50.9537,
    longitude: 6.9556,
    highlights: [
      "Südbalkon mit Nachmittagssonne",
      "Einbauküche kann übernommen werden",
      "Böden 2023 erneuert",
      "Tiefgaragenstellplatz zumietbar",
    ],
    features: [
      "Tageslichtbad mit Wanne und Dusche",
      "Aufzug im Haus",
      "Kellerabteil",
      "Fahrradraum",
    ],
    locationDescription:
      "Das Agnesviertel ist eines der lebendigsten Wohnviertel Kölns – inhabergeführte Läden, Cafés und der Neusser Platz prägen den Alltag. Der Hauptbahnhof ist in zehn Gehminuten erreichbar.",
    publishedDaysAgo: 6,
    photos: "stadtwohnung",
    agent: 1,
  },
  {
    slug: "maisonette-duesseldorf-flingern",
    title: "Maisonette mit Dachterrasse in Düsseldorf-Flingern",
    shortDescription:
      "Zwei Ebenen, 24 m² Dachterrasse, Ausbau von 2021 – kompakt, aber durchdacht bis ins Detail.",
    description:
      "Die Maisonette belegt die beiden obersten Geschosse eines sanierten Altbaus. Unten liegen Wohnraum, offene Küche und ein Gästebad, oben zwei Schlafzimmer, das Hauptbad und der Zugang zur Dachterrasse.\n\nDer Ausbau erfolgte 2021 mit hochwertigen Materialien: Eichenparkett, Naturstein in den Bädern, Einbauschränke nach Maß. Die Dachterrasse ist mit Holz gedielt und verfügt über einen Wasseranschluss.\n\nDie Wohnung ist bezugsfrei und wird ohne Maklerprovision für den Käufer angeboten.",
    marketingType: "KAUF",
    propertyType: "WOHNUNG",
    price: 725000,
    livingArea: 112,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 1911,
    condition: "SANIERT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "D",
    energyConsumption: 112,
    heatingType: "GAS",
    street: "Beispielstraße 96",
    zipCode: "40233",
    city: "Düsseldorf",
    region: "Flingern",
    latitude: 51.2296,
    longitude: 6.8082,
    highlights: [
      "24 m² Dachterrasse mit Holzdielung",
      "Ausbau 2021 mit Einbauschränken nach Maß",
      "Zwei Bäder auf zwei Ebenen",
      "Bezugsfrei, provisionsfrei für Käufer",
    ],
    features: [
      "Eichenparkett",
      "Offene Küche mit Kochinsel",
      "Wasseranschluss auf der Terrasse",
      "Kellerabteil",
    ],
    locationDescription:
      "Flingern hat sich zu einem der gefragtesten Düsseldorfer Viertel entwickelt. Die Ackerstraße mit ihren Läden und Cafés liegt direkt vor der Tür, der Hauptbahnhof ist in zehn Minuten erreichbar.",
    featured: true,
    publishedDaysAgo: 8,
    photos: "maisonette",
    agent: 3,
  },
  {
    slug: "haus-seeblick-rodenkirchen",
    title: "Wohnhaus am Wasser in Köln-Rodenkirchen",
    shortDescription:
      "Grundstück bis ans Ufer, große Fensterflächen zum Wasser, ruhige Sackgasse. Ein seltener Zuschnitt.",
    description:
      "Das Haus wurde 2004 gebaut und 2021 umfassend modernisiert. Es liegt an einer Sackgasse, das Grundstück reicht bis an das Ufer eines Altarms.\n\nDer Wohnbereich im Erdgeschoss ist über Eck verglast und öffnet sich auf eine 45 m² große Terrasse. Küche und Essbereich liegen angrenzend, ein Arbeitszimmer und ein Gästebad vervollständigen die Ebene.\n\nIm Obergeschoss befinden sich drei Schlafzimmer, zwei Bäder und ein nach Westen ausgerichteter Balkon mit Blick über das Wasser. Das Untergeschoss ist voll ausgebaut.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    priceOnRequest: true,
    livingArea: 268,
    plotArea: 780,
    rooms: 6,
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 2004,
    condition: "SANIERT",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "B",
    energyConsumption: 64,
    heatingType: "WAERMEPUMPE",
    street: "Uferweg 2",
    zipCode: "50996",
    city: "Köln",
    region: "Rodenkirchen",
    latitude: 50.8802,
    longitude: 6.9945,
    highlights: [
      "Grundstück reicht bis ans Wasser",
      "Übereck verglaster Wohnbereich",
      "45 m² Terrasse und Westbalkon",
      "Modernisierung 2021 inkl. Wärmepumpe",
    ],
    features: [
      "Ausgebautes Untergeschoss",
      "Sauna",
      "Doppelgarage",
      "Bootssteg",
      "Bewässerungsanlage",
    ],
    locationDescription:
      "Rodenkirchen ist Kölns entspanntester Süden: Rheinufer, gewachsener Ortskern, gute Schulen. Die Innenstadt ist über die Rheinuferstraße in 15 Minuten erreichbar.",
    publishedDaysAgo: 5,
    photos: "seeblick",
    agent: 0,
  },
  {
    slug: "dachgeschosswohnung-bonn-suedstadt",
    title: "Dachgeschosswohnung mit Blick über die Bonner Südstadt",
    shortDescription:
      "Vierter Stock mit Aufzug, Gauben nach zwei Seiten, ruhige Lage im Gründerzeitviertel.",
    description:
      "Die Wohnung liegt im ausgebauten Dachgeschoss eines Gründerzeithauses, das 2017 vollständig saniert wurde – inklusive Aufzugseinbau und Dämmung der obersten Geschossdecke.\n\nDurch die Gauben nach Osten und Westen ist die Wohnung den ganzen Tag über hell. Der Wohnraum mit offener Küche liegt zentral, links und rechts schließen jeweils ein Schlafzimmer und ein Bad an.\n\nDie Wohnung wird derzeit vermietet; der Mietvertrag läuft noch bis Ende des Jahres. Ein Verkauf an Selbstnutzer ist ab Januar möglich.",
    marketingType: "KAUF",
    propertyType: "WOHNUNG",
    price: 468000,
    livingArea: 94,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 1908,
    condition: "SANIERT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "C",
    energyConsumption: 102,
    heatingType: "GAS",
    street: "Musterstraße 27",
    zipCode: "53115",
    city: "Bonn",
    region: "Südstadt",
    latitude: 50.7284,
    longitude: 7.0949,
    highlights: [
      "Aufzug bis in die Etage",
      "Gauben nach Osten und Westen",
      "Komplettsanierung des Hauses 2017",
      "Zwei Bäder",
    ],
    features: [
      "Offene Küche",
      "Einbauschränke unter der Dachschräge",
      "Kellerabteil",
      "Gemeinschaftlicher Innenhof",
    ],
    locationDescription:
      "Die Bonner Südstadt ist das größte zusammenhängende Gründerzeitviertel Deutschlands. Die Poppelsdorfer Allee, der Hofgarten und die Universität liegen fußläufig.",
    publishedDaysAgo: 11,
    photos: "dachgeschoss",
    agent: 1,
  },
  {
    slug: "stadthaus-leverkusen-schlebusch",
    title: "Freistehendes Stadthaus mit Gartenhaus in Leverkusen",
    shortDescription:
      "Freistehend auf 560 m², fünf Zimmer, ein alter Kirschbaum im Garten. Gepflegt und sofort bewohnbar.",
    description:
      "Das Haus wurde 1994 in massiver Bauweise errichtet und seither durchgehend von der Eigentümerfamilie bewohnt und gepflegt. Es ist freistehend, was in dieser Lage selten geworden ist.\n\nErdgeschoss: Diele, Gäste-WC, Wohnzimmer mit Kamin, Esszimmer und Küche mit Zugang zur Südterrasse. Obergeschoss: drei Schlafzimmer und Familienbad. Dachgeschoss: ausgebautes Studio mit Duschbad.\n\nIm Garten steht ein gedämmtes Gartenhaus mit Stromanschluss, das sich als Arbeitsraum nutzen lässt. Garage und zwei Stellplätze gehören zum Objekt.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    price: 585000,
    livingArea: 178,
    plotArea: 560,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    yearBuilt: 1994,
    condition: "GEPFLEGT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "D",
    energyConsumption: 121,
    heatingType: "GAS",
    street: "Am Kirschgarten 9",
    zipCode: "51375",
    city: "Leverkusen",
    region: "Schlebusch",
    latitude: 51.0432,
    longitude: 7.0483,
    highlights: [
      "Freistehend auf 560 m² Grundstück",
      "Gedämmtes Gartenhaus mit Stromanschluss",
      "Kamin im Wohnzimmer",
      "Garage plus zwei Stellplätze",
    ],
    features: [
      "Massive Bauweise",
      "Südterrasse",
      "Ausgebautes Dachstudio mit Bad",
      "Vollkeller",
      "Alter Kirschbaum im Garten",
    ],
    locationDescription:
      "Schlebusch ist der grünste Leverkusener Stadtteil mit eigenem Ortszentrum. Der Bürgerbusch beginnt in Laufweite, Köln ist über die A3 in 20 Minuten erreichbar.",
    publishedDaysAgo: 24,
    photos: "stadthaus",
    agent: 3,
  },
  {
    slug: "gewerbehalle-troisdorf",
    title: "Produktions- und Lagerhalle mit Bürotrakt in Troisdorf",
    shortDescription:
      "1.850 m² Halle, 6,5 m Hallenhöhe, zwei Rampen, direkte Autobahnanbindung – zum Kauf.",
    description:
      "Die Halle wurde 2008 errichtet und ist in zwei Segmente à 925 m² unterteilt, die sich getrennt nutzen oder zusammenlegen lassen. Die Hallenhöhe beträgt 6,5 m unter Binder, der Boden ist mit 5 t/m² belastbar.\n\nDer vorgelagerte Bürotrakt umfasst über zwei Etagen rund 320 m² mit Empfang, sechs Büroräumen, Besprechungsraum und Sozialbereich.\n\nZur Anlieferung stehen zwei Überladebrücken und ein ebenerdiges Sektionaltor zur Verfügung. Auf dem Grundstück befinden sich 24 Pkw-Stellplätze sowie eine befestigte Rangierfläche.",
    marketingType: "KAUF",
    propertyType: "GEWERBE",
    price: 2280000,
    usableArea: 2170,
    plotArea: 4600,
    rooms: 10,
    yearBuilt: 2008,
    condition: "GEPFLEGT",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "C",
    energyConsumption: 88,
    heatingType: "GAS",
    street: "Industriestraße 44",
    zipCode: "53842",
    city: "Troisdorf",
    region: "Rhein-Sieg-Kreis",
    latitude: 50.8156,
    longitude: 7.1494,
    highlights: [
      "1.850 m² Hallenfläche, teilbar in zwei Segmente",
      "6,5 m Hallenhöhe, Bodenlast 5 t/m²",
      "Zwei Überladebrücken und Sektionaltor",
      "Autobahnanschluss A59 in 3 Minuten",
    ],
    features: [
      "320 m² Bürotrakt über zwei Etagen",
      "24 Pkw-Stellplätze",
      "Befestigte Rangierfläche",
      "Kranbahn vorbereitet",
      "Sozialräume mit Duschen",
    ],
    locationDescription:
      "Troisdorf liegt im Zentrum des Wirtschaftsraums Köln/Bonn. Über die A59 und A3 sind Flughafen, Häfen und das Ruhrgebiet schnell erreichbar.",
    publishedDaysAgo: 40,
    photos: "gewerbehalle",
    agent: 2,
  },
  {
    slug: "ferienhaus-eifel-nuerburg",
    title: "Ferienhaus mit Fernblick nahe der Nürburg",
    shortDescription:
      "Vermietet als Ferienobjekt mit belegbarer Auslastung – oder einfach selbst nutzen.",
    description:
      "Das Haus wurde 2013 gebaut und wird seit 2015 als Ferienobjekt vermietet. Die Auslastung lag zuletzt bei 68 % im Jahresmittel, die Zahlen können auf Wunsch eingesehen werden.\n\nDer offene Wohn-Ess-Bereich mit Kaminofen öffnet sich nach Süden auf eine große Terrasse mit Blick über die Höhen der Hocheifel. Vier Schlafzimmer und drei Bäder verteilen sich auf zwei Ebenen, sodass sich das Haus auch für zwei Familien eignet.\n\nDie Ausstattung ist auf Vermietung ausgelegt: robuste Böden, Spülmaschine, Waschmaschine, Sauna und ein abschließbarer Technikraum. Die Möblierung kann übernommen werden.",
    marketingType: "KAUF",
    propertyType: "HAUS",
    price: 495000,
    livingArea: 172,
    plotArea: 720,
    rooms: 6,
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 2013,
    condition: "GEPFLEGT",
    energyCertificateType: "BEDARFSAUSWEIS",
    energyEfficiencyClass: "B",
    energyConsumption: 71,
    heatingType: "WAERMEPUMPE",
    street: "Höhenweg 12",
    zipCode: "53520",
    city: "Nürburg",
    region: "Eifel",
    latitude: 50.3348,
    longitude: 6.9426,
    highlights: [
      "Etablierte Ferienvermietung mit 68 % Auslastung",
      "Fernblick über die Hocheifel",
      "Sauna und großzügige Südterrasse",
      "Möblierung übernehmbar",
    ],
    features: [
      "Kaminofen",
      "Vier Schlafzimmer auf zwei Ebenen",
      "Zwei Stellplätze",
      "Abschließbarer Technikraum",
      "Wärmepumpe",
    ],
    locationDescription:
      "Die Region um die Nürburg zieht ganzjährig Gäste an – Motorsport, Wandern auf dem Eifelsteig und der Nationalpark Eifel sorgen für eine gleichmäßige Nachfrage.",
    publishedDaysAgo: 45,
    photos: "ferienhaus",
    agent: 3,
  },
  {
    slug: "wohnung-koeln-lindenthal-miete",
    title: "4-Zimmer-Wohnung mit Gartenanteil in Köln-Lindenthal",
    shortDescription:
      "Erdgeschoss mit eigenem Gartenanteil, direkt am Stadtwald – zur Miete, ideal für Familien.",
    description:
      "Die Wohnung liegt im Erdgeschoss eines ruhigen Mehrfamilienhauses aus dem Jahr 1968, das 2020 energetisch modernisiert wurde. Zur Einheit gehört ein eigener, eingezäunter Gartenanteil von rund 90 m².\n\nDer Grundriss bietet vier Zimmer, davon ein Wohnraum mit direktem Gartenzugang. Küche und Bad wurden 2020 erneuert, ein zusätzliches Gäste-WC ist vorhanden.\n\nDie Wohnung wird unbefristet vermietet. Haustiere sind nach Absprache erlaubt.",
    marketingType: "MIETE",
    propertyType: "WOHNUNG",
    price: 1980,
    serviceCharge: 340,
    livingArea: 118,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1968,
    condition: "SANIERT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "C",
    energyConsumption: 99,
    heatingType: "GAS",
    street: "Beispielstraße 231",
    zipCode: "50931",
    city: "Köln",
    region: "Lindenthal",
    latitude: 50.9264,
    longitude: 6.9126,
    highlights: [
      "Eigener Gartenanteil von rund 90 m²",
      "Stadtwald in fünf Gehminuten",
      "Küche und Bad 2020 erneuert",
      "Haustiere nach Absprache erlaubt",
    ],
    features: [
      "Gäste-WC",
      "Kellerabteil",
      "Fahrradraum",
      "Gemeinschaftliche Waschküche",
      "Stellplatz zumietbar",
    ],
    locationDescription:
      "Lindenthal ist Kölns klassisches Familienviertel: Stadtwald, gute Schulen, ruhige Straßen und trotzdem nur zehn Minuten bis zum Rudolfplatz.",
    publishedDaysAgo: 3,
    photos: "reihenhaus",
    agent: 1,
  },
  {
    slug: "altbau-wohnung-koeln-belgisches-viertel",
    title: "Sanierte Altbauwohnung im Belgischen Viertel",
    shortDescription:
      "Zwei Zimmer, hohe Decken, ruhige Hoflage mitten im Belgischen Viertel. Verkauft – auf Wunsch informieren wir über vergleichbare Objekte.",
    description:
      "Diese Wohnung wurde über uns erfolgreich vermittelt. Wir zeigen sie weiterhin, um einen Eindruck von der Art der Objekte zu geben, die wir regelmäßig betreuen.\n\nDie Zwei-Zimmer-Wohnung lag im zweiten Obergeschoss eines Gründerzeithauses, ausgerichtet zum begrünten Innenhof. Charakteristisch waren die 3,20 m hohen Decken, das originale Dielenparkett und ein Bad mit Tageslicht.\n\nSuchen Sie etwas Vergleichbares? Sprechen Sie uns an – ein Teil unserer Objekte wird ohne öffentliche Vermarktung vermittelt.",
    marketingType: "KAUF",
    propertyType: "WOHNUNG",
    status: "VERKAUFT",
    price: 429000,
    livingArea: 68,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 1899,
    condition: "SANIERT",
    energyCertificateType: "VERBRAUCHSAUSWEIS",
    energyEfficiencyClass: "D",
    energyConsumption: 124,
    heatingType: "GAS",
    street: "Musterstraße 62",
    zipCode: "50674",
    city: "Köln",
    region: "Belgisches Viertel",
    latitude: 50.9376,
    longitude: 6.9339,
    highlights: [
      "3,20 m Deckenhöhe",
      "Ruhige Hoflage im Belgischen Viertel",
      "Originales Dielenparkett",
      "Über WohnWert vermittelt",
    ],
    features: ["Tageslichtbad", "Kellerabteil", "Fahrradstellplatz im Hof"],
    locationDescription:
      "Das Belgische Viertel ist Kölns dichteste Mischung aus Wohnen, Gastronomie und inhabergeführtem Einzelhandel. Der Brüsseler Platz ist der inoffizielle Mittelpunkt des Viertels.",
    publishedDaysAgo: 60,
    photos: "altbau",
    agent: 2,
  },
];

async function main() {
  console.log("→ Bestehende Daten werden entfernt …");
  await prisma.$transaction([
    prisma.propertyImage.deleteMany(),
    prisma.propertyDocument.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.property.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.blogCategory.deleteMany(),
    prisma.review.deleteMany(),
    prisma.valuationRequest.deleteMany(),
    prisma.contactRequest.deleteMany(),
    prisma.savedSearch.deleteMany(),
    prisma.agent.deleteMany(),
  ]);

  console.log("→ Team wird angelegt …");
  const agentSeeds = [
    {
      slug: "marlene-hoffstett",
      firstName: "Marlene",
      lastName: "Hoffstett",
      role: "Geschäftsführerin & Immobilienökonomin (IREBS)",
      email: "m.hoffstett@wohnwert-immobilien.example",
      phone: "+49 221 23125 101",
      imageUrl: img("1573496359142-b8d87734a5a2", 800),
      bio: "Marlene Hoffstett hat WohnWert 2009 gegründet, nachdem sie zehn Jahre in der Projektentwicklung gearbeitet hatte. Sie betreut vor allem hochwertige Wohnimmobilien im Kölner Süden und Anlageobjekte. Ihr Anspruch: Ein Verkauf ist erst dann gelungen, wenn beide Seiten das Gefühl haben, eine gute Entscheidung getroffen zu haben.",
      focus: ["Wohnimmobilien Premium", "Anlageobjekte", "Bewertung"],
      sortOrder: 1,
    },
    {
      slug: "tomas-lindqvist",
      firstName: "Tomas",
      lastName: "Lindqvist",
      role: "Immobilienberater Köln & Bonn",
      email: "t.lindqvist@wohnwert-immobilien.example",
      phone: "+49 221 23125 102",
      imageUrl: img("1560250097-0b93528c311a", 800),
      bio: "Tomas Lindqvist kennt den Wohnungsmarkt zwischen Südstadt und Bonner Innenstadt aus mehr als 400 Besichtigungen. Er begleitet vor allem Eigentümer, die zum ersten Mal verkaufen, und nimmt sich dafür bewusst mehr Zeit als üblich.",
      focus: ["Eigentumswohnungen", "Erstverkäufer", "Vermietung"],
      sortOrder: 2,
    },
    {
      slug: "nadja-berisha",
      firstName: "Nadja",
      lastName: "Berisha",
      role: "Beraterin Gewerbe & Investment",
      email: "n.berisha@wohnwert-immobilien.example",
      phone: "+49 221 23125 103",
      imageUrl: img("1580489944761-15a19d654956", 800),
      bio: "Nadja Berisha verantwortet den Bereich Gewerbe- und Investmentimmobilien. Sie kommt aus der Bankenanalyse und rechnet jedes Objekt durch, bevor sie es empfiehlt – auch dann, wenn das Ergebnis gegen einen Abschluss spricht.",
      focus: ["Gewerbeimmobilien", "Investment", "Grundstücke"],
      sortOrder: 3,
    },
    {
      slug: "henrik-vanloo",
      firstName: "Henrik",
      lastName: "van Loo",
      role: "Berater Rheinland & Eifel",
      email: "h.vanloo@wohnwert-immobilien.example",
      phone: "+49 221 23125 104",
      imageUrl: img("1507003211169-0a1dd7228f2d", 800),
      bio: "Henrik van Loo betreut das Umland: Bergisches Land, Rhein-Sieg-Kreis und die Eifel. Er ist dort aufgewachsen und weiß, welche Straße nachmittags Sonne hat und wo der Schulbus tatsächlich hält.",
      focus: ["Häuser im Umland", "Landimmobilien", "Ferienobjekte"],
      sortOrder: 4,
    },
  ];

  const agents = [];
  for (const a of agentSeeds) {
    agents.push(await prisma.agent.create({ data: a }));
  }

  console.log("→ Immobilien werden angelegt …");
  for (const p of properties) {
    const photos = PHOTOS[p.photos];
    await prisma.property.create({
      data: {
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription,
        description: p.description,
        marketingType: p.marketingType,
        propertyType: p.propertyType,
        status: p.status ?? "VERFUEGBAR",
        price: p.price !== undefined ? D(p.price) : null,
        priceOnRequest: p.priceOnRequest ?? false,
        serviceCharge: p.serviceCharge !== undefined ? D(p.serviceCharge) : null,
        livingArea: p.livingArea ?? null,
        plotArea: p.plotArea ?? null,
        usableArea: p.usableArea ?? null,
        rooms: p.rooms ?? null,
        bedrooms: p.bedrooms ?? null,
        bathrooms: p.bathrooms ?? null,
        yearBuilt: p.yearBuilt ?? null,
        condition: p.condition ?? null,
        energyCertificateType: p.energyCertificateType ?? null,
        energyEfficiencyClass: p.energyEfficiencyClass ?? null,
        energyConsumption: p.energyConsumption ?? null,
        heatingType: p.heatingType ?? null,
        street: p.street ?? null,
        zipCode: p.zipCode,
        city: p.city,
        region: p.region ?? null,
        latitude: p.latitude ?? null,
        longitude: p.longitude ?? null,
        highlights: p.highlights,
        features: p.features,
        locationDescription: p.locationDescription,
        featured: p.featured ?? false,
        publishedAt: daysAgo(p.publishedDaysAgo),
        agentId: agents[p.agent].id,
        images: {
          create: photos.map((photoId, i) => ({
            url: img(photoId),
            alt: `${p.title} – Ansicht ${i + 1}`,
            sortOrder: i,
            isCover: i === 0,
          })),
        },
        ...(p.documents
          ? {
              documents: {
                create: p.documents.map((d) => ({
                  title: d.title,
                  url: "#",
                  kind: d.kind,
                })),
              },
            }
          : {}),
      },
    });
  }

  console.log("→ Bewertungen werden angelegt …");
  const reviews = [
    {
      authorName: "Familie Brenner",
      initials: "FB",
      rating: 5,
      title: "Verkauf ohne Stress – trotz Erbengemeinschaft",
      body: "Wir haben das Haus unserer Eltern zu dritt geerbt und hatten unterschiedliche Vorstellungen. Frau Hoffstett hat sich Zeit genommen, mit jedem einzeln zu sprechen, bevor sie einen Vorschlag gemacht hat. Am Ende waren wir uns einig – und der erzielte Preis lag über dem, womit wir gerechnet hatten.",
      city: "Köln",
      propertyType: "HAUS" as const,
      serviceType: "Verkauf",
      daysAgo: 22,
    },
    {
      authorName: "Sandra K.",
      initials: "SK",
      rating: 5,
      title: "Ehrliche Einschätzung statt Wunschpreis",
      body: "Zwei andere Makler hatten mir vorher deutlich höhere Preise genannt. Herr Lindqvist hat mir erklärt, warum diese Zahlen unrealistisch sind, und was das für die Vermarktungsdauer bedeutet hätte. Die Wohnung war nach fünf Wochen verkauft – zum genannten Preis.",
      city: "Bonn",
      propertyType: "WOHNUNG" as const,
      serviceType: "Verkauf",
      daysAgo: 46,
    },
    {
      authorName: "Dr. Michael Reinartz",
      initials: "MR",
      rating: 5,
      title: "Professionelle Betreuung beim Kauf",
      body: "Als Käufer fühlt man sich oft als Nebensache. Hier war das anders: Unterlagen kamen vollständig und unaufgefordert, Fragen wurden auch dann beantwortet, wenn die Antwort nicht für das Objekt sprach. Das schafft Vertrauen.",
      city: "Köln",
      propertyType: "WOHNUNG" as const,
      serviceType: "Kauf",
      daysAgo: 68,
    },
    {
      authorName: "Petra und Wolfgang H.",
      initials: "PH",
      rating: 5,
      title: "Bewertung war der richtige erste Schritt",
      body: "Wir wollten eigentlich nur wissen, wo wir stehen. Die Bewertung war ausführlich und mit Vergleichsobjekten belegt, ohne dass wir zu irgendetwas gedrängt wurden. Ein halbes Jahr später haben wir uns dann doch zum Verkauf entschlossen – und wussten genau, wen wir anrufen.",
      city: "Bergisch Gladbach",
      propertyType: "HAUS" as const,
      serviceType: "Bewertung",
      daysAgo: 90,
    },
    {
      authorName: "Ansgar Thelen",
      initials: "AT",
      rating: 4,
      title: "Gute Arbeit, Terminfindung etwas zäh",
      body: "Inhaltlich gab es nichts zu bemängeln – Exposé, Fotos und Vermarktung waren erstklassig. Bei der Terminabstimmung für Besichtigungen hätte ich mir etwas mehr Flexibilität am Abend gewünscht. Am Ergebnis ändert das nichts: verkauft in sieben Wochen.",
      city: "Leverkusen",
      propertyType: "HAUS" as const,
      serviceType: "Verkauf",
      daysAgo: 112,
    },
    {
      authorName: "Yvonne Casper",
      initials: "YC",
      rating: 5,
      title: "Mietwohnung in einem schwierigen Markt",
      body: "Ich habe monatelang gesucht und war ziemlich desillusioniert. Hier wurde ich zum ersten Mal ernst genommen und nicht durch eine Massenbesichtigung geschleust. Die Wohnung passt.",
      city: "Köln",
      propertyType: "WOHNUNG" as const,
      serviceType: "Vermietung",
      daysAgo: 34,
    },
    {
      authorName: "Bernhard Löhr",
      initials: "BL",
      rating: 5,
      title: "Anlageobjekt sauber durchgerechnet",
      body: "Frau Berisha hat mir bei einem Objekt abgeraten, das ich unbedingt kaufen wollte – mit einer Rechnung, der ich nicht widersprechen konnte. Beim zweiten Objekt hat sie zugeraten. Das war die richtige Entscheidung.",
      city: "Köln",
      propertyType: "MEHRFAMILIENHAUS" as const,
      serviceType: "Kauf",
      daysAgo: 140,
    },
    {
      authorName: "Familie Özdemir",
      initials: "FÖ",
      rating: 5,
      title: "Erstes Haus, viele Fragen",
      body: "Wir hatten überhaupt keine Erfahrung und entsprechend viele Fragen – auch solche, die man sich fast nicht traut zu stellen. Herr van Loo hat jede davon beantwortet, ohne dass wir uns dumm vorkamen.",
      city: "Hennef",
      propertyType: "HAUS" as const,
      serviceType: "Kauf",
      daysAgo: 58,
    },
    {
      authorName: "Christine Bauer-Winkler",
      initials: "CB",
      rating: 5,
      title: "Diskrete Vermarktung wie besprochen",
      body: "Uns war wichtig, dass die Nachbarschaft nicht vor uns von dem Verkauf erfährt. Das wurde exakt so umgesetzt: keine Schilder, kein Portal, drei vorqualifizierte Interessenten. Verkauft an den zweiten.",
      city: "Köln",
      propertyType: "HAUS" as const,
      serviceType: "Verkauf",
      daysAgo: 76,
    },
    {
      authorName: "Ralf Steinbach",
      initials: "RS",
      rating: 4,
      title: "Solide von Anfang bis Ende",
      body: "Kein überzogenes Marketing, keine leeren Versprechen. Was zugesagt wurde, wurde gehalten. Für mich ist das der wichtigste Punkt bei einer solchen Summe.",
      city: "Düsseldorf",
      propertyType: "WOHNUNG" as const,
      serviceType: "Verkauf",
      daysAgo: 128,
    },
    {
      authorName: "Ingrid Molitor",
      initials: "IM",
      rating: 5,
      title: "Auch nach dem Notartermin erreichbar",
      body: "Nach der Beurkundung kamen noch Fragen zur Übergabe und zu den Zählerständen. Ich wurde nicht abgewimmelt, sondern bekam innerhalb eines Tages Antwort. Das ist leider nicht selbstverständlich.",
      city: "Bonn",
      propertyType: "WOHNUNG" as const,
      serviceType: "Verkauf",
      daysAgo: 160,
    },
    {
      authorName: "Markus Dreyer",
      initials: "MD",
      rating: 5,
      title: "Gewerbefläche gefunden, die es öffentlich nie gab",
      body: "Wir suchten kurzfristig eine Halle mit Rampe. Über Portale fanden wir nichts Passendes. Hier bekamen wir zwei Objekte gezeigt, von denen eines noch gar nicht vermarktet war.",
      city: "Troisdorf",
      propertyType: "GEWERBE" as const,
      serviceType: "Kauf",
      daysAgo: 195,
    },
  ];

  for (const r of reviews) {
    const { daysAgo: d, ...rest } = r;
    await prisma.review.create({
      data: { ...rest, reviewedAt: daysAgo(d), isDemo: true, published: true },
    });
  }

  console.log("→ Ratgeber wird angelegt …");
  await seedBlog(prisma);

  console.log("→ Beispiel-Anfragen werden angelegt …");
  const someProperty = await prisma.property.findFirst({ where: { slug: "penthouse-rheinauhafen" } });
  await prisma.lead.createMany({
    data: [
      {
        source: "OBJEKTANFRAGE",
        status: "NEU",
        firstName: "Andrea",
        lastName: "Kluth",
        email: "a.kluth@example.com",
        phone: "+49 221 23125 810",
        message: "Guten Tag, ist eine Besichtigung am kommenden Samstagvormittag möglich?",
        propertyId: someProperty?.id ?? null,
        privacyAccepted: true,
      },
      {
        source: "KONTAKTFORMULAR",
        status: "IN_BEARBEITUNG",
        firstName: "Sven",
        lastName: "Oberkamp",
        email: "s.oberkamp@example.com",
        phone: "+49 221 23125 811",
        message: "Wir suchen ein Haus mit mindestens 160 m² im Kölner Süden. Budget bis 950.000 €.",
        privacyAccepted: true,
      },
      {
        source: "VERKAUFSFUNNEL",
        status: "KONTAKTIERT",
        firstName: "Renate",
        lastName: "Fischbach",
        email: "r.fischbach@example.com",
        message: "Anfrage aus dem Verkaufsfunnel – 51065 Köln",
        privacyAccepted: true,
      },
    ],
  });

  await prisma.valuationRequest.create({
    data: {
      funnel: "BEWERTUNG",
      status: "NEU",
      propertyType: "WOHNUNG",
      zipCode: "50733",
      city: "Köln",
      livingArea: 74,
      rooms: 3,
      yearBuilt: 1962,
      condition: "GEPFLEGT",
      firstName: "Hendrik",
      lastName: "Palm",
      email: "h.palm@example.com",
      phone: "+49 221 23125 812",
      privacyAccepted: true,
    },
  });

  await prisma.contactRequest.create({
    data: {
      status: "NEU",
      subject: "Frage zur Vermietung",
      firstName: "Bianca",
      lastName: "Struth",
      email: "b.struth@example.com",
      message:
        "Guten Tag, übernehmen Sie auch die Verwaltung von vermieteten Eigentumswohnungen? Ich besitze zwei Einheiten in Nippes.",
      privacyAccepted: true,
    },
  });

  const counts = await Promise.all([
    prisma.property.count(),
    prisma.propertyImage.count(),
    prisma.agent.count(),
    prisma.review.count(),
    prisma.blogPost.count(),
    prisma.lead.count(),
  ]);

  console.log(`
✓ Seed abgeschlossen
  Immobilien:  ${counts[0]}
  Bilder:      ${counts[1]}
  Team:        ${counts[2]}
  Bewertungen: ${counts[3]}
  Artikel:     ${counts[4]}
  Leads:       ${counts[5]}
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
