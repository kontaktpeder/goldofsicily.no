import { useEffect, useMemo, useRef, useState } from "react";
import logoCharacters from "@/assets/brand/logo-characters.png";
import { goldPinSvg } from "@/components/gold-map-pin";
import { isGoldPartner, type PublicVenue } from "@/lib/portal-venues";
import type { BrandLang } from "@/lib/brand-copy";

const CARTO_VOYAGER =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const OSM_RASTER = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

function venuePath(lang: BrandLang, slug: string) {
  return lang === "en" ? `/en/venues/${slug}` : `/steder/${slug}`;
}

function venueAddress(venue: PublicVenue) {
  return [venue.address, venue.city].filter(Boolean).join(", ");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function popupHtml(venue: PublicVenue, lang: BrandLang) {
  const partner = isGoldPartner(venue);
  const badge = partner
    ? `<p class="gold-map-card-badge">Gold Partner</p>`
    : `<p class="gold-map-card-status">${lang === "en" ? "Serves Gold" : "Serverer Gold"}</p>`;
  const cta = lang === "en" ? "See venue" : "Se stedet";
  const image = venue.imageUrl
    ? `<img src="${escapeHtml(venue.imageUrl)}" alt="" class="gold-map-card-image" />`
    : "";
  const address = venueAddress(venue);
  return `<div class="gold-map-card">
    ${image}
    <div class="gold-map-card-body">
      <p class="gold-map-card-name">${escapeHtml(venue.name)}</p>
      ${badge}
      ${address ? `<p class="gold-map-card-addr">${escapeHtml(address)}</p>` : ""}
      <a class="gold-map-card-cta" href="${venuePath(lang, venue.slug)}">${cta} →</a>
    </div>
  </div>`;
}

function osmEmbedSrc(venues: PublicVenue[]) {
  const lats = venues.map((venue) => venue.latitude as number);
  const lngs = venues.map((venue) => venue.longitude as number);
  const pad = 0.04;
  const south = Math.min(...lats) - pad;
  const north = Math.max(...lats) + pad;
  const west = Math.min(...lngs) - pad;
  const east = Math.max(...lngs) + pad;
  const marker = `&marker=${lats[0]}%2C${lngs[0]}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik${marker}`;
}

export function VenuesMap({
  venues,
  title,
  lang = "no",
  decorate = false,
}: {
  venues: PublicVenue[];
  title: string;
  lang?: BrandLang;
  decorate?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const mapped = useMemo(
    () => venues.filter((venue) => venue.latitude != null && venue.longitude != null),
    [venues],
  );
  const mapKey = mapped.map((venue) => `${venue.slug}:${venue.latitude}:${venue.longitude}`).join("|");

  useEffect(() => {
    const host = hostRef.current;
    if (!host || mapped.length === 0) return;
    let cancelled = false;
    let map: import("leaflet").Map | undefined;
    let resizeTimer: number | undefined;

    const start = async () => {
      try {
        const leafletMod = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        const L = leafletMod.default ?? leafletMod;
        if (cancelled || !hostRef.current) return;

        map = L.map(hostRef.current, {
          center: [mapped[0].latitude as number, mapped[0].longitude as number],
          zoom: 13,
          scrollWheelZoom: false,
          attributionControl: false,
          zoomControl: false,
        });
        L.control.zoom({ position: "topright" }).addTo(map);
        L.control
          .attribution({ position: "bottomright", prefix: false })
          .addTo(map);

        let usingOsm = false;
        const carto = L.tileLayer(CARTO_VOYAGER, {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        });
        carto.on("tileerror", () => {
          if (usingOsm || !map) return;
          usingOsm = true;
          map.removeLayer(carto);
          L.tileLayer(OSM_RASTER, {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }).addTo(map);
        });
        carto.addTo(map);

        const pinIcon = (selected: boolean) =>
          L.divIcon({
            className: "gold-map-marker",
            html: `<span class="gold-map-pin${selected ? " is-selected" : ""}">${goldPinSvg(selected)}</span>`,
            iconSize: [28, 35],
            iconAnchor: [14, 35],
            popupAnchor: [0, -30],
          });

        for (const venue of mapped) {
          const marker = L.marker([venue.latitude as number, venue.longitude as number], {
            icon: pinIcon(false),
            title: venue.name,
            alt: venue.name,
          }).addTo(map);
          marker.bindPopup(popupHtml(venue, lang), {
            className: "gold-map-popup",
            maxWidth: 260,
            closeButton: false,
            autoPanPadding: [28, 28],
          });
          marker.on("popupopen", () => marker.setIcon(pinIcon(true)));
          marker.on("popupclose", () => marker.setIcon(pinIcon(false)));
        }

        if (mapped.length === 1) {
          map.setView([mapped[0].latitude as number, mapped[0].longitude as number], 13);
        } else {
          const bounds = L.latLngBounds(
            mapped.map((venue) => [venue.latitude as number, venue.longitude as number] as [number, number]),
          );
          map.fitBounds(bounds, { padding: [64, 64], maxZoom: 13 });
        }

        const refreshSize = () => map?.invalidateSize();
        requestAnimationFrame(refreshSize);
        resizeTimer = window.setTimeout(refreshSize, 180);
      } catch (error) {
        console.error("Gold map failed to start", error);
        if (!cancelled) setFailed(true);
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (resizeTimer) window.clearTimeout(resizeTimer);
      map?.remove();
    };
  }, [lang, mapKey, mapped]);

  if (mapped.length === 0) return null;

  return (
    <div className={`gold-map ${decorate ? "gold-map-decorated" : ""}`}>
      <div className="gold-map-frame">
        {failed ? (
          <iframe
            title={title}
            className="gold-map-canvas gold-map-fallback"
            src={osmEmbedSrc(mapped)}
            loading="lazy"
          />
        ) : (
          <div ref={hostRef} className="gold-map-canvas" role="region" aria-label={title} />
        )}
      </div>
      {decorate ? (
        <img src={logoCharacters} alt="" aria-hidden className="gold-map-character" />
      ) : null}
      {mapped.length > 1 ? (
        <p className="gold-map-legend">
          <span>Gold Partner</span>
          <span>{lang === "en" ? "Serves Gold" : "Serverer Gold"}</span>
        </p>
      ) : null}
    </div>
  );
}
