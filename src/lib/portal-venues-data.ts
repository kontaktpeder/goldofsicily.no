import type { PublicMenuItem, PublicVenue, PublicVenueProfile } from "@/lib/portal-venues";

const PORTAL_SUPABASE_URL = "https://acxxvgwjrzchzbgjlpxb.supabase.co";
const PORTAL_SUPABASE_KEY = "sb_publishable_BgqQwUMdCc_QO7BQvcbf3Q_eU58Nhks";

type VenueRow = {
  id: string;
  slug: string | null;
  name: string;
  city: string | null;
  location: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  logo_url: string | null;
  website_url: string | null;
  instagram: string | null;
  serving_method: string | null;
  menu_intro: string | null;
  public_profile?: string | null;
  collaboration_text?: string | null;
  serving_story?: string | null;
  video_url?: string | null;
  menu_material_url?: string | null;
  gallery_urls?: string[] | null;
};

type MenuRow = {
  venue_id: string;
  product_id: string;
  available: boolean;
  sort_order: number;
  display_name: string | null;
  description: string | null;
  price_ore: number | null;
  image_url: string | null;
};

type ProductRow = {
  id: string;
  slug: string;
  name_no: string;
  name_en: string;
  description_no: string | null;
  description_en: string | null;
  image_url: string | null;
};

function formatPriceNok(priceOre: number) {
  const nok = priceOre / 100;
  return Number.isInteger(nok) ? `${nok}` : nok.toFixed(2).replace(".", ",");
}

async function portalRest<T>(query: string): Promise<T> {
  const response = await fetch(`${PORTAL_SUPABASE_URL}/rest/v1/${query}`, {
    headers: {
      apikey: PORTAL_SUPABASE_KEY,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Portal data HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

function readProfile(venue: VenueRow): PublicVenueProfile {
  return venue.public_profile === "partner" ? "partner" : "listing";
}

function toMenuItem(item: MenuRow, product: ProductRow | undefined, lang: "no" | "en"): PublicMenuItem | null {
  if (!product || !item.available) return null;
  const name = item.display_name?.trim() || (lang === "en" ? product.name_en : product.name_no);
  return {
    productSlug: product.slug,
    name,
    description:
      item.description?.trim() ||
      (lang === "en" ? product.description_en : product.description_no) ||
      null,
    priceNok: item.price_ore == null ? null : item.price_ore / 100,
    priceLabel: item.price_ore == null ? null : `${formatPriceNok(item.price_ore)} kr`,
    available: item.available,
    imageUrl: item.image_url || product.image_url,
  };
}

function mapVenue(
  venue: VenueRow,
  menuItems: MenuRow[],
  productsById: Map<string, ProductRow>,
  lang: "no" | "en",
): PublicVenue | null {
  if (!venue.slug) return null;
  const menu = menuItems
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => toMenuItem(item, productsById.get(item.product_id), lang))
    .filter((item): item is PublicMenuItem => Boolean(item));
  const profile = readProfile(venue);
  const rich = profile === "partner";
  return {
    slug: venue.slug,
    name: venue.name,
    city: venue.city || venue.location,
    address: venue.address,
    latitude: venue.latitude,
    longitude: venue.longitude,
    imageUrl: venue.image_url,
    logoUrl: venue.logo_url,
    websiteUrl: venue.website_url,
    instagram: venue.instagram,
    servingMethod: venue.serving_method,
    menuIntro: venue.menu_intro,
    hasMenu: menu.length > 0,
    menu,
    profile,
    collaborationText: rich ? venue.collaboration_text ?? null : null,
    servingStory: rich ? venue.serving_story ?? null : null,
    videoUrl: rich ? venue.video_url ?? null : null,
    menuMaterialUrl: rich ? venue.menu_material_url ?? null : null,
    galleryUrls: rich ? venue.gallery_urls ?? [] : [],
  };
}

export async function loadVenuesFromPortalDb(lang: "no" | "en"): Promise<PublicVenue[]> {
  const [venues, menuItems, products] = await Promise.all([
    portalRest<VenueRow[]>(
      "venues?select=*&active=eq.true&public_visible=eq.true&slug=not.is.null&order=name",
    ),
    portalRest<MenuRow[]>("venue_menu_items?select=*&available=eq.true&order=sort_order"),
    portalRest<ProductRow[]>("products?select=*&active=eq.true"),
  ]);
  const productsById = new Map(products.map((product) => [product.id, product]));
  const menuByVenue = new Map<string, MenuRow[]>();
  for (const item of menuItems) {
    const list = menuByVenue.get(item.venue_id) ?? [];
    list.push(item);
    menuByVenue.set(item.venue_id, list);
  }
  return venues
    .map((venue) => mapVenue(venue, menuByVenue.get(venue.id) ?? [], productsById, lang))
    .filter((venue): venue is PublicVenue => Boolean(venue));
}

export async function loadVenueFromPortalDb(slug: string, lang: "no" | "en"): Promise<PublicVenue | null> {
  const venues = await portalRest<VenueRow[]>(
    `venues?select=*&slug=eq.${encodeURIComponent(slug)}&active=eq.true&public_visible=eq.true`,
  );
  const venue = venues[0];
  if (!venue) return null;
  const [menuItems, products] = await Promise.all([
    portalRest<MenuRow[]>(
      `venue_menu_items?select=*&venue_id=eq.${encodeURIComponent(venue.id)}&available=eq.true&order=sort_order`,
    ),
    portalRest<ProductRow[]>("products?select=*&active=eq.true"),
  ]);
  const productsById = new Map(products.map((product) => [product.id, product]));
  return mapVenue(venue, menuItems, productsById, lang);
}
