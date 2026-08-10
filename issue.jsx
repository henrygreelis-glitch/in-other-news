"use client";

import React, { useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
      <rect width="1200" height="1500" fill="#eceae5"/>
      <path d="M380 505 505 420h190l125 85-62 158-75-28v430H517V635l-75 28z"
        fill="none" stroke="#77736c" stroke-width="9"/>
      <text x="600" y="1200" text-anchor="middle" fill="#77736c"
        font-family="Arial, sans-serif" font-size="34" letter-spacing="8">IMAGE UNAVAILABLE</text>
    </svg>
  `);

const MASTHEAD = {
  title: "IN OTHER NEWS",
  issue: "01",
  date: "09.08.26",
  eyebrow: "Early fall preview",
  theme: "The uniform for the first cold week",
  deck: "An early look at the first cold week: one coat, seven supporting pieces, and enough time to find the right versions pre-owned instead of buying the whole uniform new.",
};

export const USD_PRICE_NOTE =
  "All prices in USD. Foreign prices use ECB reference rates from Aug. 7, 2026 and are rounded.";

const ECB_EUR_REFERENCE_RATES = {
  EUR: 1,
  USD: 1.1535,
  JPY: 182.64,
  CZK: 24.261,
  DKK: 7.4756,
  GBP: 0.85765,
  HUF: 364.5,
  PLN: 4.2983,
  RON: 5.2525,
  SEK: 10.9455,
  CHF: 0.9347,
  ISK: 142.6,
  NOK: 10.975,
  TRY: 55.0287,
  AUD: 1.6384,
  BRL: 5.8826,
  CAD: 1.616,
  CNY: 7.7834,
  HKD: 9.0491,
  IDR: 20584.96,
  ILS: 3.4638,
  INR: 109.8275,
  KRW: 1633.3,
  MXN: 19.7884,
  MYR: 4.719,
  NZD: 1.9646,
  PHP: 70.21,
  SGD: 1.4775,
  THB: 38.129,
  ZAR: 18.7136,
};

export const RELATIONSHIP_LABELS = {
  same_product_cheaper: "Same product, better price",
  same_product_used: "Same product, pre-owned",
  same_product_new: "Same product, new",
  similar_silhouette: "Similar silhouette",
  archive_reference: "Archive reference",
  budget_alternative: "Budget alternative",
};

const RELATIONSHIP_ORDER_BY_SOURCE = {
  retail: [
    "same_product_cheaper",
    "same_product_used",
    "budget_alternative",
    "similar_silhouette",
    "archive_reference",
    "same_product_new",
  ],
  resale: [
    "same_product_new",
    "same_product_cheaper",
    "similar_silhouette",
    "budget_alternative",
    "archive_reference",
    "same_product_used",
  ],
  archive: [
    "same_product_used",
    "archive_reference",
    "similar_silhouette",
    "budget_alternative",
    "same_product_new",
    "same_product_cheaper",
  ],
};

function definePiece(piece) {
  return {
    ...piece,
    relationship_order:
      RELATIONSHIP_ORDER_BY_SOURCE[piece.hero.source_type] ||
      RELATIONSHIP_ORDER_BY_SOURCE.archive,
  };
}

export const PICKS = [
  definePiece({
    id: "kaptain-sunshine-traveller-coat",
    slot: "Outer",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=Kaptain+Sunshine+Traveller+Coat+Navy&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "Balmacaan collar, raglan shoulder, cut long enough to cover a jacket. The one coat that works over everything else here.",
    why_this_source:
      "The proportion and dense cloth are the point, so this specific seasonal listing is the cleanest reference for measurements, fabric, and color before comparing used versions.",
    hero: {
      id: "namu-traveller-coat-aw25",
      source_type: "retail",
      source: "Namu Shop",
      brand: "Kaptain Sunshine",
      item: "Traveller Coat",
      price: "$1,076",
      condition: "New",
      sizes_available: "Check retailer",
      status: "Final sale",
      href: "https://www.namu-shop.com/products/kaptain-sunshine-traveller-coat-top-navy-aw25",
      image: "/products/traveller-coat-clean.jpg",
    },
    alternatives: [],
  }),
  definePiece({
    id: "ernest-w-baker-crocodile-bomber",
    legacy_ids: ["camiel-fortgens-big-shirt"],
    slot: "Leather jacket",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=Ernest+W+Baker+Crocodile+Leather+Bomber+JA27L&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "The cropped bomber interrupts the long coat and wide trousers with a sharper, shorter shape. Crocodile-embossed black lamb leather adds texture without introducing another color.",
    why_this_source:
      "The brand has the exact JA27L bomber reduced from €1,270 to €710 with three sizes listed. This is worth checking new while the sale price competes with what a clean used example may cost.",
    hero: {
      id: "ernest-w-baker-ja27l-crocodile-bomber",
      source_type: "retail",
      source: "Ernest W. Baker",
      brand: "Ernest W. Baker",
      item: "80's Crocodile Leather Bomber",
      price: "$819",
      condition: "New",
      sizes_available: "S/46–L/50",
      status: "44% off",
      href: "https://www.ernest-w-baker.com/shop/crocodile-leather-bomber?category=Leather",
      image: "/products/ernest-w-baker-crocodile-bomber.webp",
    },
    alternatives: [],
  }),
  definePiece({
    id: "brooks-brothers-cashmere-v-neck",
    legacy_ids: ["beams-plus-shawl-cardigan"],
    slot: "Knit",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=Brooks+Brothers+3-Ply+Cashmere+V-Neck+Sweater+Black+MS01260&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "The deep V leaves the blue shirt visible while the black cashmere connects the top half to the denim and boots. Its clean shape adds warmth without another bulky collar.",
    why_this_source:
      "The dense 3-ply cashmere is the reason to choose this version: it behaves like a proper layer instead of a fragile luxury basic. Buying it new also avoids stretched necklines and hidden knit damage.",
    hero: {
      id: "brooks-brothers-ms01260-black",
      source_type: "retail",
      source: "Brooks Brothers",
      brand: "Brooks Brothers",
      item: "3-Ply Cashmere V-Neck Sweater",
      price: "$498",
      condition: "New",
      sizes_available: "XS–XXL",
      status: "In stock",
      href: "https://www.brooksbrothers.com/3-ply-cashmere-v-neck-sweater/MS01260.html?dwvar_MS01260_Color=BLCK&quantity=1",
      image: "/products/brooks-brothers-cashmere-v-neck-clean.jpg",
    },
    alternatives: [],
  }),
  definePiece({
    id: "prada-sky-cotton-shirt",
    slot: "Shirt",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=Prada+UCN596+10IV+F0AB7+Cotton+Shirt&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "The quiet blue base breaks up the black leather, knit, and trousers. Its sharper collar holds the middle of the look without competing with the outer layers.",
    why_this_source:
      "The exact sky blue and sharp collar are doing the work. Retail is the dependable reference for color, fabrication, and a complete size run when used listings are vague.",
    hero: {
      id: "prada-ucn596-10iv-f0ab7",
      source_type: "retail",
      source: "Prada",
      brand: "Prada",
      item: "Sky Cotton Shirt",
      price: "$1,350",
      condition: "New",
      sizes_available: "Check retailer",
      status: "Available",
      href: "https://www.prada.com/us/en/p/cotton-shirt/UCN596_10IV_F0AB7_S_OOO",
      image: "/products/prada-shirt-clean.jpg",
    },
    alternatives: [],
  }),
  definePiece({
    id: "sunspel-riviera-long-sleeve",
    slot: "Polo",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=Sunspel+Long+Sleeve+Riviera+Polo+Black&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "Long-sleeve mesh cotton adds a clean black layer without the bulk of another knit. The collar stays visible under the cardigan and both blue shirts.",
    why_this_source:
      "This is a repeatable core piece rather than a patina piece. Buying new makes sense when exact size, collar shape, and washable mesh matter more than age.",
    hero: {
      id: "sunspel-riviera-black",
      source_type: "retail",
      source: "Sunspel",
      brand: "Sunspel",
      item: "Long Sleeve Riviera",
      price: "$215",
      condition: "New",
      sizes_available: "Check retailer",
      status: "In stock",
      href: "https://www.sunspel.com/products/mens-cotton-riviera-long-sleeve-polo-shirt-in-black",
      image: "/products/riviera-polo-clean.jpg",
    },
    alternatives: [],
  }),
  definePiece({
    id: "rick-owens-geth-jeans",
    legacy_ids: ["our-legacy-third-cut"],
    slot: "Black trouser",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=Rick+Owens+Geth+Jeans+RU02F4333+Black&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "The low rise and long, wide leg give the uniform one exaggerated proportion below the coat. Black keeps that volume from competing with the blue and grey layers above it.",
    why_this_source:
      "This version is cut in Japanese twisted wool rather than standard denim. The official listing is the clearest source for the exact fabric, full length, and available waist sizes before comparing used Geth Jeans that may be a different season or cloth.",
    hero: {
      id: "rick-owens-ru02f4333-wt-09",
      source_type: "retail",
      source: "Rick Owens",
      brand: "Rick Owens",
      item: "Geth Jeans",
      price: "$859",
      condition: "New",
      sizes_available: "29–34",
      status: "In stock",
      href: "https://www.rickowens.eu/products/ru02f4333wt09",
      image: "/products/rick-owens-geth-jeans-clean.jpg",
    },
    alternatives: [
      {
        id: "our-legacy-third-cut-black-selvedge",
        source_type: "retail",
        source: "Our Legacy",
        brand: "Our Legacy",
        item: "Third Cut Black Selvedge",
        price: "$415",
        condition: "New",
        sizes_available: "Check retailer",
        relationship: "budget_alternative",
        href: "https://www.ourlegacy.com/third-cut-black-selvedge",
        image: "/products/third-cut.jpg",
      },
    ],
  }),
  definePiece({
    id: "fgs-originals-waffle-crew-socks-m-gray",
    legacy_ids: ["anonymous-ism-waffle-sock"],
    slot: "Sock",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=FGS+Originals+Waffle+Crew+Socks+M+Gray&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "The mid-grey waffle knit adds texture at the ankle without introducing another color. It keeps the navy, black, and blue layers connected.",
    why_this_source:
      "At $16, buying this exact pair new makes more sense than spending time hunting a close used substitute. The one-size fit also removes most of the sizing risk.",
    hero: {
      id: "front-general-store-waffle-crew-socks-m-gray",
      source_type: "retail",
      source: "Front General Store",
      brand: "FGS Originals",
      item: "Waffle Crew Socks / M.Gray",
      price: "$16",
      condition: "New",
      sizes_available: "One size",
      status: "In stock",
      href: "https://frontgeneralstore.com/collections/socks/products/fgs-originals-waffle-crew-socks-m-gray",
      image: "/products/fgs-waffle-crew-socks-m-gray.png",
    },
    alternatives: [],
  }),
  definePiece({
    id: "kiko-kostadinov-farkas-boots",
    legacy_ids: ["hender-scheme-mip-22"],
    slot: "Boot",
    ebay_search_href:
      "https://www.ebay.com/sch/i.html?_nkw=Kiko+Kostadinov+Farkas+Boots+261985M228002+Black&_sacat=0&LH_ItemCondition=3000",
    why_selected:
      "The rounded work-boot toe and Vibram sole give the wide Geth hem enough weight underneath it. Polished black leather keeps the boot connected to the trouser while the drawstring collar adds one technical detail.",
    why_this_source:
      "SSENSE has this exact soot-black pair at 41% off with four sizes still available. That makes the new listing unusually competitive before considering used pairs, where this current-season model is still scarce.",
    hero: {
      id: "ssense-kiko-farkas-19042871",
      source_type: "retail",
      source: "SSENSE",
      brand: "Kiko Kostadinov",
      item: "Black Farkas Boots",
      price: "$534",
      condition: "New",
      sizes_available: "IT 40, 42–44",
      status: "41% off",
      href: "https://www.ssense.com/en-us/men/product/kiko-kostadinov/black-farkas-boots/19042871",
      image: "/products/kiko-kostadinov-farkas-boots-clean.jpg",
    },
    alternatives: [],
  }),
];

const WARDROBE_CATEGORIES = [
  { id: "all", label: "All pieces", slots: null },
  { id: "outerwear", label: "Outerwear", slots: ["Outer", "Leather jacket"] },
  {
    id: "layers",
    label: "Layers",
    slots: ["Knit", "Shirt", "Polo"],
  },
  { id: "bottoms", label: "Bottoms", slots: ["Black trouser"] },
  { id: "accessories", label: "Accessories", slots: ["Sock"] },
  { id: "footwear", label: "Footwear", slots: ["Boot"] },
];

const WARDROBE_POSITIONS = {
  "kaptain-sunshine-traveller-coat": {
    "--float-x": "4%",
    "--float-y": "7%",
    "--float-w": "22%",
    "--float-r": "-1.5deg",
  },
  "ernest-w-baker-crocodile-bomber": {
    "--float-x": "34%",
    "--float-y": "2%",
    "--float-w": "17%",
    "--float-r": "1deg",
  },
  "brooks-brothers-cashmere-v-neck": {
    "--float-x": "72%",
    "--float-y": "8%",
    "--float-w": "20%",
    "--float-r": "-1deg",
  },
  "prada-sky-cotton-shirt": {
    "--float-x": "18%",
    "--float-y": "37%",
    "--float-w": "16%",
    "--float-r": "1.5deg",
  },
  "sunspel-riviera-long-sleeve": {
    "--float-x": "51%",
    "--float-y": "34%",
    "--float-w": "17%",
    "--float-r": "-1deg",
  },
  "rick-owens-geth-jeans": {
    "--float-x": "77%",
    "--float-y": "39%",
    "--float-w": "18%",
    "--float-r": "1deg",
  },
  "fgs-originals-waffle-crew-socks-m-gray": {
    "--float-x": "5%",
    "--float-y": "69%",
    "--float-w": "13%",
    "--float-r": "-2deg",
  },
  "kiko-kostadinov-farkas-boots": {
    "--float-x": "42%",
    "--float-y": "64%",
    "--float-w": "24%",
    "--float-r": "1deg",
  },
};

export function ProductImage({ pick }) {
  const [src, setSrc] = useState(pick.hero.image);

  return (
    <img
      src={src}
      alt={`${pick.hero.brand} ${pick.hero.item}`}
      loading="lazy"
      decoding="async"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  );
}

export function formatListingMoney(value, currency) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || !currency) return "Price unavailable";
  const currencyCode = String(currency).toUpperCase();
  const referenceRate = ECB_EUR_REFERENCE_RATES[currencyCode];
  if (!referenceRate) return "Price unavailable";
  const usdAmount =
    (amount / referenceRate) * ECB_EUR_REFERENCE_RATES.USD;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(usdAmount);
  } catch {
    return `$${Math.round(usdAmount).toLocaleString("en-US")}`;
  }
}

const SOURCE_LABELS = {
  retail: "Retail",
  resale: "Resale",
  archive: "Archive",
};

function liveMarketAlternatives(market) {
  if (market.status !== "ready") return [];

  return market.listings.map((listing) => ({
    id: `ebay-${listing.id}`,
    source_type: "resale",
    source: "eBay",
    item: listing.title,
    price: formatListingMoney(listing.price, listing.currency),
    condition: listing.condition || "Pre-owned",
    sizes_available: "Check listing",
    relationship:
      market.matchType === "exact"
        ? "same_product_used"
        : "similar_silhouette",
    href: listing.url,
    image: listing.imageUrl || FALLBACK_IMAGE,
  }));
}

export function PieceCard({ piece, market }) {
  const hero = piece.hero;
  const alternatives = [
    ...piece.alternatives,
    ...liveMarketAlternatives(market),
  ];
  const groups = piece.relationship_order
    .map((relationship) => ({
      relationship,
      items: alternatives.filter(
        (alternative) => alternative.relationship === relationship
      ),
    }))
    .filter((group) => group.items.length > 0);
  const searchUrl = market.searchUrl || piece.ebay_search_href;

  return (
    <article className="s-piece-card">
      <div className="s-piece-hero">
        <div className="s-piece-kicker">
          <span>Henry’s selection</span>
          <span>{SOURCE_LABELS[hero.source_type]}</span>
        </div>
        <p className="s-slot">{piece.slot}</p>
        <ProductImage pick={piece} />
        <div className="s-piece-hero-copy">
          <p className="s-piece-brand">{hero.brand}</p>
          <h2>{hero.item}</h2>
          <div className="s-piece-meta">
            <span>{hero.price}</span>
            <span>{hero.condition}</span>
            <span>{hero.sizes_available}</span>
          </div>
          <div className="s-piece-actions">
            <a
              className="s-piece-primary"
              href={hero.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hero.link_label || "View selected listing ↗"}
            </a>
            <a
              className="s-piece-ebay"
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View live eBay listings ↗
            </a>
          </div>
        </div>
      </div>

      <div className="s-piece-editorial">
        <div>
          <span>Why selected</span>
          <p>{piece.why_selected}</p>
        </div>
        <div className="is-source">
          <span>Why this source</span>
          <p>{piece.why_this_source}</p>
        </div>
      </div>

      <section className="s-piece-alternatives" aria-labelledby={`alternatives-${piece.id}`}>
        <div className="s-piece-section-head">
          <div>
            <p className="s-eyebrow">Live eBay + curated alternatives</p>
            <h3 id={`alternatives-${piece.id}`}>Buying options</h3>
          </div>
          <span>Ordered from the hero source</span>
        </div>

        {market.status === "loading" && (
          <div className="s-used-status" role="status" aria-live="polite">
            <span className="s-used-pulse" aria-hidden="true" />
            Looking for live alternatives…
          </div>
        )}

        {market.status === "ready" && market.matchType !== "exact" && (
          <p className="s-used-status" role="status" aria-live="polite">
            No exact version listed. Showing the closest available options.
          </p>
        )}

        {groups.map((group) => (
          <section className="s-piece-group" key={group.relationship}>
            <h4>{RELATIONSHIP_LABELS[group.relationship]}</h4>
            <div className="s-piece-list">
              {group.items.map((alternative) => (
                <a
                  className="s-piece-alternative"
                  href={alternative.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={alternative.id}
                >
                  <img
                    src={alternative.image || FALLBACK_IMAGE}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <span className="s-piece-alt-copy">
                    <span className="s-piece-alt-source">
                      {SOURCE_LABELS[alternative.source_type]} · {alternative.source}
                    </span>
                    <strong>{alternative.item}</strong>
                    <span className="s-piece-alt-meta">
                      {alternative.price} · {alternative.condition}
                    </span>
                    <span className="s-piece-alt-sizes">
                      Sizes: {alternative.sizes_available}
                    </span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>
        ))}

        {market.status === "error" && (
          <p className="s-used-status" role="status" aria-live="polite">
            {market.message}
          </p>
        )}

      </section>
    </article>
  );
}

export function ProductWatch({ pick }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submitWatch = async (event) => {
    event.preventDefault();
    if (status === "loading") return;
    if (!email.trim() || !event.currentTarget.reportValidity()) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/product-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          product: pick.id,
          company: "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setStatus("success");
      setMessage(data.message || "Watch saved.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We couldn't save this watch. Try again."
      );
    }
  };

  return (
    <section className="s-watch" aria-labelledby="product-watch-title">
      <div className="s-used-kicker">
        <span>Alert beta</span>
        <span>Email + pre-owned</span>
      </div>
      <h3 id="product-watch-title">Watch this piece</h3>
      <p className="s-watch-intro">
        Save your email for retail drops and new pre-owned matches. We’ll
        confirm this watch by email as soon as sending is connected.
      </p>
      {status === "success" ? (
        <p className="s-watch-success" role="status" aria-live="polite">
          {message}
        </p>
      ) : (
        <>
          <form className="s-watch-field" onSubmit={submitWatch}>
            <input
              type="email"
              name="watch-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              aria-label={`Email address for ${pick.hero.brand} ${pick.hero.item} alerts`}
              autoComplete="email"
              maxLength={254}
              required
              disabled={status === "loading"}
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Saving…" : "Add watch"}
            </button>
          </form>
          {status === "error" && (
            <p className="s-watch-error" role="alert">
              {message}
            </p>
          )}
        </>
      )}
    </section>
  );
}

const AI_QUICK_SEARCHES = [
  "Same idea under $500",
  "Find it used",
  "Less statement",
  "Different color",
];

export function AiFinder({ pick, defaultOpen = false, standalone = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const runSearch = async (requestedQuery) => {
    const normalizedQuery = requestedQuery.trim();
    if (status === "loading" || normalizedQuery.length < 3) return;

    setIsOpen(true);
    setQuery(normalizedQuery);
    setStatus("loading");
    setMessage("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: pick.id,
          request: normalizedQuery,
          company: "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setResult(data);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "This search is temporarily unavailable."
      );
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    runSearch(query);
  };

  return (
    <section
      id={standalone ? "find-your-version" : undefined}
      className={`s-ai ${isOpen ? "is-open" : ""} ${
        standalone ? "is-standalone" : ""
      }`}
    >
      <div className="s-used-kicker">
        <span>In Other News AI</span>
        <span>Personal search beta</span>
      </div>
      <h3>{standalone ? "Find your version" : "Not quite right?"}</h3>
      <p className="s-ai-intro">
        {standalone
          ? "Describe the version you actually want. Keep the idea, then change the price, color, size, or attitude."
          : "Tell us what you would change. Keep the idea, then make the price, color, size, or attitude more specific to you."}
      </p>

      {!isOpen ? (
        <button
          className="s-ai-open"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          Find your version →
        </button>
      ) : (
        <>
          <div className="s-ai-chips" aria-label="Quick search ideas">
            {AI_QUICK_SEARCHES.map((quickSearch) => (
              <button
                type="button"
                key={quickSearch}
                onClick={() => runSearch(quickSearch)}
                disabled={status === "loading"}
              >
                {quickSearch}
              </button>
            ))}
          </div>
          <form className="s-ai-form" onSubmit={submitSearch}>
            <label htmlFor={`ai-search-${pick.id}`}>
              Describe your version
            </label>
            <div className="s-ai-field">
              <input
                id={`ai-search-${pick.id}`}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Same shape, but brown and under $400"
                maxLength={240}
                minLength={3}
                required
                disabled={status === "loading"}
                autoComplete="off"
              />
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Searching…" : "Search"}
              </button>
            </div>
          </form>
        </>
      )}

      {status === "loading" && (
        <div className="s-ai-status" role="status" aria-live="polite">
          <span className="s-used-pulse" aria-hidden="true" />
          Refining the product and checking live listings…
        </div>
      )}

      {status === "error" && (
        <p className="s-ai-error" role="alert">
          {message}
        </p>
      )}

      {status === "ready" && result && (
        <div className="s-ai-result" aria-live="polite">
          <div className="s-ai-result-head">
            <span>{result.mode === "ai" ? "AI refinement" : "Guided preview"}</span>
            <strong>{result.title}</strong>
            <p>{result.summary}</p>
          </div>
          <div className="s-ai-signals" aria-label="Search priorities">
            {(result.signals || []).map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>

          {result.listings?.length > 0 ? (
            <div className="s-ai-list">
              <p>Live pre-owned results</p>
              {result.listings.map((listing) => (
                <a
                  className="s-used-card"
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={listing.id}
                >
                  <img
                    src={listing.imageUrl || FALLBACK_IMAGE}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <span className="s-used-card-copy">
                    <strong>{listing.title}</strong>
                    <span className="s-used-card-price">
                      {formatListingMoney(listing.price, listing.currency)}
                    </span>
                    <span className="s-used-card-meta">{listing.condition}</span>
                  </span>
                  <span className="s-used-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="s-ai-empty">
              {result.message || "No live pre-owned results found yet."}
            </p>
          )}

          <div className="s-ai-links">
            <a
              href={result.retailSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Search retail + sale ↗
            </a>
            <a
              href={result.ebaySearchUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Search more pre-owned ↗
            </a>
            <a
              href={result.resaleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Search Grailed ↗
            </a>
          </div>
          {result.mode !== "ai" && (
            <p className="s-ai-note">
              The product-aware search works now. Natural-language AI activates
              when the private API key is connected.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default function Uniform() {
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [savedProductIds, setSavedProductIds] = useState([]);
  const openerRef = useRef(null);
  const drawerRef = useRef(null);
  const submit = async (event) => {
    event.preventDefault();
    if (subscribeStatus === "loading") return;

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !event.currentTarget.reportValidity()) return;

    setSubscribeStatus("loading");
    setSubscribeMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, company: "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSubscribeStatus("success");
      setSubscribeMessage(data.message || "Subscribed. Uniform 02 lands Sunday.");
    } catch (error) {
      setSubscribeStatus("error");
      setSubscribeMessage(
        error instanceof Error
          ? error.message
          : "We couldn't save your email. Try again."
      );
    }
  };
  const activePick = activeIdx === null ? null : PICKS[activeIdx];
  const savedPicks = PICKS.filter((pick) =>
    savedProductIds.includes(pick.id)
  );
  const activeCategoryDetails =
    WARDROBE_CATEGORIES.find(
      (category) => category.id === activeCategory
    ) || WARDROBE_CATEGORIES[0];
  const wardrobePicks = PICKS.map((pick, index) => ({ pick, index })).filter(
    ({ pick }) =>
      !activeCategoryDetails.slots ||
      activeCategoryDetails.slots.includes(pick.slot)
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem("in-other-news:saved-products") || "[]"
      );
      if (Array.isArray(stored)) {
        const currentIds = stored
          .map((productId) =>
            PICKS.find(
              (pick) =>
                pick.id === productId || pick.legacy_ids?.includes(productId)
            )
          )
          .filter(Boolean)
          .map((pick) => pick.id);
        setSavedProductIds(
          [...new Set(currentIds)]
        );
      }
    } catch {
      setSavedProductIds([]);
    }
  }, []);

  const toggleSaved = (productId) => {
    setSavedProductIds((current) => {
      const next = current.includes(productId)
        ? current.filter((savedId) => savedId !== productId)
        : [...current, productId];
      try {
        window.localStorage.setItem(
          "in-other-news:saved-products",
          JSON.stringify(next)
        );
      } catch {
        // Saving still works for this visit when device storage is unavailable.
      }
      return next;
    });
  };

  const scrollToSaved = () => {
    document
      .getElementById("saved-pieces")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openProduct = (event, index) => {
    openerRef.current = event.currentTarget;
    setActiveIdx(index);
  };

  const closeProduct = () => {
    setActiveIdx(null);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!activePick) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeProduct();
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll(
          "a[href], button:not([disabled]), input:not([disabled])"
        )
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePick]);

  return (
    <div className="s-root">
      <style>{CSS}</style>
      <header className="s-head">
        <div className="s-head-brand">
          <a href="/">Henry Greelis</a>
          <span aria-hidden="true">/</span>
          <span>{MASTHEAD.title}</span>
        </div>
        <div className="s-head-meta">
          <span>Issue {MASTHEAD.issue} &nbsp; {MASTHEAD.date}</span>
          <button type="button" onClick={scrollToSaved}>
            Saved {savedPicks.length}
          </button>
        </div>
      </header>

      <main>
        <section className="s-wardrobe-layout">
          <aside className="s-wardrobe-sidebar" aria-labelledby="issue-title">
            <div className="s-wardrobe-meta">
              <p>Issue {MASTHEAD.issue}</p>
              <p>{PICKS.length} pieces</p>
            </div>
            <p className="s-eyebrow">{MASTHEAD.eyebrow}</p>
            <h1 id="issue-title">{MASTHEAD.theme}</h1>
            <p className="s-deck">{MASTHEAD.deck}</p>

            <nav className="s-category-nav" aria-label="Filter the uniform">
              <p>Explore the uniform</p>
              <div className="s-category-list">
                {WARDROBE_CATEGORIES.map((category) => {
                  const count = category.slots
                    ? PICKS.filter((pick) =>
                        category.slots.includes(pick.slot)
                      ).length
                    : PICKS.length;
                  return (
                    <button
                      type="button"
                      key={category.id}
                      aria-pressed={activeCategory === category.id}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <span>{category.label}</span>
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
            <p className="s-price-note">{USD_PRICE_NOTE}</p>
          </aside>

          <section
            className="s-wardrobe-canvas"
            aria-label={`${activeCategoryDetails.label} in Issue 01`}
          >
            <div className="s-canvas-meta" aria-live="polite">
              <span>{activeCategoryDetails.label}</span>
              <span>{wardrobePicks.length} shown</span>
            </div>
            {wardrobePicks.map(({ pick, index }) => (
              <article
                className="s-float"
                key={pick.id}
                style={WARDROBE_POSITIONS[pick.id]}
              >
                <button
                  className="s-float-button"
                  type="button"
                  onClick={(event) => openProduct(event, index)}
                  aria-haspopup="dialog"
                  aria-label={`Open details for ${pick.hero.brand} ${pick.hero.item}`}
                >
                  <ProductImage pick={pick} />
                  <span className="s-float-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="s-float-label">
                    <span>{pick.slot}</span>
                    <strong>{pick.hero.brand}</strong>
                    <span>{pick.hero.item}</span>
                    <b>{pick.hero.price}</b>
                  </span>
                </button>
              </article>
            ))}
          </section>
        </section>

        <section className="s-issue-rundown" aria-label="About this uniform">
          <div>
            <span>Why this exists</span>
            <p>
              The first genuinely cold week is awkward: a winter coat can feel
              early, while shirt sleeves feel optimistic. This issue builds one
              system that can gain or lose a layer without losing its shape.
            </p>
          </div>
          <div>
            <span>What it is for</span>
            <p>
              Cold mornings, warmer afternoons, work, dinner, and long walks.
              The coat sets the outline; every layer underneath can be added,
              removed, or worn alone.
            </p>
          </div>
          <div>
            <span>Who it is for</span>
            <p>
              Someone who wants directional clothes without a different outfit
              for every occasion: fewer pieces, stronger proportions, and
              enough time to find the right versions used.
            </p>
          </div>
        </section>
      </main>

      <section className="s-saved" id="saved-pieces" aria-labelledby="saved-title">
        <div className="s-saved-head">
          <div>
            <p className="s-eyebrow">Your edit</p>
            <h2 id="saved-title">Saved from Issue 01</h2>
          </div>
          <span>{savedPicks.length} saved</span>
        </div>
        {savedPicks.length ? (
          <div className="s-saved-list">
            {savedPicks.map((pick) => {
              const index = PICKS.findIndex(
                (candidate) => candidate.id === pick.id
              );
              return (
                <button
                  type="button"
                  className="s-saved-item"
                  key={pick.id}
                  onClick={(event) => openProduct(event, index)}
                >
                  <span>{pick.slot}</span>
                  <strong>{pick.hero.brand}</strong>
                  <small>{pick.hero.item}</small>
                  <b aria-hidden="true">→</b>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="s-saved-empty">
            Save a piece from the grid. Your edit stays on this device.
          </p>
        )}
      </section>

      {activePick && (
        <div className="s-drawer-wrap" onMouseDown={closeProduct}>
          <aside
            ref={drawerRef}
            id="product-drawer"
            className="s-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-drawer-title"
            aria-describedby="product-drawer-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="s-drawer-close"
              type="button"
              onClick={closeProduct}
              aria-label="Close product details"
              autoFocus
            >
              Close ×
            </button>
            <ProductImage key={activePick.hero.image} pick={activePick} />
            <div className="s-drawer-copy">
              <div className="s-piece-kicker">
                <span>{activePick.slot}</span>
                <span>{SOURCE_LABELS[activePick.hero.source_type]} hero</span>
              </div>
              <p className="s-drawer-brand">{activePick.hero.brand}</p>
              <h2 id="product-drawer-title">{activePick.hero.item}</h2>
              <div className="s-drawer-meta">
                <span>{activePick.hero.price}</span>
                <span className="s-tag">{activePick.hero.status}</span>
              </div>
              <div id="product-drawer-description" className="s-drawer-editorial">
                <div>
                  <span>Why selected</span>
                  <p>{activePick.why_selected}</p>
                </div>
                <div className="is-source">
                  <span>Why this source</span>
                  <p>{activePick.why_this_source}</p>
                </div>
              </div>
              <a
                className="s-drawer-link"
                href={activePick.hero.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activePick.hero.link_label || "View selected listing ↗"}
              </a>
              <div className="s-drawer-search-actions">
                <a
                  href={`/search?product=${encodeURIComponent(
                    activePick.id
                  )}`}
                >
                  Compare buying options →
                </a>
              </div>
              <button
                className="s-drawer-save"
                type="button"
                aria-pressed={savedProductIds.includes(activePick.id)}
                onClick={() => toggleSaved(activePick.id)}
              >
                {savedProductIds.includes(activePick.id)
                  ? "Saved to your edit ✓"
                  : "Save to your edit +"}
              </button>
            </div>
          </aside>
        </div>
      )}

      <section className="s-sub">
        {subscribeStatus === "success" ? (
          <p className="s-sub-success" role="status" aria-live="polite">
            {subscribeMessage}
          </p>
        ) : (
          <>
            <p>Return for Uniform 02 next Sunday.</p>
            <form className="s-field" onSubmit={submit}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                aria-label="Email address"
                autoComplete="email"
                maxLength={254}
                required
                disabled={subscribeStatus === "loading"}
              />
              <button type="submit" disabled={subscribeStatus === "loading"}>
                {subscribeStatus === "loading" ? "Saving…" : "Subscribe"}
              </button>
            </form>
            {subscribeStatus === "error" && (
              <p className="s-sub-error" role="alert">
                {subscribeMessage}
              </p>
            )}
          </>
        )}
      </section>

      <footer className="s-foot">
        <span>
          <a href="/">Henry Greelis</a> &nbsp;/&nbsp; {MASTHEAD.title} &nbsp;
          {MASTHEAD.issue}
        </span>
        <span>Some links earn a commission</span>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&display=swap');
.s-root{box-sizing:border-box;--fg:#000;--mid:#767676;--surface:#efefed;--line:#d9d9d6;--plate:var(--surface);--f:'Archivo',Helvetica,Arial,sans-serif;width:100%;min-height:100svh;margin:0;background:var(--surface);color:var(--fg);font-family:var(--f);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;padding:0 16px}
.s-root *{box-sizing:border-box}.s-root h1,.s-root h2,.s-root p{margin:0}.s-root h1{font-weight:400}.s-root button:focus-visible,.s-root input:focus-visible,.s-root a:focus-visible{outline:1px solid var(--fg);outline-offset:2px}
.s-head{display:flex;justify-content:space-between;align-items:center;padding:18px 0;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-head-brand{display:flex;align-items:center;gap:8px}.s-head-brand a{color:var(--fg);text-decoration:none}.s-head-brand a:hover{text-decoration:underline;text-underline-offset:3px}.s-head-brand>span:last-child{color:var(--mid)}.s-head-meta{display:flex;align-items:center;gap:22px}.s-head-meta button{padding:0 0 2px;border:0;border-bottom:1px solid var(--fg);background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-head-meta button:hover{color:var(--mid);border-color:var(--mid)}
.s-eyebrow{color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}.s-price-note{margin-top:24px!important;color:var(--mid);font-size:8.5px!important;font-weight:500;letter-spacing:.08em;line-height:1.5;text-transform:uppercase}
.s-wardrobe-layout{display:grid;grid-template-columns:clamp(190px,22vw,300px) minmax(0,1fr);align-items:start;gap:clamp(20px,3vw,48px);padding:30px 0 64px;border-top:1px solid var(--line)}.s-wardrobe-sidebar{position:sticky;top:24px;min-width:0}.s-wardrobe-meta{display:flex;justify-content:space-between;gap:20px;margin-bottom:36px;color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-wardrobe-sidebar h1{max-width:11ch;margin-top:10px;font-size:clamp(34px,3.6vw,54px);font-weight:600;line-height:.96;letter-spacing:-.045em}.s-deck{max-width:42ch;margin-top:20px!important;color:#414141;font-size:12px;line-height:1.7}.s-category-nav{margin-top:34px;padding-top:14px;border-top:1px solid var(--fg)}.s-category-nav>p{margin-bottom:10px!important;color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-category-list{display:grid;gap:1px}.s-category-list button{display:flex;width:100%;align-items:center;justify-content:space-between;gap:18px;padding:2px 0;border:0;background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:12px;line-height:1.45;text-align:left}.s-category-list button span:last-child{color:var(--mid);font-size:9px}.s-category-list button:hover span:first-child,.s-category-list button[aria-pressed="true"] span:first-child{text-decoration:underline;text-underline-offset:3px}.s-category-list button[aria-pressed="true"]{font-weight:600}
.s-wardrobe-canvas{position:relative;min-height:clamp(720px,70vw,940px);overflow:hidden;background:var(--surface);isolation:isolate}.s-canvas-meta{position:absolute;z-index:20;top:12px;right:14px;display:flex;gap:16px;color:var(--mid);font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-float{position:absolute;z-index:1;left:var(--float-x);top:var(--float-y);width:var(--float-w);transform:rotate(var(--float-r));transition:opacity .2s ease}.s-float:hover,.s-float:focus-within{z-index:30}.s-float-button{position:relative;display:block;width:100%;padding:0;border:0;background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);text-align:left}.s-float-button>img{display:block;width:100%;aspect-ratio:4/5;object-fit:contain;object-position:center;background:var(--surface);mix-blend-mode:multiply;transition:transform .2s ease}.s-float-button:hover>img,.s-float-button:focus-visible>img{transform:translateY(-7px) scale(1.035)}.s-float-number{position:absolute;top:5px;left:5px;color:#666;font-size:7px;font-weight:600;letter-spacing:.08em}.s-float-label{position:absolute;z-index:3;left:50%;bottom:-6px;width:max-content;max-width:190px;padding:8px 10px;border:1px solid var(--fg);background:#fff;box-shadow:3px 3px 0 rgba(0,0,0,.12);opacity:0;pointer-events:none;transform:translate(-50%,calc(100% + 6px)) scale(.96);transform-origin:top center;transition:opacity .15s ease,transform .15s ease}.s-float-button:hover .s-float-label,.s-float-button:focus-visible .s-float-label{opacity:1;transform:translate(-50%,100%) scale(1)}.s-float-label span,.s-float-label strong,.s-float-label b{display:block}.s-float-label>span:first-child{color:var(--mid);font-size:7.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-float-label strong{margin-top:3px;font-size:10px;font-weight:600}.s-float-label>span:nth-of-type(2){overflow:hidden;max-width:170px;color:var(--mid);font-size:9px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.s-float-label b{margin-top:5px;font-size:10px;font-weight:600}.s-issue-rundown{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--fg);border-bottom:1px solid var(--line)}.s-issue-rundown>div{padding:22px 24px 24px 0}.s-issue-rundown>div+div{padding-left:24px;border-left:1px solid var(--line)}.s-issue-rundown span{display:block;color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-issue-rundown p{max-width:45ch;margin-top:8px!important;color:#3d3d3d;font-size:11px;line-height:1.65}.s-slot{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);padding-bottom:8px}.s-tag{font-size:10px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--mid)}
.s-drawer-wrap{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.28);display:flex;justify-content:flex-end}
.s-drawer{width:min(430px,92vw);height:100%;overflow-y:auto;background:#fff;box-shadow:-12px 0 30px rgba(0,0,0,.12);padding:18px}
.s-drawer-close{display:block;margin:0 0 18px auto;padding:0;border:0;background:transparent;font-family:var(--f);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
.s-drawer>img{display:block;width:100%;aspect-ratio:4/5;object-fit:contain;object-position:center;background:var(--plate)}
.s-drawer-copy{padding:22px 2px 32px}.s-drawer-copy .s-slot{padding-bottom:12px}.s-drawer-brand{font-size:13px;font-weight:600}.s-drawer h2{margin:2px 0 0;font-size:24px;font-weight:500;line-height:1.1;letter-spacing:-.02em}
.s-drawer-meta{display:flex;justify-content:space-between;gap:16px;margin-top:18px;padding:12px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.s-drawer-editorial{display:grid;gap:10px;margin-top:22px}.s-drawer-editorial>div{padding:14px;border:1px solid var(--line)}.s-drawer-editorial>div.is-source{border-color:#d8d1c1;background:#f5f2e9}.s-drawer-editorial span{display:block;color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-drawer-editorial p{margin-top:6px!important;color:#333;font-size:12px;line-height:1.6}.s-drawer-link{display:block;margin-top:28px;padding:13px 14px;background:var(--fg);color:#fff;text-align:center;text-decoration:none;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-drawer-link:hover{background:#333}
.s-drawer-search-actions{display:grid;grid-template-columns:1fr;gap:8px;margin-top:8px}.s-drawer-search-actions a{display:flex;min-height:48px;align-items:center;justify-content:center;padding:11px;border:1px solid var(--fg);color:var(--fg);font-size:9px;font-weight:600;letter-spacing:.08em;line-height:1.35;text-align:center;text-decoration:none;text-transform:uppercase}.s-drawer-search-actions a:hover{background:#f2f2ef}
.s-piece-card{min-width:0;border-top:1px solid var(--fg)}.s-piece-hero{padding-top:18px}.s-piece-kicker{display:flex;justify-content:space-between;gap:16px;color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.11em;text-transform:uppercase}.s-piece-hero>.s-slot{margin-top:22px}.s-piece-hero>img{display:block;width:100%;aspect-ratio:4/5;object-fit:contain;object-position:center;background:var(--plate)}.s-piece-hero-copy{padding-top:18px}.s-piece-brand{font-size:12px;font-weight:600}.s-piece-hero h2{margin:2px 0 0;font-size:27px;font-weight:500;line-height:1.05;letter-spacing:-.03em}.s-piece-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px;padding:11px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-size:10px}.s-piece-meta span+span{padding-left:8px;border-left:1px solid var(--line)}.s-piece-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}.s-piece-actions a{display:flex;min-height:44px;align-items:center;justify-content:center;padding:11px 12px;border:1px solid var(--fg);font-size:9px;font-weight:600;letter-spacing:.09em;line-height:1.35;text-align:center;text-decoration:none;text-transform:uppercase}.s-piece-primary{background:var(--fg);color:#fff}.s-piece-primary:hover{background:#333}.s-piece-ebay{background:#fff;color:var(--fg)}.s-piece-ebay:hover{background:#f2f2ef}.s-piece-actions a:focus-visible{outline:2px solid var(--fg);outline-offset:3px}
.s-piece-editorial{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:26px}.s-piece-editorial>div{padding:15px;border:1px solid var(--line)}.s-piece-editorial>div.is-source{border-color:#d8d1c1;background:#f5f2e9}.s-piece-editorial span{display:block;color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-piece-editorial p{margin-top:8px!important;color:#3d3d3d;font-size:11.5px;line-height:1.65}.s-piece-alternatives{margin-top:38px;padding-top:26px;border-top:1px solid var(--fg)}.s-piece-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.s-piece-section-head h3{margin:5px 0 0;font-size:24px;font-weight:500;line-height:1.1;letter-spacing:-.025em}.s-piece-section-head>span{max-width:16ch;color:var(--mid);font-size:8px;font-weight:600;letter-spacing:.1em;line-height:1.45;text-align:right;text-transform:uppercase}.s-piece-group{margin-top:24px}.s-piece-group h4{margin:0;color:var(--mid);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-piece-list{display:grid;gap:8px;margin-top:9px}.s-piece-alternative{position:relative;display:grid;grid-template-columns:82px minmax(0,1fr) auto;gap:12px;min-height:106px;padding:8px;border:1px solid var(--line);color:var(--fg);text-decoration:none}.s-piece-alternative:hover{border-color:#999}.s-piece-alternative>img{width:82px;height:106px;object-fit:cover;background:var(--plate)}.s-piece-alt-copy{display:flex;min-width:0;flex-direction:column;align-items:flex-start}.s-piece-alt-source{color:var(--mid);font-size:8px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}.s-piece-alt-copy strong{display:-webkit-box;overflow:hidden;margin-top:5px;font-size:11px;font-weight:500;line-height:1.35;-webkit-box-orient:vertical;-webkit-line-clamp:2}.s-piece-alt-meta{margin-top:auto;font-size:10.5px;font-weight:600}.s-piece-alt-sizes{color:var(--mid);font-size:9px}.s-piece-alternative>span:last-child{font-size:10px}
.s-ai{scroll-margin-top:24px;margin-top:30px;padding:20px;border:1px solid #dedbd2;background:#f5f2e9}.s-ai h3{margin:9px 0 0;font-size:20px;font-weight:500;line-height:1.15;letter-spacing:-.02em}.s-ai-intro{margin-top:8px!important;color:#4c4a45;font-size:11.5px;line-height:1.55}.s-ai-open{display:block;width:100%;margin-top:16px;padding:12px 14px;border:1px solid var(--fg);background:var(--fg);color:#fff;cursor:pointer;font-family:var(--f);font-size:9.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-ai-open:hover{background:#333}.s-ai-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}.s-ai-chips button{padding:7px 9px;border:1px solid #c7c3b9;background:rgba(255,255,255,.72);color:var(--fg);cursor:pointer;font-family:var(--f);font-size:9px;line-height:1.2}.s-ai-chips button:hover{border-color:var(--fg)}.s-ai-chips button:disabled{cursor:wait;opacity:.5}.s-ai-form{margin-top:17px}.s-ai-form>label{display:block;color:var(--mid);font-size:8.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-ai-field{display:flex;align-items:flex-end;margin-top:7px;border-bottom:1px solid var(--fg)}.s-ai-field input{flex:1;min-width:0;padding:0 8px 8px 0;border:0;background:transparent;color:var(--fg);font-family:var(--f);font-size:11.5px}.s-ai-field button{flex:none;padding:0 0 8px;border:0;background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-ai-field button:disabled,.s-ai-field input:disabled{cursor:wait;opacity:.5}.s-ai-status{display:flex;align-items:center;gap:8px;margin-top:17px;padding:12px;background:rgba(255,255,255,.7);color:#555;font-size:10.5px;line-height:1.4}.s-ai-error{margin-top:14px!important;color:#9c1c13;font-size:10.5px!important}.s-ai-result{margin-top:20px;padding-top:18px;border-top:1px solid #d4d0c6}.s-ai-result-head>span{display:block;color:var(--mid);font-size:8.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-ai-result-head>strong{display:block;margin-top:5px;font-size:15px;font-weight:600;line-height:1.3}.s-ai-result-head>p{margin-top:6px!important;color:#4c4a45;font-size:11px;line-height:1.55}.s-ai-signals{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px}.s-ai-signals span{padding:4px 6px;border:1px solid #d1cdc3;background:rgba(255,255,255,.5);color:#555;font-size:8.5px;letter-spacing:.04em}.s-ai-list{display:grid;gap:7px;margin-top:18px}.s-ai-list>p{color:var(--mid);font-size:8.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-ai-list .s-used-card{background:#fff}.s-ai-empty{margin-top:17px!important;padding:11px;background:rgba(255,255,255,.65);color:#555;font-size:10.5px!important}.s-ai-links{display:grid;gap:8px;margin-top:16px}.s-ai-links a{width:max-content;max-width:100%;border-bottom:1px solid var(--fg);color:var(--fg);font-size:9px;font-weight:500;letter-spacing:.09em;line-height:1.4;text-decoration:none;text-transform:uppercase}.s-ai-links a:hover{color:var(--mid);border-color:var(--mid)}.s-ai-note{margin-top:16px!important;padding-top:12px;border-top:1px solid #d4d0c6;color:#777;font-size:9.5px!important;line-height:1.5}
.s-used{margin-top:30px;padding-top:24px;border-top:1px solid var(--line)}.s-used-kicker{display:flex;justify-content:space-between;gap:16px;color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}.s-used h3{margin:9px 0 0;font-size:18px;font-weight:500;line-height:1.2;letter-spacing:-.01em}.s-used-intro{margin-top:8px!important;color:#555;font-size:11.5px;line-height:1.55}.s-used-status{display:flex;align-items:center;gap:8px;margin-top:16px!important;padding:13px;background:#f5f5f3;color:#555;font-size:11px;line-height:1.4}.s-used-pulse{width:7px;height:7px;border-radius:50%;background:#111;animation:s-used-pulse 1.25s ease-in-out infinite}.s-used-match{margin-top:17px!important;color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-used-list{display:grid;gap:8px;margin-top:9px}.s-used-card{position:relative;display:grid;grid-template-columns:70px minmax(0,1fr);gap:11px;min-height:86px;padding:8px 28px 8px 8px;border:1px solid var(--line);color:var(--fg);text-decoration:none}.s-used-card:hover{border-color:#999}.s-used-card img{width:70px;height:86px;object-fit:cover;background:var(--plate)}.s-used-card-copy{display:flex;min-width:0;flex-direction:column;align-items:flex-start}.s-used-card-copy strong{display:-webkit-box;overflow:hidden;font-size:11px;font-weight:500;line-height:1.35;-webkit-box-orient:vertical;-webkit-line-clamp:2}.s-used-card-price{margin-top:auto;font-size:12px;font-weight:600}.s-used-card-meta{margin-top:1px;color:var(--mid);font-size:9.5px;line-height:1.35}.s-used-arrow{position:absolute;top:8px;right:9px;font-size:11px}.s-used-search{display:inline-block;margin-top:14px;border-bottom:1px solid var(--fg);color:var(--fg);font-size:9.5px;font-weight:500;letter-spacing:.1em;line-height:1.4;text-decoration:none;text-transform:uppercase}.s-used-search:hover{color:var(--mid);border-color:var(--mid)}
.s-drawer-save{display:block;width:100%;margin-top:18px;padding:12px 14px;border:1px solid var(--fg);background:#fff;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:9.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-drawer-save:hover,.s-drawer-save[aria-pressed="true"]{background:#f2f2ef}
.s-watch{margin-top:30px;padding-top:24px;border-top:1px solid var(--line)}.s-watch h3{margin:9px 0 0;font-size:18px;font-weight:500;line-height:1.2;letter-spacing:-.01em}.s-watch-intro{margin-top:8px!important;color:#555;font-size:11.5px;line-height:1.55}.s-watch-field{display:flex;margin-top:16px;border-bottom:1px solid var(--fg)}.s-watch-field input{flex:1;min-width:0;padding:0 0 8px;border:0;background:transparent;color:var(--fg);font-family:var(--f);font-size:12px}.s-watch-field button{padding:0 0 8px;border:0;background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-watch-field button:disabled,.s-watch-field input:disabled{cursor:wait;opacity:.55}.s-watch-success{margin-top:16px!important;padding:13px;background:#f2f2ef;font-size:11px!important}.s-watch-error{margin-top:9px!important;color:#9c1c13;font-size:10.5px!important}
.s-saved{scroll-margin-top:20px;margin-top:80px;padding:30px 0;border-top:1px solid var(--fg);border-bottom:1px solid var(--line)}.s-saved-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}.s-saved-head h2{margin-top:5px;font-size:22px;font-weight:500;letter-spacing:-.02em}.s-saved-head>span{color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-saved-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:22px}.s-saved-item{position:relative;display:flex;min-width:0;flex-direction:column;align-items:flex-start;padding:13px 34px 13px 13px;border:1px solid var(--line);background:#fff;color:var(--fg);cursor:pointer;text-align:left}.s-saved-item:hover{border-color:#999}.s-saved-item span{color:var(--mid);font-size:8.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-saved-item strong{margin-top:8px;font-size:11px;font-weight:600}.s-saved-item small{overflow:hidden;width:100%;color:var(--mid);font-size:10.5px;text-overflow:ellipsis;white-space:nowrap}.s-saved-item b{position:absolute;right:13px;top:50%;font-size:12px;font-weight:400;transform:translateY(-50%)}.s-saved-empty{margin-top:20px!important;color:var(--mid);font-size:11.5px!important}
.s-sub{margin-top:80px;padding:44px 0;border-top:1px solid var(--line)}.s-sub p{font-size:13px}.s-field{display:flex;margin-top:18px;border-bottom:1px solid var(--fg);max-width:380px}.s-field input{flex:1;min-width:0;border:0;background:transparent;font-family:var(--f);font-size:13px;color:var(--fg);padding:0 0 8px}.s-field input::placeholder{color:var(--mid)}.s-field button{border:0;background:transparent;cursor:pointer;padding:0 0 8px;font-family:var(--f);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-field button:hover{color:var(--mid)}.s-field button:disabled,.s-field input:disabled{cursor:wait;opacity:.55}.s-sub-success{font-weight:500}.s-sub-error{margin-top:10px!important;color:#9c1c13;font-size:11px!important}
.s-foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px 0;border-top:1px solid var(--line);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mid)}.s-foot a{color:inherit;text-decoration:none}.s-foot a:hover{text-decoration:underline;text-underline-offset:3px}
@keyframes s-used-pulse{0%,100%{opacity:.25}50%{opacity:1}}
@media (max-width:900px) and (min-width:721px){.s-wardrobe-layout{grid-template-columns:210px minmax(0,1fr);gap:20px;padding-top:26px}.s-wardrobe-meta{margin-bottom:26px}.s-wardrobe-sidebar h1{font-size:34px}.s-deck{margin-top:15px!important;font-size:10.5px;line-height:1.6}.s-category-nav{margin-top:24px}.s-price-note{margin-top:16px!important;font-size:7.5px!important}.s-wardrobe-canvas{min-height:730px}.s-float-label{max-width:160px}.s-issue-rundown p{font-size:9.5px;line-height:1.55}}
@media (max-width:720px){.s-wardrobe-layout{grid-template-columns:1fr;gap:30px;padding:30px 0 52px}.s-wardrobe-sidebar{position:static}.s-wardrobe-meta{margin-bottom:28px}.s-wardrobe-sidebar h1{max-width:14ch}.s-deck{max-width:62ch}.s-category-nav{margin-top:26px}.s-category-list{display:flex;flex-wrap:wrap;gap:6px}.s-category-list button{width:auto;padding:7px 9px;border:1px solid var(--line);font-size:10px}.s-category-list button span:last-child{margin-left:9px}.s-category-list button[aria-pressed="true"]{border-color:var(--fg);background:var(--fg);color:#fff}.s-category-list button[aria-pressed="true"] span:first-child{text-decoration:none}.s-category-list button[aria-pressed="true"] span:last-child{color:#bbb}.s-price-note{margin-top:18px!important}.s-wardrobe-canvas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 12px;min-height:0;padding:42px 12px 22px}.s-canvas-meta{top:11px;right:12px;left:12px;justify-content:space-between}.s-float{position:static;width:auto;transform:none}.s-float-button>img{width:100%}.s-float-number{top:4px;left:4px}.s-float-label{position:static;width:100%;max-width:none;padding:8px 0 0;border:0;background:transparent;box-shadow:none;opacity:1;transform:none}.s-float-label>span:nth-of-type(2){white-space:normal}.s-issue-rundown{grid-template-columns:1fr}.s-issue-rundown>div,.s-issue-rundown>div+div{padding:18px 0;border-left:0;border-bottom:1px solid var(--line)}.s-issue-rundown>div:last-child{border-bottom:0}}
@media (max-width:560px){.s-root{padding:0 12px}.s-head-meta{gap:12px}.s-head-meta>span{display:none}.s-wardrobe-canvas{gap:24px 10px;padding-right:10px;padding-left:10px}.s-saved{margin-top:60px}.s-saved-list{grid-template-columns:1fr 1fr}.s-drawer-wrap{align-items:flex-end}.s-drawer{width:100%;height:min(88dvh,760px);padding:14px;border-radius:16px 16px 0 0;box-shadow:0 -12px 30px rgba(0,0,0,.14)}.s-drawer h2{font-size:21px}.s-piece-meta{grid-template-columns:1fr}.s-piece-meta span+span{padding:7px 0 0;border-top:1px solid var(--line);border-left:0}.s-piece-actions{grid-template-columns:1fr}.s-piece-editorial{grid-template-columns:1fr}.s-piece-section-head{align-items:flex-start;flex-direction:column}.s-piece-section-head>span{text-align:left}.s-piece-alternative{grid-template-columns:70px minmax(0,1fr) auto;min-height:94px}.s-piece-alternative>img{width:70px;height:94px}.s-ai{padding:17px 14px}.s-ai-chips{display:grid;grid-template-columns:1fr 1fr}.s-ai-chips button{text-align:left}.s-ai-field input{font-size:11px}.s-ai-list .s-used-card{grid-template-columns:62px minmax(0,1fr)}.s-ai-list .s-used-card img{width:62px;height:78px}}
@media (hover:none) and (min-width:721px){.s-float-label{opacity:1;transform:translate(-50%,100%) scale(1)}}
@media (prefers-reduced-motion:reduce){.s-root *{animation:none!important;transition:none!important}}
`;

export { CSS as ISSUE_CSS };
