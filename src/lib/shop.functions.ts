import { createServerFn } from "@tanstack/react-start";
import { parseWaitlist } from "@/lib/shop-catalog";
import { postWaitlist } from "@/lib/shop";

export const submitShopWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = parseWaitlist(input);
    if (!parsed) throw new Error("invalid");
    return parsed;
  })
  .handler(async ({ data }) => {
    const result = await postWaitlist(data);
    if (result !== "ok") throw new Error(result);
    return { ok: true as const };
  });
