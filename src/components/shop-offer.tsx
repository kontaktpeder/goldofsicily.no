import { useEffect, useState } from "react";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { formatShopPrice, loadShopOffer, postShopOffer, type PublicOffer } from "@/lib/shop";

type Lang = "no" | "en";

const COPY = {
  no: {
    title: "Tilbud",
    missing: "Tilbudet finnes ikke lenger.",
    accept: "Godta tilbudet",
    working: "Lagrer …",
    done: "Takk. Tilbudet er godtatt.",
    stock: "Lageret rakk ikke. Vi tar kontakt.",
    closed: "Tilbudet er ikke åpent lenger.",
    pickup:
      "Henting utenfor Smalgangen 31, 0188 Oslo. Vi møter deg utenfor restauranten. Faktura etter levering.",
    delivery: "Levering til adressen. Faktura etter levering.",
    goods: "Varer",
    freight: "Frakt",
    boxes: "esker",
  },
  en: {
    title: "Offer",
    missing: "This offer is no longer here.",
    accept: "Accept the offer",
    working: "Saving …",
    done: "Thank you. The offer is accepted.",
    stock: "The stock was gone. We’ll be in touch.",
    closed: "This offer is no longer open.",
    pickup:
      "Pickup outside Smalgangen 31, 0188 Oslo. We meet you outside the restaurant. Invoice after delivery.",
    delivery: "Delivery to the address. Invoice after delivery.",
    goods: "Goods",
    freight: "Freight",
    boxes: "boxes",
  },
} as const;

export function ShopOffer({ token }: { token: string }) {
  const [offer, setOffer] = useState<PublicOffer | null | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    setOffer(undefined);
    void loadShopOffer(token).then((next) => {
      if (live) setOffer(next);
    });
    return () => {
      live = false;
    };
  }, [token]);

  const lang: Lang = offer?.lang === "en" ? "en" : "no";
  const copy = COPY[lang];
  const open = offer?.status === "offer";

  async function accept() {
    setBusy(true);
    const result = await postShopOffer(token);
    setBusy(false);
    if (result === "ok") setMessage(copy.done);
    else if (result === "stock") setMessage(copy.stock);
    else setMessage(copy.closed);
  }

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display text-foreground">
      <BrandNav lang={lang} />
      <main className="mx-auto max-w-xl px-5 py-16">
        <h1 className="font-display text-4xl tracking-tight">{copy.title}</h1>
        {offer === undefined ? <p className="mt-6 text-lg italic">…</p> : null}
        {offer === null ? <p className="mt-6 text-lg italic">{copy.missing}</p> : null}
        {offer ? (
          <div className="mt-6">
            <p className="text-sm uppercase tracking-[0.16em] text-foreground/55">{offer.number}</p>
            <p className="mt-2 text-2xl">
              {offer.boxes} {copy.boxes} · {offer.flavorName}
            </p>
            <p className="mt-2 font-display text-4xl">{formatShopPrice(offer.totalOre)}</p>
            {offer.freightOre != null ? (
              <p className="mt-2 text-base">
                {copy.goods} {formatShopPrice(offer.goodsOre)} · {copy.freight}{" "}
                {formatShopPrice(offer.freightOre)}
              </p>
            ) : null}
            <p className="mt-3 text-base italic text-foreground/75">
              {offer.fulfillment === "pickup" ? copy.pickup : copy.delivery}
              {offer.note ? ` ${offer.note}` : ""}
            </p>
            {message ? (
              <p className="mt-6 text-lg italic" role="status">
                {message}
              </p>
            ) : null}
            {open && !message ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void accept()}
                className="mt-8 min-h-12 w-full bg-[color:var(--olive)] px-4 py-4 text-xl italic text-[color:var(--cream)] disabled:opacity-60"
              >
                {busy ? copy.working : copy.accept}
              </button>
            ) : null}
          </div>
        ) : null}
      </main>
      <BrandFooter lang={lang} />
    </div>
  );
}
