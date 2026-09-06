import { useEffect, useMemo, useRef, useState } from "react";
import { createGoldPinElement, goldPinSvg } from "@/components/gold-map-pin";
import { goldMapStyle } from "@/lib/gold-map-style";
import {
  appleMapsUrl,
  googleMapsUrl,
  isGoldPartner,
  type PublicVenue,
} from "@/lib/portal-venues";
import type { BrandLang } from "@/lib/brand-copy";

const OSM_RASTER = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAX_ZOOM = 16;
const FIT_ZOOM = 13;
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://openfreemap.org">OpenFreeMap</a>';

function venuePath(lang: BrandLang, slug: string) {
  return lang === "en" ? `/en/venues/${slug}` : `/steder/${slug}`;
}

function venueAddress(venue: PublicVenue) {
  return [venue.address, venue.city].filter(Boolean).join(", ");
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

function resolveMapLibre(mod: typeof import("maplibre-gl") & { default?: typeof import("maplibre-gl") }) {
  if (typeof mod.Map === "function") return mod;
  if (typeof mod.default?.Map === "function") return mod.default;
  throw new Error("MapLibre Map constructor missing");
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

function VenueDock({
  venue,
  lang,
  onClose,
}: {
  venue: PublicVenue;
  lang: BrandLang;
  onClose: () => void;
}) {
  const partner = isGoldPartner(venue);
  const address = venueAddress(venue);
  const closeLabel = lang === "en" ? "Close" : "Lukk";
  const cta = lang === "en" ? "See venue" : "Se stedet";
  const openLabel = lang === "en" ? "Open in maps?" : "Åpne i kart?";
  const appleLabel = lang === "en" ? "Apple Maps" : "Apple Kart";

  return (
    <aside className="gold-map-dock" aria-label={venue.name}>
      <button type="button" className="gold-map-dock-close" onClick={onClose} aria-label={closeLabel}>
        ×
      </button>
      {venue.imageUrl ? <img src={venue.imageUrl} alt="" className="gold-map-card-image" /> : null}
      <div className="gold-map-card-body">
        <p className="gold-map-card-name">{venue.name}</p>
        {partner ? (
          <p className="gold-map-card-badge">Gold Partner</p>
        ) : (
          <p className="gold-map-card-status">{lang === "en" ? "Serves Gold" : "Serverer Gold"}</p>
        )}
        {address ? <p className="gold-map-card-addr">{address}</p> : null}
        <a className="gold-map-card-cta" href={venuePath(lang, venue.slug)}>
          {cta} →
        </a>
        <div className="gold-map-open">
          <p className="gold-map-open-q">{openLabel}</p>
          <p className="gold-map-open-apps">
            <a href={googleMapsUrl(venue)} target="_blank" rel="noreferrer">
              Google Maps
            </a>
            <span aria-hidden> · </span>
            <a href={appleMapsUrl(venue)} target="_blank" rel="noreferrer">
              {appleLabel}
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

export function VenuesMap({
  venues,
  title,
  lang = "no",
}: {
  venues: PublicVenue[];
  title: string;
  lang?: BrandLang;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<(slug: string | null) => void>(() => {});
  const paintPinsRef = useRef<(slug: string | null) => void>(() => {});
  const [failed, setFailed] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const mapped = useMemo(
    () => venues.filter((venue) => venue.latitude != null && venue.longitude != null),
    [venues],
  );
  const selected = mapped.find((venue) => venue.slug === selectedSlug) ?? null;
  const mapKey = mapped.map((venue) => `${venue.slug}:${venue.latitude}:${venue.longitude}`).join("|");
  selectRef.current = setSelectedSlug;

  useEffect(() => {
    paintPinsRef.current(selectedSlug);
  }, [selectedSlug]);

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
      teardown = () => {
        map.remove();
      };
      if (cancelled) {
        teardown();
        return;
      }
      L.control.zoom({ position: "topleft" }).addTo(map);
      L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
      L.tileLayer(OSM_RASTER, {
        attribution: ATTRIBUTION,
        maxZoom: MAX_ZOOM,
      }).addTo(map);

      const pinIcon = (on: boolean) =>
        L.divIcon({
          className: "gold-map-marker",
          html: `<span class="gold-map-pin${on ? " is-selected" : ""}">${goldPinSvg(on)}</span>`,
          iconSize: [36, 45],
          iconAnchor: [18, 45],
        });

      const markers = new Map<string, import("leaflet").Marker>();
      paintPinsRef.current = (slug) => {
        for (const [itemSlug, marker] of markers) {
          marker.setIcon(pinIcon(itemSlug === slug));
          const el = marker.getElement();
          if (el) el.dataset.slug = itemSlug;
        }
      };

      for (const venue of mapped) {
        const marker = L.marker([venue.latitude as number, venue.longitude as number], {
          icon: pinIcon(false),
          title: venue.name,
          alt: venue.name,
        }).addTo(map);
        const el = marker.getElement();
        if (el) el.dataset.slug = venue.slug;
        marker.on("click", (event) => {
          L.DomEvent.stopPropagation(event);
          selectRef.current(venue.slug);
          map.flyTo([venue.latitude as number, venue.longitude as number], Math.max(map.getZoom(), 14), {
            duration: 0.55,
          });
        });
        markers.set(venue.slug, marker);
      }

      if (mapped.length === 1) {
        map.setView([mapped[0].latitude as number, mapped[0].longitude as number], 12);
      } else {
        map.fitBounds(
          L.latLngBounds(
            mapped.map((venue) => [venue.latitude as number, venue.longitude as number] as [number, number]),
          ),
          { padding: [72, 72], maxZoom: FIT_ZOOM },
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
      const maplibregl = resolveMapLibre(maplibreMod);
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
      teardown = () => {
        map.remove();
      };
      if (cancelled) {
        teardown();
        return;
      }
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
      map.addControl(
        new maplibregl.AttributionControl({ compact: true, customAttribution: ATTRIBUTION }),
        "bottom-right",
      );

      const markers: InstanceType<typeof maplibregl.Marker>[] = [];
      paintPinsRef.current = (slug) => {
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
      hostRef.current.dataset.engine = "maplibre";

      if (mapped.length === 1) {
        map.setCenter([mapped[0].longitude as number, mapped[0].latitude as number]);
        map.setZoom(12);
      } else {
        const bounds = new maplibregl.LngLatBounds();
        for (const venue of mapped) {
          bounds.extend([venue.longitude as number, venue.latitude as number]);
        }
        map.fitBounds(bounds, { padding: 80, maxZoom: FIT_ZOOM, duration: 0 });
      }

      for (const venue of mapped) {
        const el = createGoldPinElement(venue.name);
        el.dataset.slug = venue.slug;
        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([venue.longitude as number, venue.latitude as number])
          .addTo(map);
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          selectRef.current(venue.slug);
          map.easeTo({
            center: [venue.longitude as number, venue.latitude as number],
            zoom: Math.max(map.getZoom(), 14),
            padding: { top: 48, bottom: 48, left: 48, right: 300 },
            duration: 500,
          });
        });
        markers.push(marker);
      }

      teardown = () => {
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
      paintPinsRef.current = () => {};
      teardown();
    };
  }, [mapKey, mapped]);

  if (mapped.length === 0) return null;

  return (
    <div className="gold-map">
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
        {selected ? <VenueDock venue={selected} lang={lang} onClose={() => setSelectedSlug(null)} /> : null}
      </div>
      {mapped.length > 1 ? (
        <p className="gold-map-legend">
          <span>Gold Partner</span>
          <span>{lang === "en" ? "Serves Gold" : "Serverer Gold"}</span>
        </p>
      ) : null}
    </div>
  );
}
