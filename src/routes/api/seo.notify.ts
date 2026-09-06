import { createFileRoute } from "@tanstack/react-router";
import { submitIndexNow } from "@/lib/indexnow";
import {
  isSeoNotifyAuthorized,
  parseSeoNotifyBody,
  urlsForSeoNotify,
} from "@/lib/seo-notify";

export const Route = createFileRoute("/api/seo/notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSeoNotifyAuthorized(request)) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        let raw: unknown = {};
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }

        const body = parseSeoNotifyBody(raw);
        const urls = urlsForSeoNotify(body);
        if (urls.length === 0) {
          return Response.json({ ok: true, skipped: true, urls: [] });
        }

        try {
          const indexNow = await submitIndexNow(urls);
          return Response.json({
            ok: indexNow.ok,
            skipped: indexNow.skipped,
            published: body.published,
            urls,
            indexNow,
          });
        } catch {
          return Response.json({ ok: false, urls }, { status: 502 });
        }
      },
    },
  },
});
