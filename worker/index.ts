import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  ASSETS: AssetFetcher;
  DB?: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: {
          format: string;
          quality: number;
        }): Promise<{ response(): Response }>;
      };
    };
  };
  EBAY_CLIENT_ID?: string;
  EBAY_CLIENT_SECRET?: string;
  EBAY_ENVIRONMENT?: string;
  EBAY_MARKETPLACE_ID?: string;
  EBAY_AFFILIATE_CAMPAIGN_ID?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface EbayMoney {
  value?: string;
  currency?: string;
}

interface EbayItemSummary {
  itemId?: string;
  title?: string;
  image?: {
    imageUrl?: string;
  };
  price?: EbayMoney;
  condition?: string;
  itemWebUrl?: string;
  itemAffiliateWebUrl?: string;
  buyingOptions?: string[];
  shippingOptions?: Array<{
    shippingCost?: EbayMoney;
  }>;
}

interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
}

interface EbayTokenResponse {
  access_token?: string;
  expires_in?: number;
}

interface NewsletterRequest {
  email?: unknown;
  company?: unknown;
}

interface ProductAlertRequest extends NewsletterRequest {
  product?: unknown;
}

const EBAY_PRODUCTS = {
  "kaptain-sunshine-traveller-coat": {
    brand: "Kaptain Sunshine",
    item: "Traveller Coat",
    query: "Kaptain Sunshine Traveller Coat Navy",
    requiredTitleTermGroups: [
      ["kaptain sunshine"],
      ["traveller", "traveler"],
      ["coat"],
    ],
  },
  "camiel-fortgens-big-shirt": {
    brand: "Camiel Fortgens",
    item: "Big Shirt",
    query: "Camiel Fortgens Big Shirt Blockprint",
    requiredTitleTermGroups: [["camiel fortgens"], ["big shirt"]],
  },
  "beams-plus-shawl-cardigan": {
    brand: "BEAMS PLUS",
    item: "Shawl Collar Cardigan",
    query: "BEAMS PLUS Shawl Collar Cardigan",
    requiredTitleTermGroups: [["beams plus", "beams+"], ["shawl"], ["cardigan"]],
  },
  "prada-sky-cotton-shirt": {
    brand: "Prada",
    item: "Sky Cotton Shirt",
    query: "Prada UCN596 10IV F0AB7 Cotton Shirt",
    requiredTitleTermGroups: [["prada"], ["ucn596", "f0ab7"]],
  },
  "sunspel-riviera-long-sleeve": {
    brand: "Sunspel",
    item: "Long Sleeve Riviera",
    query: "Sunspel Long Sleeve Riviera Polo Black",
    requiredTitleTermGroups: [["sunspel"], ["riviera"], ["long sleeve"]],
  },
  "our-legacy-third-cut": {
    brand: "Our Legacy",
    item: "Third Cut",
    query: "Our Legacy Third Cut Black Selvedge Jeans",
    requiredTitleTermGroups: [["our legacy"], ["third cut"]],
  },
  "anonymous-ism-waffle-sock": {
    brand: "Anonymous Ism",
    item: "Waffle Crew Sock",
    query: "Anonymous Ism Waffle Crew Socks",
    requiredTitleTermGroups: [
      ["anonymous ism", "anonymousism"],
      ["waffle"],
      ["sock", "socks"],
    ],
  },
  "hender-scheme-mip-22": {
    brand: "Hender Scheme",
    item: "Manual Industrial Product 22",
    query: "Hender Scheme MIP 22 Natural Leather",
    requiredTitleTermGroups: [
      ["hender scheme"],
      ["mip 22", "manual industrial product 22"],
    ],
  },
} as const;

let ebayTokenCache:
  | {
      accessToken: string;
      credentialsKey: string;
      expiresAt: number;
    }
  | undefined;

function ebaySearchUrl(query: string): string {
  const url = new URL("https://www.ebay.com/sch/i.html");
  url.searchParams.set("_nkw", query);
  url.searchParams.set("_sacat", "0");
  url.searchParams.set("LH_ItemCondition", "3000");
  return url.toString();
}

function normalizeListingTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getEbayAccessToken(
  env: Env,
  environment: "production" | "sandbox"
): Promise<string> {
  const clientId = env.EBAY_CLIENT_ID;
  const clientSecret = env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("eBay credentials are not configured");
  }

  const credentialsKey = `${environment}:${clientId}`;
  if (
    ebayTokenCache?.credentialsKey === credentialsKey &&
    ebayTokenCache.expiresAt > Date.now()
  ) {
    return ebayTokenCache.accessToken;
  }

  const apiBase =
    environment === "sandbox"
      ? "https://api.sandbox.ebay.com"
      : "https://api.ebay.com";
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const tokenResponse = await fetch(`${apiBase}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`eBay token request failed (${tokenResponse.status})`);
  }

  const tokenData = (await tokenResponse.json()) as EbayTokenResponse;
  if (!tokenData.access_token) {
    throw new Error("eBay token response was incomplete");
  }

  const expiresIn = Math.max(tokenData.expires_in ?? 7200, 120);
  ebayTokenCache = {
    accessToken: tokenData.access_token,
    credentialsKey,
    expiresAt: Date.now() + (expiresIn - 60) * 1000,
  };

  return tokenData.access_token;
}

async function handleEbaySearch(request: Request, env: Env): Promise<Response> {
  const requestUrl = new URL(request.url);
  const productKey = requestUrl.searchParams.get("product");
  const product =
    productKey && productKey in EBAY_PRODUCTS
      ? EBAY_PRODUCTS[productKey as keyof typeof EBAY_PRODUCTS]
      : undefined;

  if (!product) {
    return Response.json(
      { message: "Unknown product search." },
      { status: 400 }
    );
  }

  const searchUrl = ebaySearchUrl(product.query);
  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) {
    return Response.json(
      {
        configured: false,
        listings: [],
        matchType: "none",
        message: "Live eBay matches are ready to connect.",
        searchUrl,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    const environment =
      env.EBAY_ENVIRONMENT?.toLowerCase() === "sandbox"
        ? "sandbox"
        : "production";
    const apiBase =
      environment === "sandbox"
        ? "https://api.sandbox.ebay.com"
        : "https://api.ebay.com";
    const accessToken = await getEbayAccessToken(env, environment);
    const marketplaceId = env.EBAY_MARKETPLACE_ID || "EBAY_US";
    const browseUrl = new URL(
      `${apiBase}/buy/browse/v1/item_summary/search`
    );
    browseUrl.searchParams.set("q", product.query);
    browseUrl.searchParams.set("limit", "12");
    browseUrl.searchParams.set("filter", "conditions:{USED}");

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-EBAY-C-MARKETPLACE-ID": marketplaceId,
    };

    if (env.EBAY_AFFILIATE_CAMPAIGN_ID) {
      headers["X-EBAY-C-ENDUSERCTX"] =
        `affiliateCampaignId=${encodeURIComponent(
          env.EBAY_AFFILIATE_CAMPAIGN_ID
        )},affiliateReferenceId=in-other-news-uniform-01`;
    }

    const browseResponse = await fetch(browseUrl, { headers });
    if (!browseResponse.ok) {
      throw new Error(`eBay browse request failed (${browseResponse.status})`);
    }

    const browseData = (await browseResponse.json()) as EbaySearchResponse;
    const usableListings = (browseData.itemSummaries ?? []).filter(
      (item) =>
        item.itemId &&
        item.title &&
        item.price?.value &&
        item.price.currency &&
        (item.itemAffiliateWebUrl || item.itemWebUrl)
    );
    const exactListings = usableListings.filter((item) => {
      const title = normalizeListingTitle(item.title ?? "");
      return product.requiredTitleTermGroups.every((termGroup) =>
        termGroup.some((term) => title.includes(normalizeListingTitle(term)))
      );
    });
    const matchedListings =
      exactListings.length > 0 ? exactListings : usableListings;
    const listings = matchedListings.slice(0, 3).map((item) => {
      const shippingCost = item.shippingOptions?.[0]?.shippingCost;
      return {
        id: item.itemId,
        title: item.title,
        imageUrl: item.image?.imageUrl ?? null,
        price: item.price?.value,
        currency: item.price?.currency,
        condition: item.condition ?? "Pre-owned",
        shippingPrice: shippingCost?.value ?? null,
        shippingCurrency: shippingCost?.currency ?? null,
        buyingOptions: item.buyingOptions ?? [],
        url: item.itemAffiliateWebUrl || item.itemWebUrl,
      };
    });

    return Response.json(
      {
        configured: true,
        listings,
        matchType:
          listings.length === 0
            ? "none"
            : exactListings.length > 0
              ? "exact"
              : "similar",
        message:
          listings.length === 0
            ? "No used listings are available right now."
            : null,
        searchUrl,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300",
        },
      }
    );
  } catch {
    return Response.json(
      {
        configured: true,
        listings: [],
        matchType: "none",
        message: "Live eBay results are temporarily unavailable.",
        searchUrl,
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email: string): boolean {
  return (
    email.length > 3 &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function isResendConfigured(env: Env): boolean {
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);
}

async function syncNewsletterContact(env: Env, email: string): Promise<boolean> {
  if (!isResendConfigured(env)) return false;

  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
    "User-Agent": "in-other-news/1.0",
  };
  let response = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers,
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (response.status === 409) {
    response = await fetch(
      `https://api.resend.com/contacts/${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ unsubscribed: false }),
      }
    );
  }

  if (!response.ok) {
    throw new Error(`Resend contact request failed (${response.status})`);
  }

  return true;
}

function productWatchEmailHtml(
  brand: string,
  item: string,
  siteUrl: string
): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f3f3f0;color:#111;font-family:Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px">
      <p style="margin:0 0 48px;font-size:11px;letter-spacing:.12em;text-transform:uppercase">In Other News · Uniform 01</p>
      <p style="margin:0 0 10px;color:#777;font-size:10px;letter-spacing:.12em;text-transform:uppercase">Product watch saved</p>
      <h1 style="margin:0;font-size:30px;line-height:1.08;font-weight:500">${brand}<br>${item}</h1>
      <p style="margin:24px 0 0;font-size:14px;line-height:1.65">Your watch is ready. We’ll use it for new pre-owned matches and meaningful retail price drops as alert delivery comes online.</p>
      <p style="margin:32px 0 0"><a href="${siteUrl}" style="display:inline-block;background:#111;color:#fff;padding:13px 18px;font-size:11px;letter-spacing:.1em;text-decoration:none;text-transform:uppercase">Return to Uniform 01 →</a></p>
      <p style="margin:56px 0 0;color:#777;font-size:10px;line-height:1.6">You requested this product watch from In Other News.</p>
    </div>
  </body>
</html>`;
}

async function sendProductWatchConfirmation(
  env: Env,
  email: string,
  productKey: string,
  product: { brand: string; item: string },
  siteUrl: string
): Promise<boolean> {
  if (!isResendConfigured(env)) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `uniform-01-watch-${productKey}-${email}`.slice(0, 256),
      "User-Agent": "in-other-news/1.0",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [email],
      subject: `Watch saved: ${product.brand} ${product.item}`,
      html: productWatchEmailHtml(product.brand, product.item, siteUrl),
      text: `Your watch for ${product.brand} ${product.item} is saved. Return to Uniform 01: ${siteUrl}`,
      tags: [
        { name: "message_type", value: "product_watch" },
        { name: "issue", value: "uniform_01" },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend email request failed (${response.status})`);
  }

  return true;
}

async function handleNewsletterSubscribe(
  request: Request,
  env: Env
): Promise<Response> {
  if (!env.DB) {
    return Response.json(
      { message: "Newsletter signup is temporarily unavailable." },
      { status: 503 }
    );
  }

  let body: NewsletterRequest;
  try {
    body = (await request.json()) as NewsletterRequest;
  } catch {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  // Bots commonly fill hidden fields. Return success without saving the entry.
  if (typeof body.company === "string" && body.company.trim()) {
    return Response.json({ ok: true, message: "You're subscribed." });
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await env.DB.prepare(
      `INSERT INTO newsletter_subscribers (email, source)
       VALUES (?1, ?2)
       ON CONFLICT(email) DO NOTHING`
    )
      .bind(email, "uniform-01")
      .run();

    let contactSynced = false;
    try {
      contactSynced = await syncNewsletterContact(env, email);
    } catch {
      // The local subscriber record remains authoritative if Resend is offline.
    }

    return Response.json(
      {
        ok: true,
        message: contactSynced
          ? "Subscribed. Uniform 02 lands Sunday."
          : "Subscribed. Email delivery activates after domain setup.",
        emailConnected: contactSynced,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { message: "We couldn't save your email. Try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

async function handleProductAlert(
  request: Request,
  env: Env
): Promise<Response> {
  if (!env.DB) {
    return Response.json(
      { message: "Product watches are temporarily unavailable." },
      { status: 503 }
    );
  }

  let body: ProductAlertRequest;
  try {
    body = (await request.json()) as ProductAlertRequest;
  } catch {
    return Response.json(
      { message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return Response.json({ ok: true, message: "Watch saved." });
  }

  const email = normalizeEmail(body.email);
  const productKey = typeof body.product === "string" ? body.product : "";
  const product =
    productKey && productKey in EBAY_PRODUCTS
      ? EBAY_PRODUCTS[productKey as keyof typeof EBAY_PRODUCTS]
      : undefined;

  if (!isValidEmail(email)) {
    return Response.json(
      { message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (!product) {
    return Response.json({ message: "Choose a valid product." }, { status: 400 });
  }

  try {
    await env.DB.prepare(
      `INSERT INTO product_alerts
         (email, product_key, brand, item, issue, active)
       VALUES (?1, ?2, ?3, ?4, ?5, 1)
       ON CONFLICT(email, product_key) DO UPDATE SET active = 1`
    )
      .bind(email, productKey, product.brand, product.item, "01")
      .run();

    let confirmationSent = false;
    try {
      confirmationSent = await sendProductWatchConfirmation(
        env,
        email,
        productKey,
        product,
        new URL(request.url).origin
      );
    } catch {
      // The watch remains saved when the external email service is unavailable.
    }

    return Response.json(
      {
        ok: true,
        message: confirmationSent
          ? "Watch saved. Check your inbox for confirmation."
          : "Watch saved. Email activates after domain setup.",
        emailConnected: confirmationSent,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { message: "We couldn't save this watch. Try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/api/ebay/search" && request.method === "GET") {
      return handleEbaySearch(request, env);
    }

    if (
      url.pathname === "/api/newsletter/subscribe" &&
      request.method === "POST"
    ) {
      return handleNewsletterSubscribe(request, env);
    }

    if (
      url.pathname === "/api/product-alerts" &&
      request.method === "POST"
    ) {
      return handleProductAlert(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(
        request,
        {
          fetchAsset: (path) =>
            env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          },
        },
        allowedWidths
      );
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
