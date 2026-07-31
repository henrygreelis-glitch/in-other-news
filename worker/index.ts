import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcher;
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

const EBAY_PRODUCTS = {
  "kaptain-sunshine-traveller-coat": {
    query: "Kaptain Sunshine Traveller Coat Navy",
    requiredTitleTermGroups: [
      ["kaptain sunshine"],
      ["traveller", "traveler"],
      ["coat"],
    ],
  },
  "camiel-fortgens-big-shirt": {
    query: "Camiel Fortgens Big Shirt Blockprint",
    requiredTitleTermGroups: [["camiel fortgens"], ["big shirt"]],
  },
  "beams-plus-shawl-cardigan": {
    query: "BEAMS PLUS Shawl Collar Cardigan",
    requiredTitleTermGroups: [["beams plus", "beams+"], ["shawl"], ["cardigan"]],
  },
  "prada-sky-cotton-shirt": {
    query: "Prada UCN596 10IV F0AB7 Cotton Shirt",
    requiredTitleTermGroups: [["prada"], ["ucn596", "f0ab7"]],
  },
  "sunspel-riviera-long-sleeve": {
    query: "Sunspel Long Sleeve Riviera Polo Black",
    requiredTitleTermGroups: [["sunspel"], ["riviera"], ["long sleeve"]],
  },
  "our-legacy-third-cut": {
    query: "Our Legacy Third Cut Black Selvedge Jeans",
    requiredTitleTermGroups: [["our legacy"], ["third cut"]],
  },
  "anonymous-ism-waffle-sock": {
    query: "Anonymous Ism Waffle Crew Socks",
    requiredTitleTermGroups: [
      ["anonymous ism", "anonymousism"],
      ["waffle"],
      ["sock", "socks"],
    ],
  },
  "hender-scheme-mip-22": {
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

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/api/ebay/search" && request.method === "GET") {
      return handleEbaySearch(request, env);
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
