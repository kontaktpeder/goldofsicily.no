import { useEffect, useMemo, useRef, useState } from "react";
import logoCharacters from "@/assets/brand/logo-characters.png";
import { createGoldPinElement, goldPinSvg } from "@/components/gold-map-pin";
import { goldMapStyle } from "@/lib/gold-map-style";
import { isGoldPartner, type PublicVenue } from "@/lib/portal-venues";
import type { BrandLang } from "@/lib/brand-copy";

const OSM_RASTER = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAX_ZOOM = 13;
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://openfreemap.org">OpenFreeMap</a>';

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

function waitForMapLoad(map: { once: (event: "load", cb: () => void) => void }) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("map style timeout")), 8000);
    map.once("load", () => {
      window.clearTimeout(timer);
      resolve();
    });
  });
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
    let teardown = () => {};

    const startLeaflet = async () => {
      const leafletMod = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      const L = leafletMod.default ?? leafletMod;
      if (cancelled || !hostRef.current) return;

      const map = L.map(hostRef.current, {
        center: [mapped[0].latitude as number, mapped[0].longitude as number],
        zoom: 12,
        minZoom: 10,
        maxZoom: MAX_ZOOM,
        scrollWheelZoom: false,
        attributionControl: false,
        zoomControl: false,
      });
      L.control.zoom({ position: "topright" }).addTo(map);
      L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
      L.tileLayer(OSM_RASTER, {
        attribution: ATTRIBUTION,
        maxZoom: MAX_ZOOM,
      }).addTo(map);

      const pinIcon = (selected: boolean) =>
        L.divIcon({
          className: "gold-map-marker",
          html: `<span class="gold-map-pin${selected ? " is-selected" : ""}">${goldPinSvg(selected)}</span>`,
          iconSize: [36, 45],
          iconAnchor: [18, 45],
          popupAnchor: [0, -38],
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
        map.setView([mapped[0].latitude as number, mapped[0].longitude as number], 12);
      } else {
        map.fitBounds(
          L.latLngBounds(
            mapped.map((venue) => [venue.latitude as number, venue.longitude as number] as [number, number]),
          ),
          { padding: [72, 72], maxZoom: MAX_ZOOM },
        );
      }

      const refreshSize = () => map.invalidateSize();
      requestAnimationFrame(refreshSize);
      const resizeTimer = window.setTimeout(refreshSize, 180);
      teardown = () => {
        window.clearTimeout(resizeTimer);
        map.remove();
      };
    };

    const startMapLibre = async () => {
      const maplibreMod = await import("maplibre-gl");
      await import("maplibre-gl/dist/maplibre-gl.css");
      const maplibregl = (maplibreMod as { default?: typeof import("maplibre-gl") }).default ?? maplibreMod;
      if (cancelled || !hostRef.current) return;

      const map = new maplibregl.Map({
        container: hostRef.current,
        style: goldMapStyle,
        center: [mapped[0].longitude as number, mapped[0].latitude as number],
        zoom: 12,
        minZoom: 10,
        maxZoom: MAX_ZOOM,
        attributionControl: false,
        cooperativeGestures: mapped.length > 1,
        dragRotate: false,
        pitchWithRotate: false,
        maxPitch: 0,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(
        new maplibregl.AttributionControl({ compact: true, customAttribution: ATTRIBUTION }),
        "bottom-right",
      );

      const markers: InstanceType<typeof maplibregl.Marker>[] = [];
      let openPopup: InstanceType<typeof maplibregl.Popup> | undefined;

      const setSelected = (slug: string | null) => {
        for (const marker of markers) {
          const el = marker.getElement();
          const isOn = el.dataset.slug === slug;
          el.classList.toggle("is-selected", isOn);
          el.innerHTML = goldPinSvg(isOn);
        }
      };

      await waitForMapLoad(map);
      if (cancelled) {
        map.remove();
        return;
      }

      if (mapped.length === 1) {
        map.setCenter([mapped[0].longitude as number, mapped[0].latitude as number]);
        map.setZoom(12);
      } else {
        const bounds = new maplibregl.LngLatBounds();
        for (const venue of mapped) {
          bounds.extend([venue.longitude as number, venue.latitude as number]);
        }
        map.fitBounds(bounds, { padding: 80, maxZoom: MAX_ZOOM, duration: 0 });
      }

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
            offset: 20,
            className: "gold-map-popup",
            maxWidth: "260px",
          })
            .setLngLat([venue.longitude as number, venue.latitude as number])
            .setHTML(popupHtml(venue, lang))
            .addTo(map);
          openPopup.on("close", () => setSelected(null));
        });
        markers.push(marker);
      }

      teardown = () => {
        openPopup?.remove();
        for (const marker of markers) marker.remove();
        map.remove();
      };
    };

    const start = async () => {
      try {
        await startMapLibre();
      } catch (error) {
        console.warn("Schematic map fell back to raster tiles", error);
        if (cancelled) return;
        teardown();
        try {
          await startLeaflet();
        } catch (fallbackError) {
          console.error("Gold map failed to start", fallbackError);
          if (!cancelled) setFailed(true);
        }
      }
    };

    void start();
    return () => {
      cancelled = true;
      teardown();
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
