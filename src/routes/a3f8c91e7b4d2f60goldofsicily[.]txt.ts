import { createFileRoute } from "@tanstack/react-router";
import { INDEXNOW_KEY } from "@/lib/indexnow";

export const Route = createFileRoute("/a3f8c91e7b4d2f60goldofsicily.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(INDEXNOW_KEY, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=86400",
          },
        }),
    },
  },
});
