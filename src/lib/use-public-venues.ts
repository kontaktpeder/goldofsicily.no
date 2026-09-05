import { useQuery } from "@tanstack/react-query";
import {
  fetchPublicVenue,
  fetchPublicVenues,
  type PublicVenue,
} from "@/lib/portal-venues";

export function publicVenuesQueryKey(lang: "no" | "en") {
  return ["public-venues", lang] as const;
}

export function publicVenueQueryKey(lang: "no" | "en", slug: string) {
  return ["public-venue", lang, slug] as const;
}

export function useHydratedVenues(lang: "no" | "en", initial: PublicVenue[]) {
  const query = useQuery({
    queryKey: publicVenuesQueryKey(lang),
    queryFn: () => fetchPublicVenues(lang),
    initialData: initial.length > 0 ? initial : undefined,
    staleTime: 60_000,
    retry: 2,
  });
  return query.data ?? initial;
}

export function useHydratedVenue(
  lang: "no" | "en",
  slug: string,
  initial: PublicVenue | null,
) {
  return useQuery({
    queryKey: publicVenueQueryKey(lang, slug),
    queryFn: () => fetchPublicVenue(slug, lang),
    initialData: initial ?? undefined,
    staleTime: 60_000,
    retry: 2,
    enabled: Boolean(slug),
  });
}
