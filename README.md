# In Other News

![In Other News — Issue 01, The uniform for the first cold week](public/og-issue-01.png)

Personal site and portfolio for Henry Greelis — positioning, product stories, and editorial ideas — built around *In Other News*, a menswear editorial that turns each issue's featured garments into live, shoppable listings.

Running on Next.js 16 App Router (React 19 Server Components) deployed to Cloudflare Workers.

## What's interesting here

- **RSC on Cloudflare Workers.** The app runs the Next.js App Router at the edge via [`vinext`](https://www.npmjs.com/package/vinext) and `@vitejs/plugin-rsc` rather than Vercel's runtime — server components, streaming, and image optimization all inside a Worker.
- **Editorial → commerce pipeline.** Garments featured in an issue are matched against live eBay Browse API listings, deduplicated by photo, and ranked so a reader can buy the piece (or a close alternative) from the article itself.
- **AI query refinement.** Free-text searches are rewritten into structured marketplace queries before hitting eBay, which is what makes "shawl cardigan, not too boxy" return usable results.
- **Image optimization at the edge.** Product photography is transformed and re-encoded through Cloudflare Images on request, with WebP cutouts served for composite layouts.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 App Router, React 19 (RSC) |
| Build | Vite 8, `vinext`, `@vitejs/plugin-rsc` |
| Runtime | Cloudflare Workers (`wrangler`) |
| Database | Cloudflare D1 + Drizzle ORM |
| Email | Resend |
| Commerce data | eBay Browse API |
| AI | OpenAI Responses API |
| Language | TypeScript |

## Routes

Application pages live in `app/`; the Worker in `worker/index.ts` handles the API surface before delegating to the App Router.

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/ebay/search` | GET | Marketplace listing search |
| `/api/ai/refine` | POST | Rewrite a free-text query into structured search terms |
| `/api/newsletter/subscribe` | POST | Newsletter signup |
| `/api/product-alerts` | POST | Register a price/availability alert |
| `/_vinext/image` | GET | On-demand image optimization |

## Running locally

Requires Node >= 22.13.0.

```bash
npm install
cp .env.example .env.local   # then fill in your own keys
npm run dev
```

Every key in `.env.example` is optional — the app degrades gracefully. Without `OPENAI_API_KEY` search falls back to the raw query; without eBay credentials listing sections render empty.

### Other scripts

```bash
npm run build        # production build
npm run start        # serve the production build
npm run db:generate  # generate Drizzle migrations from db/schema.ts
npm run email:test   # send a test email through Resend
```

## Layout

```
app/          App Router pages (home, about, search, writing, in-other-news)
worker/       Cloudflare Worker entry — API routes, eBay + OpenAI integration
db/           Drizzle schema (newsletter subscribers, product alerts)
drizzle/      Generated SQL migrations
build/        Custom Vite plugin for multi-site builds
scripts/      Operational scripts
public/       Static assets and product photography
```

## License

No license granted. All rights reserved.
