import { useEffect, useMemo, useRef } from "react";
import type { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import logoCharacters from "@/assets/brand/logo-characters.png";
import { createGoldPinElement, goldPinSvg } from "@/components/gold-map-pin";
import { goldMapStyle } from "@/lib/gold-map-style";
import { isGoldPartner, type PublicVenue } from "@/lib/portal-venues";
import type { BrandLang } from "@/lib/brand-copy";

import "maplibre-gl/dist/maplibre-gl.css";

function venuePath(lang: BrandLang, slug: string) {
  return lang === "en" ? `/en/venues/${slug}` : `/steder/${slug}`;
}

function venueAddress(venue: PublicVenue) {
  return [venue.address, venue.city].filter(Boolean).join(", ");
}

function popupHtml(venue: PublicVenue, lang: BrandLang) {
  const partner = isGoldPartner(venue);
  const badge = partner
    ? `<p class="gold-map-card-badge">Gold Partner</p>`
    : `<p class="gold-map-card-status">${lang === "en" ? "Serves Gold" : "Serverer Gold"}</p>`;
  const cta = lang === "en" ? "See venue" : "Se stedet";
  const image = venue.imageUrl
    ? `<img src="${venue.imageUrl.replace(/"/g, "&quot;")}" alt="" class="gold-map-card-image" />`
    : "";
  const address = venueAddress(venue);
  const name = venue.name.replace(/</g, "&lt;");
  return `<div class="gold-map-card">
    ${image}
    <div class="gold-map-card-body">
      <p class="gold-map-card-name">${name}</p>
      ${badge}
      ${address ? `<p class="gold-map-card-addr">${address.replace(/</g, "&lt;")}</p>` : ""}
      <a class="gold-map-card-cta" href="${venuePath(lang, venue.slug)}">${cta} →</a>
    </div>
  </div>`;
}

function fitVenues(
  map: MapLibreMap,
  maplibregl: typeof import("maplibre-gl"),
  venues: PublicVenue[],
) {
  if (venues.length === 1) {
    map.setCenter([venues[0].longitude as number, venues[0].latitude as number]);
    map.setZoom(13.2);
    return;
  }
  const bounds = new maplibregl.LngLatBounds();
  for (const venue of venues) {
    bounds.extend([venue.longitude as number, venue.latitude as number]);
  }
  map.fitBounds(bounds, { padding: 72, maxZoom: 13.5, duration: 0 });
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
  const mapped = useMemo(
    () => venues.filter((venue) => venue.latitude != null && venue.longitude != null),
    [venues],
  );
  const mapKey = mapped.map((venue) => `${venue.slug}:${venue.latitude}:${venue.longitude}`).join("|");

  useEffect(() => {
    const host = hostRef.current;
    if (!host || mapped.length === 0) return;
    let cancelled = false;
    let map: MapLibreMap | undefined;
    const markers: Marker[] = [];
    let openPopup: Popup | undefined;

    const start = async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !hostRef.current) return;

      map = new maplibregl.Map({
        container: hostRef.current,
        style: goldMapStyle,
        center: [mapped[0].longitude as number, mapped[0].latitude as number],
        zoom: 12,
        attributionControl: false,
        cooperativeGestures: mapped.length > 1,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

      const setSelected = (slug: string | null) => {
        for (const marker of markers) {
          const el = marker.getElement();
          const isOn = el.dataset.slug === slug;
          el.classList.toggle("is-selected", isOn);
          el.innerHTML = goldPinSvg(isOn);
        }
      };

      map.on("load", () => {
        if (!map) return;
        fitVenues(map, maplibregl, mapped);
        for (const venue of mapped) {
          const el = createGoldPinElement(venue.name);
          el.dataset.slug = venue.slug;
          const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
            .setLngLat([venue.longitude as number, venue.latitude as number])
            .addTo(map);
          el.addEventListener("click", (event) => {
            event.stopPropagation();
            openPopup?.remove();
            setSelected(venue.slug);
            openPopup = new maplibregl.Popup({
              closeButton: false,
              offset: 18,
              className: "gold-map-popup",
              maxWidth: "260px",
            })
              .setLngLat([venue.longitude as number, venue.latitude as number])
              .setHTML(popupHtml(venue, lang))
              .addTo(map!);
            openPopup.on("close", () => setSelected(null));
          });
          markers.push(marker);
        }
      });
    };

    void start();
    return () => {
      cancelled = true;
      openPopup?.remove();
      for (const marker of markers) marker.remove();
      map?.remove();
    };
  }, [lang, mapKey, mapped]);

  if (mapped.length === 0) return null;

  return (
    <div className={`gold-map ${decorate ? "gold-map-decorated" : ""}`}>
      <div className="gold-map-frame">
        <div ref={hostRef} className="gold-map-canvas" role="region" aria-label={title} />
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
