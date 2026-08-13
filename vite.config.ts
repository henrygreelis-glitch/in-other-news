import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

export default defineConfig(async ({ command }) => {
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const { cloudflare } = await import("@cloudflare/vite-plugin");

  // The deploy target provisions D1 and binds it as `DB` (see .openai/hosting.json),
  // so the binding is declared for local dev only. Miniflare backs it with a
  // SQLite file under .wrangler and ignores the database_id.
  const devD1Bindings =
    command === "serve"
      ? {
          d1_databases: [
            {
              binding: "DB",
              database_name: "in-other-news",
              database_id: "local-in-other-news",
              migrations_dir: "./drizzle",
            },
          ],
        }
      : {};

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
          ...devD1Bindings,
        },
      }),
    ],
  };
});
