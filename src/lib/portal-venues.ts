export type PublicMenuItem = {
  productSlug: string;
  name: string;
  description: string | null;
  priceNok: number | null;
  priceLabel: string | null;
  available: boolean;
  imageUrl: string | null;
};

export type PublicVenueProfile = "partner" | "listing";

export type PublicVenue = {
  slug: string;
  name: string;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  instagram: string | null;
  servingMethod: string | null;
  menuIntro: string | null;
  hasMenu: boolean;
  menu: PublicMenuItem[];
  profile?: PublicVenueProfile;
  collaborationText?: string | null;
  servingStory?: string | null;
  videoUrl?: string | null;
  menuMaterialUrl?: string | null;
  galleryUrls?: string[];
};

export type VenuePageLoad =
  | { status: "found"; venue: PublicVenue }
  | { status: "missing" }
  | { status: "unavailable" };

const DEFAULT_PORTAL_URL = "https://portal.goldofsicily.no";
const FALLBACK_PORTAL_URLS = [
  "https://portal.goldofsicily.no",
  "https://aranicnireport.lovable.app",
];

export function portalApiBase() {
  const fromEnv =
    (typeof process !== "undefined" &&
      (process.env.PORTAL_API_URL || process.env.VITE_PORTAL_API_URL)) ||
    "";
  return (fromEnv || DEFAULT_PORTAL_URL).replace(/\/$/, "");
}

function portalBases() {
  return [...new Set([portalApiBase(), ...FALLBACK_PORTAL_URLS])];
}

export function isGoldPartner(venue: PublicVenue) {
  return venue.profile === "partner";
}

export function isPublicMenuUrl(url: string | null | undefined): url is string {
  return Boolean(url && /^https?:\/\//i.test(url.trim()));
}

export function groupVenuesByCity(venues: PublicVenue[], fallbackCity: string) {
  const groups = new Map<string, PublicVenue[]>();
  for (const venue of venues) {
    const city = venue.city?.trim() || fallbackCity;
    const list = groups.get(city) ?? [];
    list.push(venue);
    groups.set(city, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "nb"))
    .map(([city, items]) => ({
      city,
      venues: items.slice().sort((left, right) => {
        if (isGoldPartner(left) !== isGoldPartner(right)) return isGoldPartner(left) ? -1 : 1;
        return left.name.localeCompare(right.name, "nb");
      }),
    }));
}

class PortalHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Expected JSON from portal, got ${contentType || "unknown"}`);
  }
  return (await response.json()) as T;
}

async function fetchJson<T>(path: string, lang: "no" | "en"): Promise<T> {
  let lastError: unknown;
  for (const base of portalBases()) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(`${base}${path}?lang=${lang}`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(8000),
        });
        if (response.status === 404) {
          throw new PortalHttpError(404, `Not found: ${path}`);
        }
        if (!response.ok) {
          lastError = new PortalHttpError(response.status, `HTTP ${response.status}`);
          continue;
        }
        return await parseJson<T>(response);
      } catch (error) {
        if (error instanceof PortalHttpError && error.status === 404) throw error;
        lastError = error;
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Portal request failed");
}

export async function fetchPublicVenues(lang: "no" | "en"): Promise<PublicVenue[]> {
  const data = await fetchJson<{ venues: PublicVenue[] }>("/api/public/v1/venues", lang);
  return data.venues ?? [];
}

export async function fetchPublicVenue(
  slug: string,
  lang: "no" | "en",
): Promise<PublicVenue | null> {
  try {
    const data = await fetchJson<{ venue: PublicVenue }>(
      `/api/public/v1/venues/${encodeURIComponent(slug)}`,
      lang,
    );
    if (data.venue) return data.venue;
  } catch (error) {
    if (!(error instanceof PortalHttpError) || error.status !== 404) {
      throw error;
    }
  }

  const venues = await fetchPublicVenues(lang);
  return venues.find((venue) => venue.slug === slug) ?? null;
}

export async function loadVenueForPage(
  slug: string,
  lang: "no" | "en",
): Promise<VenuePageLoad> {
  try {
    const venue = await fetchPublicVenue(slug, lang);
    return venue ? { status: "found", venue } : { status: "missing" };
  } catch {
    return { status: "unavailable" };
  }
}

export function mapsUrl(venue: PublicVenue) {
  if (venue.latitude != null && venue.longitude != null) {
    return `https://www.openstreetmap.org/?mlat=${venue.latitude}&mlon=${venue.longitude}#map=16/${venue.latitude}/${venue.longitude}`;
  }
  const q = [venue.address, venue.city, venue.name].filter(Boolean).join(", ");
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`;
}

export function osmEmbedUrl(venues: PublicVenue[]) {
  const withCoords = venues.filter((venue) => venue.latitude != null && venue.longitude != null);
  if (withCoords.length === 0) return null;
  const lats = withCoords.map((venue) => venue.latitude as number);
  const lngs = withCoords.map((venue) => venue.longitude as number);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padLat = Math.max((maxLat - minLat) * 0.3, 0.04);
  const padLng = Math.max((maxLng - minLng) * 0.3, 0.06);
  const marker = `&marker=${withCoords[0].latitude}%2C${withCoords[0].longitude}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng - padLng}%2C${minLat - padLat}%2C${maxLng + padLng}%2C${maxLat + padLat}&layer=mapnik${withCoords.length === 1 ? marker : ""}`;
}
