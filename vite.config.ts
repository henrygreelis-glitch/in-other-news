import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

export default defineConfig(async ({ command }) => {
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const { cloudflare } = await import("@cloudflare/vite-plugin");

  // Dev runs against a Miniflare-backed SQLite file under .wrangler and ignores
  // the id; builds deploy against the real database.
  const d1Bindings = {
    d1_databases: [
      {
        binding: "DB",
        database_name: "in-other-news",
        database_id:
          command === "serve"
            ? "local-in-other-news"
            : "6b25a3a5-a9ca-44f7-9047-6b7d317000b6",
        migrations_dir: "./drizzle",
      },
    ],
  };

  // Cloudflare creates and manages the DNS records for these custom domains.
  const routes =
    command === "serve"
      ? {}
      : {
          routes: [
            { pattern: "inothernews.co", custom_domain: true },
            { pattern: "www.inothernews.co", custom_domain: true },
          ],
        };

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: {
          main: "./worker/index.ts",
          compatibility_flags: ["nodejs_compat"],
          ...d1Bindings,
          ...routes,
          // worker/index.ts uses env.IMAGES for on-demand transforms and
          // env.ASSETS to read the original file before transforming it.
          images: { binding: "IMAGES" },
          assets: { binding: "ASSETS" },
        },
      }),
    ],
  };
});
