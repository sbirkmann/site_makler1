"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  /** Optionaler Inhalt fuer das Popup (bereits formatiert). */
  subtitle?: string;
  href?: string;
  imageUrl?: string;
}

export interface PropertyMapProps {
  markers: MapMarker[];
  /** Zoomstufe, wenn nur ein Marker existiert. */
  zoom?: number;
  className?: string;
  /**
   * Blendet statt eines exakten Markers einen Radius ein – sinnvoll auf der
   * Detailseite, solange die genaue Adresse nicht oeffentlich sein soll.
   */
  approximate?: boolean;
  /** Deaktiviert Zoom per Mausrad, damit das Scrollen der Seite nicht haengt. */
  scrollWheelZoom?: boolean;
}

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>-Mitwirkende';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function popupHtml(marker: MapMarker) {
  const title = escapeHtml(marker.title);
  const subtitle = marker.subtitle ? escapeHtml(marker.subtitle) : "";
  const image = marker.imageUrl
    ? `<img src="${escapeHtml(marker.imageUrl)}" alt="" class="mb-2 h-24 w-full rounded object-cover" />`
    : "";
  const heading = marker.href
    ? `<a href="${escapeHtml(marker.href)}" class="font-medium text-primary-900 underline-offset-2 hover:underline">${title}</a>`
    : `<span class="font-medium text-primary-900">${title}</span>`;

  return `<div class="w-52 text-[0.8125rem] leading-snug">${image}${heading}${
    subtitle ? `<p class="mt-1 text-ink-muted">${subtitle}</p>` : ""
  }</div>`;
}

export function PropertyMap({
  markers,
  zoom = 14,
  className,
  approximate = false,
  scrollWheelZoom = false,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [failed, setFailed] = useState(false);
  const instanceId = useId();

  // Stabile Signatur der Marker: ein neues Array mit identischen Werten soll
  // die Karte nicht neu aufbauen.
  const markerKey = markers.map((m) => `${m.id}:${m.latitude}:${m.longitude}`).join("|");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || markers.length === 0) return;

    let cancelled = false;
    let map: LeafletMap | null = null;

    // Leaflet greift beim Import direkt auf `window` zu und wird deshalb
    // erst im Browser geladen. Das CSS kommt aus demselben Paket.
    (async () => {
      try {
        const L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");
        if (cancelled || !containerRef.current) return;

        map = L.map(containerRef.current, {
          scrollWheelZoom,
          zoomControl: true,
          attributionControl: true,
        });
        mapRef.current = map;

        L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

        const icon = L.divIcon({
          className: "wohnwert-marker",
          html: '<span class="wohnwert-marker__pin"></span>',
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -24],
        });

        const layers: Marker[] = [];
        for (const marker of markers) {
          if (approximate) {
            // Ungefaehre Lage: 300-m-Kreis statt punktgenauer Adresse.
            L.circle([marker.latitude, marker.longitude], {
              radius: 300,
              color: "#233d64",
              weight: 1.5,
              fillOpacity: 0.12,
            }).addTo(map);
          }
          const layer = L.marker([marker.latitude, marker.longitude], {
            icon,
            title: marker.title,
            alt: marker.title,
            keyboard: true,
          }).addTo(map);
          if (markers.length > 1 || marker.subtitle || marker.href) {
            layer.bindPopup(popupHtml(marker));
          }
          layers.push(layer);
        }

        if (layers.length === 1) {
          map.setView([markers[0].latitude, markers[0].longitude], zoom);
        } else {
          map.fitBounds(
            L.latLngBounds(layers.map((l) => l.getLatLng())),
            { padding: [40, 40], maxZoom: 14 },
          );
        }
      } catch (error) {
        console.error("Karte konnte nicht geladen werden:", error);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
    // `markers` selbst ist bewusst keine Abhaengigkeit – verglichen wird die
    // stabile Signatur `markerKey`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey, zoom, approximate, scrollWheelZoom]);

  if (markers.length === 0 || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-[var(--radius-lg)] border border-line bg-surface-sunken text-[0.875rem] text-ink-subtle",
          className,
        )}
      >
        {failed ? "Karte konnte nicht geladen werden." : "Für dieses Objekt liegt keine Kartenposition vor."}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={`map-${instanceId.replace(/[:]/g, "")}`}
      role="application"
      aria-label="Karte mit Immobilienstandorten"
      className={cn(
        "z-0 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-sunken",
        className,
      )}
    />
  );
}
