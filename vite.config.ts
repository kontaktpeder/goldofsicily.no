// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [
    {
      name: "ssr-create-middleware-import",
      apply: "serve",
      transform(code, id) {
        if (this.environment?.name !== "ssr") return;
        const file = id.split("?")[0];
        if (
          !file.endsWith("/src/start.ts") &&
          !file.endsWith("/src/integrations/supabase/auth-middleware.ts") &&
          !file.endsWith("/src/integrations/supabase/auth-attacher.ts")
        ) {
          return;
        }
        // Vite's dev SSR runner evaluates @tanstack/react-start before its
        // re-exported createMiddleware is ready. The function itself lives in
        // start-client-core and is safe to call. The client keeps the original
        // import so the browser bundle does not pull in server-only code.
        return code
          .replaceAll("from '@tanstack/react-start'", 'from "@tanstack/start-client-core"')
          .replaceAll('from "@tanstack/react-start"', 'from "@tanstack/start-client-core"');
      },
    },
  ],
});
