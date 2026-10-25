import { createServerFn } from "@tanstack/react-start";
import { launchPostAllowed, parseWaitlist } from "@/lib/shop-catalog";
import { loadShopPage, postWaitlist } from "@/lib/shop";

export const submitShopWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = parseWaitlist(input);
    if (!parsed) throw new Error("invalid");
    return parsed;
  })
  .handler(async ({ data }) => {
    const shop = data.launchNotice ? await loadShopPage() : null;
    const decision = launchPostAllowed(shop?.launchList === true, data);
    if (decision === "block") throw new Error("unavailable");
    const payload = decision === "strip-launch" ? { ...data, launchNotice: false } : data;
    const result = await postWaitlist(payload);
    if (result !== "ok") throw new Error(result);
    return { ok: true as const, launchStored: payload.launchNotice };
  });
