import photoHands from "@/assets/brand/photo-hands.jpg";
import photoGold from "@/assets/brand/photo-the-gold.jpg";

/**
 * Drop the real 50-box photo at src/assets/shop/eske-50.jpg.
 * It becomes the first slide without any other code change.
 * Until that file exists, the gallery stays on the real food photos.
 */
const boxModules = import.meta.glob("../assets/shop/eske-50.jpg", {
  eager: true,
  import: "default",
});

export type ShopSlideKind = "box" | "food";

export type ShopSlide = {
  src: string;
  kind: ShopSlideKind;
  id: "box" | "tray" | "hands";
};

function boxSrc(): string | null {
  const found = Object.values(boxModules)[0];
  return typeof found === "string" ? found : null;
}

export function shopSlides(): ShopSlide[] {
  const food: ShopSlide[] = [
    { src: photoGold, kind: "food", id: "tray" },
    { src: photoHands, kind: "food", id: "hands" },
  ];
  const box = boxSrc();
  if (!box) return food;
  return [{ src: box, kind: "box", id: "box" }, ...food];
}
