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
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
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
  seller?: {
    username?: string;
    feedbackPercentage?: string;
    feedbackScore?: number;
  };
  shippingOptions?: Array<{
    shippingCost?: EbayMoney;
  }>;
}

interface EbayItemDetail extends EbayItemSummary {
  additionalImages?: Array<{
    imageUrl?: string;
  }>;
  localizedAspects?: Array<{
    name?: string;
    value?: string;
  }>;
  itemLocation?: {
    city?: string;
    stateOrProvince?: string;
    country?: string;
  };
  estimatedAvailabilities?: Array<{
    estimatedAvailabilityStatus?: string;
    estimatedAvailableQuantity?: number;
  }>;
  returnTerms?: {
    returnsAccepted?: boolean;
  };
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

interface AiRefineRequest {
  product?: unknown;
  request?: unknown;
  company?: unknown;
}

interface AiRefinement {
  title: string;
  summary: string;
  ebayQuery: string;
  retailQuery: string;
  signals: string[];
}

interface OpenAiResponse {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
}

const EBAY_PRODUCTS = {
  "kaptain-sunshine-traveller-coat": {
    brand: "Kaptain Sunshine",
    item: "Traveller Coat",
    query: "Kaptain Sunshine coat navy",
    requiredTitleTermGroups: [
      ["kaptain sunshine"],
      ["traveller", "traveler"],
      ["coat"],
    ],
    categoryTitleTerms: ["coat", "overcoat", "parka"],
  },
  "camiel-fortgens-big-shirt": {
    brand: "Camiel Fortgens",
    item: "Big Shirt",
    query: "Camiel Fortgens Big Shirt Blockprint",
    requiredTitleTermGroups: [["camiel fortgens"], ["big shirt"]],
    categoryTitleTerms: ["shirt", "overshirt"],
  },
  "ernest-w-baker-crocodile-bomber": {
    brand: "Ernest W. Baker",
    item: "80's Crocodile Leather Bomber",
    query: "Ernest W. Baker leather jacket",
    requiredTitleTermGroups: [
      ["ernest w baker", "ernest w. baker"],
      ["crocodile", "croc"],
      ["bomber"],
    ],
    categoryTitleTerms: ["jacket", "bomber", "blouson", "leather"],
  },
  "beams-plus-shawl-cardigan": {
    brand: "BEAMS PLUS",
    item: "Shawl Collar Cardigan",
    query: "BEAMS PLUS Shawl Collar Cardigan",
    requiredTitleTermGroups: [["beams plus", "beams+"], ["shawl"], ["cardigan"]],
    categoryTitleTerms: ["cardigan", "sweater", "knit"],
  },
  "brooks-brothers-cashmere-v-neck": {
    brand: "Brooks Brothers",
    item: "3-Ply Cashmere V-Neck Sweater",
    query: "Brooks Brothers cashmere v neck sweater black",
    requiredTitleTermGroups: [
      ["brooks brothers"],
      ["3 ply", "3-ply"],
      ["cashmere"],
      ["v neck", "v-neck"],
      ["black", "ms01260"],
    ],
    categoryTitleTerms: ["sweater", "jumper", "cashmere", "knit"],
  },
  "prada-sky-cotton-shirt": {
    brand: "Prada",
    item: "Sky Cotton Shirt",
    query: "Prada cotton shirt blue",
    requiredTitleTermGroups: [["prada"], ["ucn596", "f0ab7"]],
    categoryTitleTerms: ["shirt", "button up", "button down"],
  },
  "sunspel-riviera-long-sleeve": {
    brand: "Sunspel",
    item: "Long Sleeve Riviera",
    query: "Sunspel long sleeve polo black",
    requiredTitleTermGroups: [["sunspel"], ["riviera"], ["long sleeve"]],
    categoryTitleTerms: ["polo", "shirt", "top"],
  },
  "our-legacy-third-cut": {
    brand: "Our Legacy",
    item: "Third Cut",
    query: "Our Legacy Third Cut Black Selvedge Jeans",
    requiredTitleTermGroups: [["our legacy"], ["third cut"]],
    categoryTitleTerms: ["jean", "denim", "trouser", "pant"],
  },
  "rick-owens-geth-jeans": {
    brand: "Rick Owens",
    item: "Geth Jeans",
    query: "Rick Owens denim",
    requiredTitleTermGroups: [["rick owens"], ["geth"], ["jeans", "trousers"]],
    categoryTitleTerms: ["jean", "denim", "trouser", "pant"],
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
    categoryTitleTerms: ["sock"],
  },
  "fgs-originals-waffle-crew-socks-m-gray": {
    brand: "FGS Originals",
    item: "Waffle Crew Socks / M.Gray",
    query: "Front General Store socks",
    requiredTitleTermGroups: [
      ["fgs", "front general store"],
      ["waffle"],
      ["sock", "socks"],
    ],
    categoryTitleTerms: ["sock"],
  },
  "kiko-kostadinov-farkas-boots": {
    brand: "Kiko Kostadinov",
    item: "Black Farkas Boots",
    query: "Kiko Kostadinov black boots shoes",
    requiredTitleTermGroups: [
      ["kiko kostadinov"],
      ["farkas"],
      ["boot", "boots"],
    ],
    categoryTitleTerms: ["boot", "shoe"],
  },
} as const;

type EbayProduct = (typeof EBAY_PRODUCTS)[keyof typeof EBAY_PRODUCTS];

const EBAY_SEARCH_CANDIDATE_LIMIT = 100;
const EBAY_LIVE_LISTING_LIMIT = 24;

let ebayTokenCache:
  | {
      accessToken: string;
      credentialsKey: string;
      expiresAt: number;
    }
  | undefined;

const aiRateLimits = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

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
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleHasAny(title: string, terms: readonly string[]): boolean {
  return terms.some((term) => title.includes(normalizeListingTitle(term)));
}

function scoreEbayListing(
  item: EbayItemSummary,
  product: EbayProduct
): { score: number; exact: boolean } | null {
  const title = normalizeListingTitle(item.title ?? "");
  if (!title || /\b(poster|magazine|catalog|sticker|keychain|hanger)\b/.test(title)) {
    return null;
  }

  const brandMatches = titleHasAny(
    title,
    product.requiredTitleTermGroups[0]
  );
  const categoryMatches = titleHasAny(title, product.categoryTitleTerms);
  if (!brandMatches || !categoryMatches) return null;

  const matchedGroups = product.requiredTitleTermGroups.filter((termGroup) =>
    titleHasAny(title, termGroup)
  ).length;
  const exact = matchedGroups === product.requiredTitleTermGroups.length;
  const feedback = Number(item.seller?.feedbackPercentage ?? 0);
  const score =
    40 +
    15 +
    Math.round((matchedGroups / product.requiredTitleTermGroups.length) * 30) +
    (item.image?.imageUrl ? 8 : 0) +
    (item.price?.value ? 4 : 0) +
    (feedback >= 95 ? 3 : 0);

  return score >= 70 ? { score, exact } : null;
}

function upgradeEbayImageUrl(imageUrl: string | undefined): string | null {
  if (!imageUrl) return null;
  return imageUrl.replace(/s-l\d+(?=\.(?:jpg|jpeg|png|webp))/i, "s-l1600");
}

function ebayItemSize(item: EbayItemDetail): string | null {
  const values = (item.localizedAspects ?? [])
    .filter((aspect) =>
      /^(size|shoe size|waist size|inseam|size type)$/i.test(aspect.name ?? "")
    )
    .map((aspect) => compactText(aspect.value, 40))
    .filter(
      (value) =>
        Boolean(value) && !/^(?:n\/?a|not applicable|does not apply)$/i.test(value)
    );
  return [...new Set(values)].slice(0, 3).join(" · ") || null;
}

function ebaySeller(item: EbayItemDetail): string | null {
  const username = compactText(item.seller?.username, 48);
  const feedback = compactText(item.seller?.feedbackPercentage, 8);
  if (!username) return null;
  return feedback ? `${username} · ${feedback}% positive` : username;
}

function ebayLocation(item: EbayItemDetail): string | null {
  return [
    item.itemLocation?.city,
    item.itemLocation?.stateOrProvince,
    item.itemLocation?.country,
  ]
    .map((part) => compactText(part, 40))
    .filter(Boolean)
    .join(", ") || null;
}

async function enrichEbayListing(
  item: EbayItemSummary,
  apiBase: string,
  headers: Record<string, string>,
  matchType: "exact" | "similar"
) {
  let detail: EbayItemDetail = item;
  try {
    const response = await fetch(
      `${apiBase}/buy/browse/v1/item/${encodeURIComponent(item.itemId ?? "")}`,
      { headers }
    );
    if (response.ok) detail = (await response.json()) as EbayItemDetail;
  } catch {
    // Search-summary data remains a safe fallback when one detail call fails.
  }

  const shippingCost = detail.shippingOptions?.[0]?.shippingCost;
  const imageUrls = [detail.image, ...(detail.additionalImages ?? [])]
    .map((image) => upgradeEbayImageUrl(image?.imageUrl))
    .filter((image): image is string => Boolean(image));
  const uniqueImages = [...new Set(imageUrls)].slice(0, 8);

  return {
    id: detail.itemId ?? item.itemId,
    title: detail.title ?? item.title,
    imageUrl: uniqueImages[0] ?? upgradeEbayImageUrl(item.image?.imageUrl),
    imageUrls: uniqueImages,
    price: detail.price?.value ?? item.price?.value,
    currency: detail.price?.currency ?? item.price?.currency,
    condition: detail.condition ?? item.condition ?? "Pre-owned",
    shippingPrice: shippingCost?.value ?? null,
    shippingCurrency: shippingCost?.currency ?? null,
    buyingOptions: detail.buyingOptions ?? item.buyingOptions ?? [],
    matchType,
    size: ebayItemSize(detail),
    seller: ebaySeller(detail),
    location: ebayLocation(detail),
    returns: detail.returnTerms?.returnsAccepted === true
      ? "Returns accepted"
      : detail.returnTerms?.returnsAccepted === false
        ? "Final sale"
        : null,
    availability:
      detail.estimatedAvailabilities?.[0]?.estimatedAvailabilityStatus ===
      "OUT_OF_STOCK"
        ? "Unavailable"
        : "Available",
    url:
      detail.itemAffiliateWebUrl ||
      detail.itemWebUrl ||
      item.itemAffiliateWebUrl ||
      item.itemWebUrl,
  };
}

function compactText(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function extractBudget(request: string): number | undefined {
  const match = request.match(
    /(?:under|below|less than|max(?:imum)?(?: of)?)\s*\$?\s*([0-9][0-9,]*)/i
  );
  if (!match) return undefined;

  const amount = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(amount) && amount >= 20 && amount <= 100000
    ? amount
    : undefined;
}

function retailSearchUrl(query: string): string {
  const url = new URL("https://www.google.com/search");
  url.searchParams.set("tbm", "shop");
  url.searchParams.set("q", query);
  return url.toString();
}

function resaleSearchUrl(query: string): string {
  const url = new URL("https://www.grailed.com/shop");
  url.searchParams.set("query", query);
  return url.toString();
}

function fallbackAiRefinement(
  product: { brand: string; item: string; query: string },
  shopperRequest: string
): AiRefinement {
  const request = shopperRequest.toLowerCase();
  const wantsExact = /exact|same piece|same version/.test(request);
  const wantsDifferentBrand = /different brand|similar|alternative|look.?alike/.test(
    request
  );
  const wantsQuieter = /less statement|quieter|minimal|more subtle/.test(request);
  const coreProduct = wantsDifferentBrand || wantsQuieter
    ? product.item
    : `${product.brand} ${product.item}`;
  let searchRequest = shopperRequest
    .replace(/\bsame\s+(idea|shape|coat|jacket|piece|item)\b/gi, "")
    .replace(/\bfind\s+it\s+used\b/gi, "")
    .replace(
      /(?:under|below|less than|max(?:imum)?(?: of)?)\s*\$?\s*[0-9][0-9,]*/gi,
      ""
    )
    .replace(/\b(show|find|search|look)\s+(me|for)\b/gi, "")
    .replace(/\b(something|options?|versions?|pieces?)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (wantsQuieter) {
    searchRequest = searchRequest.replace(
      /\b(less statement|quieter|more subtle)\b/gi,
      "minimal"
    );
  }
  if (/^different color$/i.test(searchRequest)) searchRequest = "";
  const query = `${coreProduct} ${searchRequest}`.trim();

  return {
    title: wantsExact ? "The exact piece, narrowed" : "A version closer to you",
    summary: `Searching beyond this week’s edit for ${
      searchRequest ||
      (extractBudget(shopperRequest)
        ? `a version under $${extractBudget(shopperRequest)}`
        : "a more specific version")
    }.`,
    ebayQuery: query || product.query,
    retailQuery: query || product.query,
    signals: [
      wantsDifferentBrand ? "Similar silhouette" : "Original product context",
      extractBudget(shopperRequest) ? "Within your stated budget" : "Flexible price",
      "Live availability varies",
    ],
  };
}

function readOpenAiText(data: OpenAiResponse): string {
  if (typeof data.output_text === "string") return data.output_text;

  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

function normalizeRefinement(
  value: unknown,
  fallback: AiRefinement
): AiRefinement {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<AiRefinement>;
  const signals = Array.isArray(candidate.signals)
    ? candidate.signals
        .map((signal) => compactText(signal, 48))
        .filter(Boolean)
        .slice(0, 3)
    : fallback.signals;

  return {
    title: compactText(candidate.title, 72) || fallback.title,
    summary: compactText(candidate.summary, 220) || fallback.summary,
    ebayQuery: compactText(candidate.ebayQuery, 160) || fallback.ebayQuery,
    retailQuery:
      compactText(candidate.retailQuery, 160) || fallback.retailQuery,
    signals: signals.length ? signals : fallback.signals,
  };
}

async function safetyIdentifier(request: Request): Promise<string> {
  const source =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    request.headers.get("User-Agent") ||
    "anonymous";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(source)
  );
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `visitor_${hash.slice(0, 32)}`;
}

function exceedsAiRateLimit(identifier: string): boolean {
  const now = Date.now();
  const existing = aiRateLimits.get(identifier);
  if (!existing || existing.resetAt <= now) {
    aiRateLimits.set(identifier, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }

  existing.count += 1;
  return existing.count > 12;
}

async function createAiRefinement(
  request: Request,
  env: Env,
  product: { brand: string; item: string; query: string },
  shopperRequest: string
): Promise<{ refinement: AiRefinement; mode: "ai" | "guided" }> {
  const fallback = fallbackAiRefinement(product, shopperRequest);
  if (!env.OPENAI_API_KEY) {
    return { refinement: fallback, mode: "guided" };
  }

  try {
    const identifier = await safetyIdentifier(request);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "in-other-news/1.0",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5.6-terra",
        store: false,
        reasoning: { effort: "low" },
        max_output_tokens: 500,
        safety_identifier: identifier,
        instructions:
          "You refine fashion shopping searches for In Other News. Preserve the current product category unless the shopper explicitly changes it. Favor useful leeway over exact-only matching. Translate the request into concise retail and pre-owned search queries. Do not invent products, prices, availability, or links. Return only the requested JSON.",
        input: `Current product: ${product.brand} ${product.item}. Existing search: ${product.query}. Shopper request: ${shopperRequest}`,
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "shopping_refinement",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                ebayQuery: { type: "string" },
                retailQuery: { type: "string" },
                signals: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 2,
                  maxItems: 3,
                },
              },
              required: [
                "title",
                "summary",
                "ebayQuery",
                "retailQuery",
                "signals",
              ],
            },
          },
        },
      }),
    });

    if (!response.ok) throw new Error("OpenAI request failed");
    const data = (await response.json()) as OpenAiResponse;
    const output = readOpenAiText(data);
    if (!output) throw new Error("OpenAI response was empty");

    return {
      refinement: normalizeRefinement(JSON.parse(output), fallback),
      mode: "ai",
    };
  } catch {
    return { refinement: fallback, mode: "guided" };
  }
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
    browseUrl.searchParams.set("limit", String(EBAY_SEARCH_CANDIDATE_LIMIT));
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
    const rankedListings = (browseData.itemSummaries ?? [])
      .filter(
        (item) =>
          item.itemId &&
          item.title &&
          item.price?.value &&
          item.price.currency &&
          (item.itemAffiliateWebUrl || item.itemWebUrl)
      )
      .map((item) => ({ item, quality: scoreEbayListing(item, product) }))
      .filter(
        (
          candidate
        ): candidate is {
          item: EbayItemSummary;
          quality: { score: number; exact: boolean };
        } => Boolean(candidate.quality)
      )
      .sort(
        (a, b) =>
          Number(b.quality.exact) - Number(a.quality.exact) ||
          b.quality.score - a.quality.score
      )
      .slice(0, EBAY_LIVE_LISTING_LIMIT);

    const listings = await Promise.all(
      rankedListings.map(({ item, quality }) =>
        enrichEbayListing(
          item,
          apiBase,
          headers,
          quality.exact ? "exact" : "similar"
        )
      )
    );
    const hasExactListing = listings.some(
      (listing) => listing.matchType === "exact"
    );

    return Response.json(
      {
        configured: true,
        listings,
        matchType:
          listings.length === 0
            ? "none"
            : hasExactListing
              ? "exact"
              : "similar",
        message:
          listings.length === 0
            ? "No strong used matches are available right now."
            : null,
        searchUrl,
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=3600, stale-while-revalidate=300",
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

async function searchEbayForQuery(
  env: Env,
  query: string,
  maxPrice?: number
): Promise<{
  configured: boolean;
  listings: Array<{
    id: string | undefined;
    title: string | undefined;
    imageUrl: string | null;
    price: string | undefined;
    currency: string | undefined;
    condition: string;
    shippingPrice: string | null;
    shippingCurrency: string | null;
    buyingOptions: string[];
    url: string | undefined;
  }>;
  message: string | null;
  searchUrl: string;
}> {
  const publicSearchUrl = new URL(ebaySearchUrl(query));
  if (maxPrice) publicSearchUrl.searchParams.set("_udhi", String(maxPrice));
  const searchUrl = publicSearchUrl.toString();

  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) {
    return {
      configured: false,
      listings: [],
      message: "Live pre-owned results are ready to connect.",
      searchUrl,
    };
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
    const browseUrl = new URL(`${apiBase}/buy/browse/v1/item_summary/search`);
    browseUrl.searchParams.set("q", query);
    browseUrl.searchParams.set("limit", "12");
    browseUrl.searchParams.set(
      "filter",
      maxPrice
        ? `conditions:{USED},price:[..${maxPrice}],priceCurrency:USD`
        : "conditions:{USED}"
    );

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-EBAY-C-MARKETPLACE-ID": marketplaceId,
    };
    if (env.EBAY_AFFILIATE_CAMPAIGN_ID) {
      headers["X-EBAY-C-ENDUSERCTX"] =
        `affiliateCampaignId=${encodeURIComponent(
          env.EBAY_AFFILIATE_CAMPAIGN_ID
        )},affiliateReferenceId=in-other-news-ai`;
    }

    const browseResponse = await fetch(browseUrl, { headers });
    if (!browseResponse.ok) {
      throw new Error(`eBay browse request failed (${browseResponse.status})`);
    }

    const browseData = (await browseResponse.json()) as EbaySearchResponse;
    const listings = (browseData.itemSummaries ?? [])
      .filter(
        (item) =>
          item.itemId &&
          item.title &&
          item.price?.value &&
          item.price.currency &&
          (item.itemAffiliateWebUrl || item.itemWebUrl)
      )
      .slice(0, 3)
      .map((item) => {
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

    return {
      configured: true,
      listings,
      message: listings.length
        ? null
        : "No matching pre-owned listings are available right now.",
      searchUrl,
    };
  } catch {
    return {
      configured: true,
      listings: [],
      message: "Live pre-owned results are temporarily unavailable.",
      searchUrl,
    };
  }
}

async function handleAiRefine(request: Request, env: Env): Promise<Response> {
  let body: AiRefineRequest;
  try {
    body = (await request.json()) as AiRefineRequest;
  } catch {
    return Response.json(
      { message: "Describe the version you want." },
      { status: 400 }
    );
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return Response.json({ ok: true, ignored: true });
  }

  const productKey = compactText(body.product, 100);
  const shopperRequest = compactText(body.request, 240);
  const product =
    productKey && productKey in EBAY_PRODUCTS
      ? EBAY_PRODUCTS[productKey as keyof typeof EBAY_PRODUCTS]
      : undefined;

  if (!product) {
    return Response.json(
      { message: "Choose a product before refining the search." },
      { status: 400 }
    );
  }
  if (shopperRequest.length < 3) {
    return Response.json(
      { message: "Add a little more detail to your search." },
      { status: 400 }
    );
  }

  const identifier = await safetyIdentifier(request);
  if (exceedsAiRateLimit(identifier)) {
    return Response.json(
      { message: "Search limit reached. Try again in about 10 minutes." },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  const { refinement, mode } = await createAiRefinement(
    request,
    env,
    product,
    shopperRequest
  );
  const maxPrice = extractBudget(shopperRequest);
  const ebay = await searchEbayForQuery(env, refinement.ebayQuery, maxPrice);

  return Response.json(
    {
      ok: true,
      mode,
      aiConfigured: Boolean(env.OPENAI_API_KEY),
      title: refinement.title,
      summary: refinement.summary,
      signals: refinement.signals,
      listings: ebay.listings,
      message: ebay.message,
      ebaySearchUrl: ebay.searchUrl,
      retailSearchUrl: retailSearchUrl(refinement.retailQuery),
      resaleSearchUrl: resaleSearchUrl(refinement.ebayQuery),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
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

    if (url.pathname === "/api/ai/refine" && request.method === "POST") {
      return handleAiRefine(request, env);
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
