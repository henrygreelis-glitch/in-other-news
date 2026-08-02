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
  date: "02.08.26",
  theme: "The uniform for the first cold week",
  deck: "Eight pieces selected to work as one. Open any piece to compare the retail listing with live pre-owned options.",
};

const PICKS = [
  {
    slot: "Outer",
    brand: "Kaptain Sunshine",
    item: "Traveller Coat",
    price: "$1,076",
    tag: "Final sale",
    href: "https://www.namu-shop.com/products/kaptain-sunshine-traveller-coat-top-navy-aw25",
    ebayProduct: "kaptain-sunshine-traveller-coat",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=Kaptain+Sunshine+Traveller+Coat+Navy&_sacat=0&LH_ItemCondition=3000",
    img: "/products/traveller-coat.jpg",
    why: "Balmacaan collar, raglan shoulder, cut long enough to cover a jacket. The one coat that works over everything else here.",
  },
  {
    slot: "Layer",
    brand: "Camiel Fortgens",
    item: "Big Shirt",
    price: "$576",
    tag: "1 left",
    href: "https://wdepartment.com/product/camiel-fortgens-big-shirt-blockprint/",
    ebayProduct: "camiel-fortgens-big-shirt",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=Camiel+Fortgens+Big+Shirt+Blockprint&_sacat=0&LH_ItemCondition=3000",
    img: "/products/big-shirt.jpg",
    why: "Cut like a pattern block someone forgot to grade down. Worn open it becomes a light jacket, which is the job in October.",
  },
  {
    slot: "Knit",
    brand: "Beams Plus",
    item: "Shawl Collar Cardigan",
    price: "¥27,500",
    tag: "In stock",
    href: "https://www.beams.co.jp/item/beamsplus/tops/38150255148/",
    ebayProduct: "beams-plus-shawl-cardigan",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=BEAMS+PLUS+Shawl+Collar+Cardigan&_sacat=0&LH_ItemCondition=3000",
    img: "/products/shawl-cardigan.jpg",
    why: "Reads as tailoring from the front and a sweatshirt from behind. Beams cut theirs closer through the body, so it goes under the coat without bulking.",
  },
  {
    slot: "Shirt",
    brand: "Prada",
    item: "Sky Cotton Shirt",
    price: "$1,350",
    tag: "Available",
    href: "https://www.prada.com/us/en/p/cotton-shirt/UCN596_10IV_F0AB7_S_OOO",
    ebayProduct: "prada-sky-cotton-shirt",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=Prada+UCN596+10IV+F0AB7+Cotton+Shirt&_sacat=0&LH_ItemCondition=3000",
    img: "/products/prada-shirt.jpg",
    why: "Straight fit, classic collar, rounded hem, mother-of-pearl buttons. The triangle is the only thing telling you what it cost. Here for the collar roll, not the logo.",
  },
  {
    slot: "Tee",
    brand: "Sunspel",
    item: "Long Sleeve Riviera",
    price: "£160",
    tag: "In stock",
    href: "https://www.sunspel.com/products/mens-cotton-riviera-long-sleeve-polo-shirt-in-black",
    ebayProduct: "sunspel-riviera-long-sleeve",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=Sunspel+Long+Sleeve+Riviera+Polo+Black&_sacat=0&LH_ItemCondition=3000",
    img: "/products/riviera-polo.jpg",
    why: "Mesh knit breathes under the cardigan and holds its shape at the collar after washing, which is the specific way most white tees die.",
  },
  {
    slot: "Trouser",
    brand: "Our Legacy",
    item: "Third Cut",
    price: "€360",
    tag: "In stock",
    href: "https://www.ourlegacy.com/third-cut-black-selvedge",
    ebayProduct: "our-legacy-third-cut",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=Our+Legacy+Third+Cut+Black+Selvedge+Jeans&_sacat=0&LH_ItemCondition=3000",
    img: "/products/third-cut.jpg",
    why: "Black fades warmer than the indigo and holds a crease longer. Japanese sellers publish measurements. American ones publish a tag size and a photo of a floor.",
  },
  {
    slot: "Sock",
    brand: "Anonymous Ism",
    item: "Waffle Crew Sock",
    price: "—",
    tag: "Unavailable",
    href: "https://anonymousism.com/collections/20aw-collection",
    linkLabel: "Find similar ↗",
    ebayProduct: "anonymous-ism-waffle-sock",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=Anonymous+Ism+Waffle+Crew+Socks&_sacat=0&LH_ItemCondition=3000",
    img: "/products/anonymous-socks.jpg",
    why: "Cheapest thing here and the one that changes the fit most. Waffle sits higher and gives you an edge between boot and hem instead of a gap.",
  },
  {
    slot: "Shoe",
    brand: "Hender Scheme",
    item: "Manual Industrial Product 22",
    price: "¥74,800",
    tag: "Check stock",
    href: "https://online.henderscheme.com/item/detail/1_1_mip-22_1",
    ebayProduct: "hender-scheme-mip-22",
    ebaySearchHref:
      "https://www.ebay.com/sch/i.html?_nkw=Hender+Scheme+MIP+22+Natural+Leather&_sacat=0&LH_ItemCondition=3000",
    img: "/products/mip-22.jpg",
    why: "Natural leather that goes from bone to tobacco over two years. You are buying the patina, not the shoe.",
  },
];

function ProductImage({ pick }) {
  const [src, setSrc] = useState(pick.img);

  return (
    <img
      src={src}
      alt={`${pick.brand} ${pick.item}`}
      loading="lazy"
      decoding="async"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  );
}

function formatListingMoney(value, currency) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || !currency) return "Price unavailable";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${value}`;
  }
}

function UsedMarket({ pick, market }) {
  const searchUrl = market.searchUrl || pick.ebaySearchHref;
  const hasExactListings =
    market.status === "ready" &&
    market.matchType === "exact" &&
    market.listings.length > 0;
  const hasSimilarListings =
    market.status === "ready" &&
    market.matchType === "similar" &&
    market.listings.length > 0;
  const hasDisplayListings = hasExactListings || hasSimilarListings;

  return (
    <section className="s-used" aria-labelledby="used-market-title">
      <div className="s-used-kicker">
        <span>Secondhand beta</span>
        <span>eBay</span>
      </div>
      <h3 id="used-market-title">Buy the same piece used</h3>
      <p className="s-used-intro">
        Exact matches first. When none are listed, the closest pre-owned
        alternatives appear.
      </p>

      {market.status === "loading" && (
        <div className="s-used-status" role="status" aria-live="polite">
          <span className="s-used-pulse" aria-hidden="true" />
          Looking for used matches…
        </div>
      )}

      {market.status === "ready" && !hasExactListings && (
        <p className="s-used-status" role="status" aria-live="polite">
          No exact version listed.
        </p>
      )}

      {hasDisplayListings && (
        <>
          <p className="s-used-match" aria-live="polite">
            {hasExactListings
              ? "Exact used matches"
              : "Closest pre-owned alternatives"}
          </p>
          <div className="s-used-list">
            {market.listings.map((listing) => (
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
                  <span className="s-used-card-meta">
                    {listing.condition}
                    {listing.shippingPrice === "0.00"
                      ? " · Free shipping"
                      : listing.shippingPrice
                        ? ` · ${formatListingMoney(
                            listing.shippingPrice,
                            listing.shippingCurrency
                          )} shipping`
                        : ""}
                  </span>
                </span>
                <span className="s-used-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </>
      )}

      {market.status === "error" && (
        <p className="s-used-status" role="status" aria-live="polite">
          {market.message}
        </p>
      )}

      {market.status !== "loading" && (
        <a
          className="s-used-search"
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {hasExactListings
            ? "See all used results ↗"
            : hasSimilarListings
              ? "See more similar pieces ↗"
              : "Search eBay now ↗"}
        </a>
      )}
    </section>
  );
}

function ProductWatch({ pick }) {
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
          product: pick.ebayProduct,
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
              aria-label={`Email address for ${pick.brand} ${pick.item} alerts`}
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

export default function Uniform() {
  const [activeIdx, setActiveIdx] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [savedProductIds, setSavedProductIds] = useState([]);
  const [usedMarket, setUsedMarket] = useState({
    status: "idle",
    listings: [],
    matchType: "none",
    message: "",
    searchUrl: "",
  });
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
    savedProductIds.includes(pick.ebayProduct)
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(
        window.localStorage.getItem("in-other-news:saved-products") || "[]"
      );
      if (Array.isArray(stored)) {
        setSavedProductIds(
          stored.filter((productId) =>
            PICKS.some((pick) => pick.ebayProduct === productId)
          )
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
    if (!activePick?.ebayProduct) {
      setUsedMarket({
        status: "idle",
        listings: [],
        matchType: "none",
        message: "",
        searchUrl: "",
      });
      return undefined;
    }

    const controller = new AbortController();
    setUsedMarket({
      status: "loading",
      listings: [],
      matchType: "none",
      message: "",
      searchUrl: activePick.ebaySearchHref,
    });

    fetch(`/api/ebay/search?product=${activePick.ebayProduct}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
      })
      .then((data) => {
        setUsedMarket({
          status: "ready",
          listings: data.listings || [],
          matchType: data.matchType || "none",
          message: data.message || "",
          searchUrl: data.searchUrl || activePick.ebaySearchHref,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setUsedMarket({
          status: "error",
          listings: [],
          matchType: "none",
          message: "Live matches are unavailable. Search eBay directly.",
          searchUrl: activePick.ebaySearchHref,
        });
      });

    return () => controller.abort();
  }, [activePick?.ebayProduct, activePick?.ebaySearchHref]);

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
        <span>{MASTHEAD.title}</span>
        <div className="s-head-meta">
          <span>{MASTHEAD.issue} &nbsp; {MASTHEAD.date}</span>
          <button type="button" onClick={scrollToSaved}>
            Saved {savedPicks.length}
          </button>
        </div>
      </header>

      <div className="s-open">
        <div className="s-open-copy">
          <p className="s-eyebrow">This week’s uniform</p>
          <h1>{MASTHEAD.theme}</h1>
          <p className="s-deck">{MASTHEAD.deck}</p>
        </div>
        <span className="s-n">{PICKS.length} pieces &nbsp; 4 currencies</span>
      </div>

      <ol className="s-flow" aria-label="How each weekly issue works">
        <li><span>01</span>Discover the look</li>
        <li><span>02</span>Compare options</li>
        <li><span>03</span>Save a piece</li>
        <li><span>04</span>Add a watch</li>
        <li><span>05</span>Return Sunday</li>
      </ol>

      <main className="s-grid">
        {PICKS.map((pick, index) => (
          <article className="s-tile" key={pick.brand + pick.item}>
            <p className="s-slot">{pick.slot}</p>
            <div className="s-media">
              <button
                className="s-shot"
                onClick={(event) => openProduct(event, index)}
                aria-haspopup="dialog"
                aria-label={`Open details for ${pick.brand} ${pick.item}`}
              >
                <ProductImage pick={pick} />
              </button>
              <button
                className={`s-save ${
                  savedProductIds.includes(pick.ebayProduct) ? "is-saved" : ""
                }`}
                type="button"
                aria-pressed={savedProductIds.includes(pick.ebayProduct)}
                onClick={() => toggleSaved(pick.ebayProduct)}
              >
                {savedProductIds.includes(pick.ebayProduct)
                  ? "Saved ✓"
                  : "Save +"}
              </button>
            </div>
            <div className="s-cap">
              <p className="s-brand">{pick.brand}</p>
              <p className="s-item">{pick.item}</p>
              <p className="s-line">
                <span>{pick.price}</span>
                <span className="s-tag">{pick.tag}</span>
              </p>
              <a
                className="s-shop"
                href={pick.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${pick.linkLabel || "View item"}: ${pick.brand} ${pick.item} (opens in a new tab)`}
              >
                {pick.linkLabel || "View item ↗"}
              </a>
              {pick.ebayProduct && (
                <span className="s-used-flag">Check pre-owned availability</span>
              )}
            </div>
          </article>
        ))}
      </main>

      <section className="s-saved" id="saved-pieces" aria-labelledby="saved-title">
        <div className="s-saved-head">
          <div>
            <p className="s-eyebrow">Your edit</p>
            <h2 id="saved-title">Saved from Uniform 01</h2>
          </div>
          <span>{savedPicks.length} saved</span>
        </div>
        {savedPicks.length ? (
          <div className="s-saved-list">
            {savedPicks.map((pick) => {
              const index = PICKS.findIndex(
                (candidate) => candidate.ebayProduct === pick.ebayProduct
              );
              return (
                <button
                  type="button"
                  className="s-saved-item"
                  key={pick.ebayProduct}
                  onClick={(event) => openProduct(event, index)}
                >
                  <span>{pick.slot}</span>
                  <strong>{pick.brand}</strong>
                  <small>{pick.item}</small>
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
            <ProductImage key={activePick.img} pick={activePick} />
            <div className="s-drawer-copy">
              <p className="s-slot">{activePick.slot}</p>
              <p className="s-drawer-brand">{activePick.brand}</p>
              <h2 id="product-drawer-title">{activePick.item}</h2>
              <div className="s-drawer-meta">
                <span>{activePick.price}</span>
                <span className="s-tag">{activePick.tag}</span>
              </div>
              <p id="product-drawer-description" className="s-drawer-why">
                {activePick.why}
              </p>
              <a
                className="s-drawer-link"
                href={activePick.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activePick.linkLabel || "View item ↗"}
              </a>
              {activePick.ebayProduct && (
                <UsedMarket pick={activePick} market={usedMarket} />
              )}
              <button
                className="s-drawer-save"
                type="button"
                aria-pressed={savedProductIds.includes(activePick.ebayProduct)}
                onClick={() => toggleSaved(activePick.ebayProduct)}
              >
                {savedProductIds.includes(activePick.ebayProduct)
                  ? "Saved to your edit ✓"
                  : "Save to your edit +"}
              </button>
              <ProductWatch key={activePick.ebayProduct} pick={activePick} />
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
        <span>{MASTHEAD.title} &nbsp; {MASTHEAD.issue}</span>
        <span>Some links earn a commission</span>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&display=swap');
.s-root{--fg:#000;--mid:#767676;--line:#e4e4e4;--plate:#f1f1f1;--f:'Archivo',Helvetica,Arial,sans-serif;width:100%;max-width:1600px;margin:0 auto;background:#fff;color:var(--fg);font-family:var(--f);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;padding:0 16px}
.s-root *{box-sizing:border-box}.s-root h1,.s-root h2,.s-root p{margin:0}.s-root h1{font-weight:400}.s-root button:focus-visible,.s-root input:focus-visible,.s-root a:focus-visible{outline:1px solid var(--fg);outline-offset:2px}
.s-head{display:flex;justify-content:space-between;align-items:center;padding:18px 0;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-head-meta{display:flex;align-items:center;gap:22px}.s-head-meta button{padding:0 0 2px;border:0;border-bottom:1px solid var(--fg);background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-head-meta button:hover{color:var(--mid);border-color:var(--mid)}
.s-open{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;padding:56px 0 36px}.s-open-copy{max-width:700px}.s-eyebrow{color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}.s-open h1{margin-top:10px;font-size:clamp(28px,4vw,52px);font-weight:600;line-height:1.02;letter-spacing:-.03em;max-width:17ch}.s-deck{max-width:62ch;margin-top:17px!important;color:#4c4c4c;font-size:12px;line-height:1.65}
.s-n{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mid);flex:none}
.s-flow{display:grid;grid-template-columns:repeat(5,minmax(145px,1fr));margin:0 0 48px;padding:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);list-style:none;overflow-x:auto}.s-flow li{display:flex;flex-direction:column;min-height:74px;padding:13px 16px 12px 0;color:#333;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase}.s-flow li+li{padding-left:16px;border-left:1px solid var(--line)}.s-flow span{margin-bottom:auto;color:var(--mid);font-size:9px}
.s-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:34px 16px}.s-tile{display:flex;flex-direction:column}.s-slot{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);padding-bottom:8px}.s-media{position:relative}
.s-shot{position:relative;display:block;width:100%;padding:0;border:0;background:var(--plate);cursor:pointer;text-align:left;overflow:hidden}.s-shot img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.s-save{position:absolute;right:8px;bottom:8px;z-index:2;padding:6px 8px;border:1px solid rgba(0,0,0,.15);background:rgba(255,255,255,.92);color:var(--fg);cursor:pointer;font-family:var(--f);font-size:8.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(6px)}.s-save:hover,.s-save.is-saved{background:var(--fg);color:#fff;border-color:var(--fg)}
.s-cap{padding-top:10px}.s-brand{font-size:12.5px;font-weight:600}.s-item{font-size:12.5px;color:var(--mid);margin-top:1px}.s-line{display:flex;justify-content:space-between;gap:10px;margin-top:6px;font-size:12.5px}.s-tag{font-size:10px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--mid)}
.s-shop{display:inline-block;margin-top:10px;color:var(--fg);font-size:10px;font-weight:500;letter-spacing:.1em;line-height:1.4;text-decoration:none;text-transform:uppercase;border-bottom:1px solid var(--fg)}.s-shop:hover{color:var(--mid);border-color:var(--mid)}.s-shop:focus-visible{outline:1px solid var(--fg);outline-offset:3px}
.s-used-flag{display:block;margin-top:7px;color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}
.s-drawer-wrap{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.28);display:flex;justify-content:flex-end}
.s-drawer{width:min(430px,92vw);height:100%;overflow-y:auto;background:#fff;box-shadow:-12px 0 30px rgba(0,0,0,.12);padding:18px}
.s-drawer-close{display:block;margin:0 0 18px auto;padding:0;border:0;background:transparent;font-family:var(--f);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
.s-drawer>img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:var(--plate)}
.s-drawer-copy{padding:22px 2px 32px}.s-drawer-copy .s-slot{padding-bottom:12px}.s-drawer-brand{font-size:13px;font-weight:600}.s-drawer h2{margin:2px 0 0;font-size:24px;font-weight:500;line-height:1.1;letter-spacing:-.02em}
.s-drawer-meta{display:flex;justify-content:space-between;gap:16px;margin-top:18px;padding:12px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.s-drawer-why{margin-top:22px!important;font-size:13px;line-height:1.65;color:#333}.s-drawer-link{display:block;margin-top:28px;padding:13px 14px;background:var(--fg);color:#fff;text-align:center;text-decoration:none;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-drawer-link:hover{background:#333}
.s-used{margin-top:30px;padding-top:24px;border-top:1px solid var(--line)}.s-used-kicker{display:flex;justify-content:space-between;gap:16px;color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}.s-used h3{margin:9px 0 0;font-size:18px;font-weight:500;line-height:1.2;letter-spacing:-.01em}.s-used-intro{margin-top:8px!important;color:#555;font-size:11.5px;line-height:1.55}.s-used-status{display:flex;align-items:center;gap:8px;margin-top:16px!important;padding:13px;background:#f5f5f3;color:#555;font-size:11px;line-height:1.4}.s-used-pulse{width:7px;height:7px;border-radius:50%;background:#111;animation:s-used-pulse 1.25s ease-in-out infinite}.s-used-match{margin-top:17px!important;color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-used-list{display:grid;gap:8px;margin-top:9px}.s-used-card{position:relative;display:grid;grid-template-columns:70px minmax(0,1fr);gap:11px;min-height:86px;padding:8px 28px 8px 8px;border:1px solid var(--line);color:var(--fg);text-decoration:none}.s-used-card:hover{border-color:#999}.s-used-card img{width:70px;height:86px;object-fit:cover;background:var(--plate)}.s-used-card-copy{display:flex;min-width:0;flex-direction:column;align-items:flex-start}.s-used-card-copy strong{display:-webkit-box;overflow:hidden;font-size:11px;font-weight:500;line-height:1.35;-webkit-box-orient:vertical;-webkit-line-clamp:2}.s-used-card-price{margin-top:auto;font-size:12px;font-weight:600}.s-used-card-meta{margin-top:1px;color:var(--mid);font-size:9.5px;line-height:1.35}.s-used-arrow{position:absolute;top:8px;right:9px;font-size:11px}.s-used-search{display:inline-block;margin-top:14px;border-bottom:1px solid var(--fg);color:var(--fg);font-size:9.5px;font-weight:500;letter-spacing:.1em;line-height:1.4;text-decoration:none;text-transform:uppercase}.s-used-search:hover{color:var(--mid);border-color:var(--mid)}
.s-drawer-save{display:block;width:100%;margin-top:18px;padding:12px 14px;border:1px solid var(--fg);background:#fff;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:9.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-drawer-save:hover,.s-drawer-save[aria-pressed="true"]{background:#f2f2ef}
.s-watch{margin-top:30px;padding-top:24px;border-top:1px solid var(--line)}.s-watch h3{margin:9px 0 0;font-size:18px;font-weight:500;line-height:1.2;letter-spacing:-.01em}.s-watch-intro{margin-top:8px!important;color:#555;font-size:11.5px;line-height:1.55}.s-watch-field{display:flex;margin-top:16px;border-bottom:1px solid var(--fg)}.s-watch-field input{flex:1;min-width:0;padding:0 0 8px;border:0;background:transparent;color:var(--fg);font-family:var(--f);font-size:12px}.s-watch-field button{padding:0 0 8px;border:0;background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.s-watch-field button:disabled,.s-watch-field input:disabled{cursor:wait;opacity:.55}.s-watch-success{margin-top:16px!important;padding:13px;background:#f2f2ef;font-size:11px!important}.s-watch-error{margin-top:9px!important;color:#9c1c13;font-size:10.5px!important}
.s-saved{scroll-margin-top:20px;margin-top:80px;padding:30px 0;border-top:1px solid var(--fg);border-bottom:1px solid var(--line)}.s-saved-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}.s-saved-head h2{margin-top:5px;font-size:22px;font-weight:500;letter-spacing:-.02em}.s-saved-head>span{color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-saved-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:22px}.s-saved-item{position:relative;display:flex;min-width:0;flex-direction:column;align-items:flex-start;padding:13px 34px 13px 13px;border:1px solid var(--line);background:#fff;color:var(--fg);cursor:pointer;text-align:left}.s-saved-item:hover{border-color:#999}.s-saved-item span{color:var(--mid);font-size:8.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-saved-item strong{margin-top:8px;font-size:11px;font-weight:600}.s-saved-item small{overflow:hidden;width:100%;color:var(--mid);font-size:10.5px;text-overflow:ellipsis;white-space:nowrap}.s-saved-item b{position:absolute;right:13px;top:50%;font-size:12px;font-weight:400;transform:translateY(-50%)}.s-saved-empty{margin-top:20px!important;color:var(--mid);font-size:11.5px!important}
.s-sub{margin-top:80px;padding:44px 0;border-top:1px solid var(--line)}.s-sub p{font-size:13px}.s-field{display:flex;margin-top:18px;border-bottom:1px solid var(--fg);max-width:380px}.s-field input{flex:1;min-width:0;border:0;background:transparent;font-family:var(--f);font-size:13px;color:var(--fg);padding:0 0 8px}.s-field input::placeholder{color:var(--mid)}.s-field button{border:0;background:transparent;cursor:pointer;padding:0 0 8px;font-family:var(--f);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-field button:hover{color:var(--mid)}.s-field button:disabled,.s-field input:disabled{cursor:wait;opacity:.55}.s-sub-success{font-weight:500}.s-sub-error{margin-top:10px!important;color:#9c1c13;font-size:11px!important}
.s-foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px 0;border-top:1px solid var(--line);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mid)}
@keyframes s-used-pulse{0%,100%{opacity:.25}50%{opacity:1}}
@media (max-width:560px){.s-root{padding:0 12px}.s-head-meta{gap:12px}.s-head-meta>span{display:none}.s-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 12px}.s-open{padding:36px 0 28px;flex-direction:column;align-items:flex-start;gap:16px}.s-flow{margin-bottom:32px}.s-save{right:6px;bottom:6px;padding:5px 6px;font-size:7.5px}.s-saved{margin-top:60px}.s-saved-list{grid-template-columns:1fr 1fr}.s-drawer-wrap{align-items:flex-end}.s-drawer{width:100%;height:min(88dvh,760px);padding:14px;border-radius:16px 16px 0 0;box-shadow:0 -12px 30px rgba(0,0,0,.14)}.s-drawer>img{aspect-ratio:16/10;object-fit:contain}.s-drawer h2{font-size:21px}}
@media (prefers-reduced-motion:reduce){.s-root *{animation:none!important;transition:none!important}}
`;
