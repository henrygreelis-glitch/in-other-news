"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ISSUE_CSS,
  PICKS,
  ProductImage,
  ProductWatch,
  USD_PRICE_NOTE,
  formatListingMoney,
} from "./issue";

const SOURCE_LABELS = {
  retail: "Retail",
  resale: "Resale",
  archive: "Archive",
};

const RELATIONSHIP_LABELS = {
  same_product_cheaper: "Same product · lower price",
  same_product_used: "Same product · pre-owned",
  same_product_new: "Same product · new",
  similar_silhouette: "Close alternative",
  archive_reference: "Archive reference",
  budget_alternative: "Lower-price alternative",
};

function grailedSearchUrl(brand, item) {
  return `https://www.grailed.com/shop?query=${encodeURIComponent(`${brand} ${item}`)}`;
}

function retailerSearchUrl(brand, item) {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(`${brand} ${item}`)}`;
}

export default function ProductSearch({ productKey }) {
  const pick = PICKS.find(
    (candidate) =>
      candidate.id === productKey || candidate.legacy_ids?.includes(productKey)
  );
  const [market, setMarket] = useState({
    status: "idle",
    listings: [],
    matchType: "none",
    message: "",
    searchUrl: "",
  });
  const [activeOption, setActiveOption] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const quickViewRef = useRef(null);
  const optionOpenerRef = useRef(null);

  function openOption(option, event) {
    optionOpenerRef.current = event.currentTarget;
    setActiveImageIndex(0);
    setActiveOption(option);
  }

  function closeOption() {
    setActiveOption(null);
    requestAnimationFrame(() => optionOpenerRef.current?.focus());
  }

  useEffect(() => {
    if (!pick?.id) return undefined;

    const controller = new AbortController();
    setMarket({
      status: "loading",
      listings: [],
      matchType: "none",
      message: "",
      searchUrl: pick.ebay_search_href,
    });

    fetch(`/api/ebay/search?product=${pick.id}&catalog=issue-01-v15`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
      })
      .then((data) => {
        setMarket({
          status: "ready",
          listings: data.listings || [],
          matchType: data.matchType || "none",
          message: data.message || "",
          searchUrl: data.searchUrl || pick.ebay_search_href,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setMarket({
          status: "error",
          listings: [],
          matchType: "none",
          message: "Live matches are unavailable right now.",
          searchUrl: pick.ebay_search_href,
        });
      });

    return () => controller.abort();
  }, [pick?.id, pick?.ebay_search_href]);

  useEffect(() => {
    if (!activeOption) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      quickViewRef.current?.querySelector("button")?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeOption();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeOption]);

  if (!pick) {
    return (
      <div className="s-root search-root">
        <style>{ISSUE_CSS + SEARCH_CSS}</style>
        <header className="search-head">
          <a className="search-wordmark" href="/in-other-news">In Other News</a>
          <span>Issue 01</span>
          <a className="search-back" href="/in-other-news">← Back to issue</a>
        </header>
        <main className="search-missing">
          <p className="s-eyebrow">Product not found</p>
          <h1>That piece is not in this week’s issue.</h1>
          <a href="/in-other-news">← Back to Issue 01</a>
        </main>
      </div>
    );
  }

  const hero = pick.hero;
  const liveOptions = market.listings.map((listing) => ({
    id: `ebay-${listing.id}`,
    source: "eBay",
    item: listing.title,
    price: formatListingMoney(listing.price, listing.currency),
    condition: listing.condition || "Pre-owned",
    sizes_available: listing.size || "Check listing",
    shipping:
      listing.shippingPrice && listing.shippingCurrency
        ? formatListingMoney(listing.shippingPrice, listing.shippingCurrency)
        : "Check listing",
    relationship:
      listing.matchType === "exact"
        ? /^new\b/i.test(listing.condition || "")
          ? "same_product_new"
          : "same_product_used"
        : "similar_silhouette",
    href: listing.url,
    image: listing.imageUrl || hero.image,
    images: listing.imageUrls?.length
      ? listing.imageUrls
      : [listing.imageUrl || hero.image],
    seller: listing.seller,
    location: listing.location,
    returns: listing.returns,
    availability: listing.availability || "Available",
  }));
  const curatedOptions = pick.alternatives.map((alternative) => ({
    ...alternative,
    source: alternative.source || SOURCE_LABELS[alternative.source_type],
  }));
  const buyingOptions = [...liveOptions, ...curatedOptions];
  const activeOptionIndex = activeOption
    ? buyingOptions.findIndex((option) => option.id === activeOption.id)
    : -1;

  function browseOption(direction) {
    if (activeOptionIndex < 0 || buyingOptions.length < 2) return;
    const nextIndex =
      (activeOptionIndex + direction + buyingOptions.length) % buyingOptions.length;
    setActiveImageIndex(0);
    setActiveOption(buyingOptions[nextIndex]);
  }

  const activeImages = activeOption
    ? (activeOption.images?.length
        ? activeOption.images
        : [activeOption.image || hero.image]
      ).filter(Boolean)
    : [];

  const optionStatus =
    market.status === "loading"
      ? "Searching eBay…"
      : buyingOptions.length
        ? `${buyingOptions.length} option${buyingOptions.length === 1 ? "" : "s"}`
        : "No live listings";

  return (
    <div className="s-root search-root">
      <style>{ISSUE_CSS + SEARCH_CSS}</style>

      <header className="search-head">
        <a className="search-wordmark" href="/in-other-news">In Other News</a>
        <span>Issue 01 · Product</span>
        <a className="search-back" href="/in-other-news">← Back to issue</a>
      </header>

      <main className="compare-main">
        <section className="compare-intro">
          <div>
            <p className="s-eyebrow">Issue 01 · Buying options</p>
            <h1>Compare ways to buy.</h1>
          </div>
          <p>
            Start with Henry’s selected listing, then browse live buying options
            and nearby alternatives without leaving this page.
          </p>
        </section>

        <section className="compare-selected" aria-labelledby="search-product-title">
          <div
            className="compare-selected-visual"
            aria-label={`${hero.brand} ${hero.item} product image`}
          >
            <ProductImage pick={pick} />
          </div>
          <div className="compare-selected-copy">
            <div className="compare-kicker">
              <span>Henry’s selected listing</span>
              <span>{SOURCE_LABELS[hero.source_type]}</span>
            </div>
            <p className="compare-brand">{hero.brand}</p>
            <h2 id="search-product-title">{hero.item}</h2>
            <div className="compare-price">
              <strong>{hero.price}</strong>
              <span>{hero.status}</span>
            </div>
            <p className="compare-reason">{pick.why_selected}</p>
            <dl className="compare-facts">
              <div>
                <dt>Source</dt>
                <dd>{hero.source}</dd>
              </div>
              <div>
                <dt>Condition</dt>
                <dd>{hero.condition}</dd>
              </div>
              <div>
                <dt>Sizes</dt>
                <dd>{hero.sizes_available}</dd>
              </div>
            </dl>
            <p className="compare-source-note">
              <strong>Why this source — </strong>
              {pick.why_this_source}
            </p>
            <a
              className="compare-primary"
              href={hero.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hero.link_label || "View selected listing ↗"}
            </a>
            <nav className="compare-search-elsewhere" aria-label="Search elsewhere">
              <span>Search elsewhere</span>
              <div>
                <a
                  href={market.searchUrl || pick.ebay_search_href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  eBay ↗
                </a>
                <a
                  href={grailedSearchUrl(hero.brand, hero.item)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Grailed ↗
                </a>
                <a
                  href={retailerSearchUrl(hero.brand, hero.item)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop other retailers ↗
                </a>
              </div>
            </nav>
          </div>
        </section>

        <section className="compare-options" aria-labelledby="compare-options-title">
          <div className="compare-section-head">
            <div>
              <p className="s-eyebrow">On-site marketplace</p>
              <h2 id="compare-options-title">Browse buying options</h2>
            </div>
            <span>{optionStatus}</span>
          </div>

          {market.status === "loading" && (
            <p className="compare-state" role="status" aria-live="polite">
              Searching eBay for live listings…
            </p>
          )}

          {market.status === "ready" && market.matchType === "similar" && (
            <p className="compare-state" role="status" aria-live="polite">
              No exact version listed. Showing nearby options so you can compare
              condition, size, and price.
            </p>
          )}

          {market.status === "ready" && market.matchType === "none" && (
            <p className="compare-state" role="status" aria-live="polite">
              {market.message || "No strong matches are available right now."}
              {pick.alternatives.length > 0
                ? " Henry’s approved alternatives are still shown below."
                : " Save the search and check again later."}
            </p>
          )}

          {market.status === "error" && (
            <p className="compare-state" role="status">
              {market.message} Curated options are still available below.
            </p>
          )}

          {buyingOptions.length > 0 ? (
            <div className="compare-grid">
              {buyingOptions.map((option) => (
                <article
                  className="compare-card"
                  key={option.id}
                >
                  <button
                    className="compare-card-hit"
                    type="button"
                    aria-label={`View ${option.item} listing details`}
                    onClick={(event) => openOption(option, event)}
                  />
                  <div className="compare-card-image">
                    <img
                      src={option.image || hero.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = hero.image;
                      }}
                    />
                  </div>
                  <div className="compare-card-copy">
                    <div className="compare-card-kicker">
                      <span>
                        {RELATIONSHIP_LABELS[option.relationship] || "Buying option"}
                      </span>
                      <span>View</span>
                    </div>
                    <p>{option.source}</p>
                    <h3>{option.item}</h3>
                    <dl>
                      <div>
                        <dt>Price</dt>
                        <dd>{option.price}</dd>
                      </div>
                      <div>
                        <dt>Condition</dt>
                        <dd>{option.condition}</dd>
                      </div>
                      <div>
                        <dt>Sizes</dt>
                        <dd>{option.sizes_available || "Check listing"}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          ) : market.status !== "loading" ? (
            <p className="compare-empty">
              Nothing useful is listed through the live feed right now. Search
              the wider marketplaces below for new arrivals.
            </p>
          ) : null}

          {buyingOptions.length > 0 && (
            <div className="compare-browse-footer">
              <p>
                Showing all <strong>{buyingOptions.length}</strong> options
              </p>
              <span>All current options shown</span>
            </div>
          )}
        </section>

        <section className="compare-alert" aria-label="Price alert">
          <div>
            <p className="s-eyebrow">Not ready to buy?</p>
            <h2>Watch this piece.</h2>
            <p>Save the search and come back when the right size or price appears.</p>
          </div>
          <ProductWatch key={`watch-${pick.id}`} pick={pick} />
        </section>

        <p className="compare-price-note">{USD_PRICE_NOTE}</p>
      </main>

      {activeOption && (
        <div className="compare-quick-wrap" onMouseDown={closeOption}>
          <aside
            ref={quickViewRef}
            className="compare-quick"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-quick-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="compare-quick-close"
              type="button"
              onClick={closeOption}
            >
              Close ×
            </button>
            <div className="compare-quick-image">
              <img
                src={activeImages[activeImageIndex] || activeOption.image || hero.image}
                alt={`${activeOption.item} listing photo ${activeImageIndex + 1}`}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = hero.image;
                }}
              />
            </div>
            {activeImages.length > 1 && (
              <div className="compare-quick-thumbs" aria-label="Listing photos">
                {activeImages.map((image, index) => (
                  <button
                    className={index === activeImageIndex ? "is-active" : ""}
                    type="button"
                    aria-label={`Show listing photo ${index + 1}`}
                    aria-pressed={index === activeImageIndex}
                    onClick={() => setActiveImageIndex(index)}
                    key={image}
                  >
                    <img src={image} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            <div className="compare-quick-copy">
              <div className="compare-quick-nav">
                <button
                  type="button"
                  onClick={() => browseOption(-1)}
                  disabled={buyingOptions.length < 2}
                >
                  ← Previous
                </button>
                <span>
                  {activeOptionIndex + 1} of {buyingOptions.length}
                </span>
                <button
                  type="button"
                  onClick={() => browseOption(1)}
                  disabled={buyingOptions.length < 2}
                >
                  Next →
                </button>
              </div>
              <div className="compare-quick-kicker">
                <span>
                  {RELATIONSHIP_LABELS[activeOption.relationship] || "Buying option"}
                </span>
                <span>
                  {activeOption.source}
                  {activeOption.availability ? ` · ${activeOption.availability}` : ""}
                </span>
              </div>
              <h2 id="compare-quick-title">{activeOption.item}</h2>
              <dl className="compare-quick-facts">
                <div>
                  <dt>Price</dt>
                  <dd>{activeOption.price}</dd>
                </div>
                <div>
                  <dt>Condition</dt>
                  <dd>{activeOption.condition}</dd>
                </div>
                <div>
                  <dt>Sizes</dt>
                  <dd>{activeOption.sizes_available || "Check listing"}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd>{activeOption.shipping || "Check listing"}</dd>
                </div>
                {activeOption.seller && (
                  <div>
                    <dt>Seller</dt>
                    <dd>{activeOption.seller}</dd>
                  </div>
                )}
                {activeOption.location && (
                  <div>
                    <dt>Ships from</dt>
                    <dd>{activeOption.location}</dd>
                  </div>
                )}
                {activeOption.returns && (
                  <div>
                    <dt>Returns</dt>
                    <dd>{activeOption.returns}</dd>
                  </div>
                )}
              </dl>
              <p className="compare-quick-note">
                Browse the listing photos and details here first. Final price and
                availability are confirmed on {activeOption.source} when you are ready.
              </p>
              <a
                className="compare-quick-primary"
                href={activeOption.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on {activeOption.source} ↗
              </a>
              <button
                className="compare-quick-back"
                type="button"
                onClick={closeOption}
              >
                Keep comparing
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

const SEARCH_CSS = `
.search-root{max-width:none;min-height:100vh;padding:0 24px;background:#fff}
.search-head{position:relative;z-index:5;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;min-height:58px;border-bottom:1px solid var(--line);font-size:9px;font-weight:600;letter-spacing:.11em;text-transform:uppercase}
.search-head a{width:max-content;color:var(--fg);text-decoration:none}.search-head a:hover{color:var(--mid)}.search-wordmark{font-size:11px}.search-back{justify-self:end}
.search-pdp{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(340px,.75fr);min-height:calc(100vh - 58px);margin:0 -24px}
.search-visual{position:sticky;top:0;display:flex;height:calc(100vh - 58px);min-height:620px;align-items:center;justify-content:center;overflow:hidden;background:var(--plate)}
.search-visual img{display:block;width:100%;height:100%;padding:clamp(26px,5vw,80px);object-fit:contain;object-position:center}
.search-buy{min-width:0;border-left:1px solid var(--line);background:#fff}
.search-buy-inner{width:100%;max-width:480px;margin:0 auto;padding:clamp(42px,6vw,88px) clamp(28px,4vw,58px) 48px}
.search-kicker{display:flex;justify-content:space-between;gap:20px;color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
.search-brand{margin-top:40px!important;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.search-buy h1{max-width:15ch;margin:5px 0 0;font-size:clamp(30px,3.2vw,48px);font-weight:600;line-height:.98;letter-spacing:-.04em}
.search-price{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:20px;padding-bottom:18px;border-bottom:1px solid var(--fg);font-size:12px}.search-price strong{font-weight:600}.search-price span{color:var(--mid);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}
.search-reason{margin-top:22px!important;color:#333;font-size:12px;line-height:1.65}
.search-facts{display:grid;grid-template-columns:1fr 1fr;margin:22px 0 0;padding:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.search-facts div{padding:11px 0}.search-facts div+div{padding-left:14px;border-left:1px solid var(--line)}.search-facts dt{color:var(--mid);font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.search-facts dd{margin:3px 0 0;font-size:10.5px}
.search-primary{display:flex;min-height:50px;align-items:center;justify-content:center;margin-top:22px;padding:13px 16px;background:var(--fg);color:#fff;font-size:9.5px;font-weight:600;letter-spacing:.1em;text-align:center;text-decoration:none;text-transform:uppercase}.search-primary:hover{background:#333}.search-primary:focus-visible{outline:2px solid var(--fg);outline-offset:3px}
.search-accordions{margin-top:22px;border-bottom:1px solid var(--fg)}.search-accordion{border-top:1px solid var(--fg)}.search-accordion summary{display:grid;grid-template-columns:minmax(0,1fr) auto 12px;align-items:center;gap:12px;padding:16px 0;cursor:pointer;list-style:none;font-size:9.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase}.search-accordion summary::-webkit-details-marker{display:none}.search-accordion summary::after{content:'+';font-size:15px;font-weight:400;line-height:1}.search-accordion[open] summary::after{content:'−'}.search-accordion summary small{color:var(--mid);font-size:7.5px;font-weight:600;letter-spacing:.09em}.search-accordion.is-buying summary{background:#f5f2e9;margin:0 -10px;padding-right:10px;padding-left:10px}
.search-accordion-body{padding:2px 0 20px}.search-state{padding:11px;background:#f4f4f1;color:#555;font-size:10px!important;line-height:1.5}
.search-options-list{display:grid;gap:7px;margin-top:8px}.search-option{display:grid;grid-template-columns:62px minmax(0,1fr) 12px;gap:10px;min-height:82px;padding:7px;border:1px solid var(--line);color:var(--fg);text-decoration:none}.search-option:hover{border-color:#888}.search-option img{display:block;width:62px;height:78px;object-fit:cover;background:var(--plate)}.search-option>span{display:flex;min-width:0;flex-direction:column}.search-option small{color:var(--mid);font-size:7.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase}.search-option strong{display:-webkit-box;overflow:hidden;margin-top:3px;font-size:10px;font-weight:500;line-height:1.35;-webkit-box-orient:vertical;-webkit-line-clamp:2}.search-option b{margin-top:auto;font-size:10px}.search-option i{font-size:10px;font-style:normal}
.search-market-links{display:flex;flex-wrap:wrap;gap:14px;margin-top:14px}.search-market-links a{border-bottom:1px solid var(--fg);color:var(--fg);font-size:8.5px;font-weight:600;letter-spacing:.08em;text-decoration:none;text-transform:uppercase}.search-market-links a:hover{color:var(--mid);border-color:var(--mid)}
.search-note p{color:#3d3d3d;font-size:11px;line-height:1.65}.search-tool-body>.s-ai{margin:0;padding:16px;border:0;background:#f5f2e9}.search-tool-body>.s-ai h3{font-size:19px}.search-tool-body>.s-watch{margin:0;padding:3px 0 4px;border-top:0}.search-tool-body>.s-watch h3{font-size:17px}
.search-price-note{margin-top:18px!important;color:var(--mid);font-size:7.5px!important;font-weight:500;letter-spacing:.08em;line-height:1.5;text-transform:uppercase}
.search-missing{max-width:760px;margin:0 auto;padding:15vh 0}.search-missing h1{max-width:16ch;margin-top:10px;font-size:clamp(34px,6vw,64px);font-weight:600;line-height:1;letter-spacing:-.04em}.search-missing a{display:inline-block;margin-top:28px;border-bottom:1px solid var(--fg);color:var(--fg);font-size:10px;font-weight:500;letter-spacing:.1em;text-decoration:none;text-transform:uppercase}
@media (max-width:920px){.search-pdp{grid-template-columns:minmax(0,1fr) minmax(320px,420px)}.search-visual{min-height:560px}.search-visual img{padding:32px}.search-buy-inner{padding:42px 26px}.search-buy h1{font-size:34px}}
@media (max-width:720px){.search-root{padding:0 12px}.search-head{grid-template-columns:1fr auto;min-height:52px}.search-head>span{display:none}.search-pdp{grid-template-columns:1fr;margin:0 -12px}.search-visual{position:static;width:100%;height:auto;min-height:0;aspect-ratio:4/5}.search-visual img{padding:18px}.search-buy{border-top:1px solid var(--line);border-left:0}.search-buy-inner{max-width:none;padding:30px 14px 42px}.search-brand{margin-top:26px!important}.search-buy h1{font-size:32px}.search-reason{font-size:11.5px}.search-accordion summary{padding:15px 0}.search-option{grid-template-columns:58px minmax(0,1fr) 12px}.search-option img{width:58px;height:74px}}
.compare-main{width:100%;max-width:1320px;margin:0 auto;padding:clamp(28px,4vw,56px) 0 40px}.compare-intro{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);align-items:end;gap:clamp(28px,5vw,80px);padding-bottom:clamp(24px,3vw,38px)}.compare-intro h1{max-width:12ch;margin:8px 0 0;font-size:clamp(42px,5.5vw,72px);font-weight:600;line-height:.9;letter-spacing:-.055em}.compare-intro>p{max-width:45ch;color:#444;font-size:12px;line-height:1.7}
.compare-selected{display:grid;grid-template-columns:minmax(320px,.9fr) minmax(0,1.1fr);border:1px solid var(--line);background:#fff}.compare-selected-visual{display:flex;min-height:420px;align-items:center;justify-content:center;background:var(--surface)}.compare-selected-visual img{display:block;width:100%;height:100%;max-height:520px;padding:clamp(24px,4vw,50px);object-fit:contain}.compare-selected-copy{display:flex;min-width:0;flex-direction:column;padding:clamp(28px,4vw,50px)}.compare-kicker{display:flex;justify-content:space-between;gap:20px;color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.11em;text-transform:uppercase}.compare-brand{margin-top:28px!important;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}.compare-selected h2{max-width:15ch;margin:4px 0 0;font-size:clamp(32px,4vw,54px);font-weight:600;line-height:.96;letter-spacing:-.045em}.compare-price{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:18px;padding:11px 0;border-top:1px solid var(--fg);border-bottom:1px solid var(--line)}.compare-price strong{font-size:13px}.compare-price span{color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase}.compare-reason{max-width:56ch;margin-top:16px!important;color:#333;font-size:11.5px;line-height:1.6}.compare-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:16px 0 0;padding:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.compare-facts div{min-width:0;padding:9px 8px 10px 0}.compare-facts div+div{padding-left:10px;border-left:1px solid var(--line)}.compare-facts dt,.compare-card dt{color:var(--mid);font-size:7.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase}.compare-facts dd,.compare-card dd{overflow:hidden;margin:2px 0 0;font-size:9.5px;text-overflow:ellipsis;white-space:nowrap}.compare-source-note{margin-top:14px!important;color:#555;font-size:10.5px;line-height:1.55}.compare-source-note strong{color:#222}.compare-primary{display:flex;min-height:46px;align-items:center;justify-content:center;margin-top:18px;padding:12px 16px;background:var(--fg);color:#fff;font-size:9px;font-weight:600;letter-spacing:.1em;text-align:center;text-decoration:none;text-transform:uppercase}.compare-primary:hover{background:#333}.compare-primary:focus-visible,.compare-search-elsewhere a:focus-visible{outline:2px solid var(--fg);outline-offset:3px}.compare-search-elsewhere{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:18px;padding:14px 0;border-bottom:1px solid var(--line)}.compare-search-elsewhere>span{color:var(--mid);font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.compare-search-elsewhere div{display:flex;min-width:0;justify-content:flex-end;gap:18px}.compare-search-elsewhere a{border-bottom:1px solid currentColor;color:var(--fg);font-size:8.5px;font-weight:600;letter-spacing:.08em;text-decoration:none;text-transform:uppercase}.compare-search-elsewhere a:hover{color:var(--mid)}
.compare-options{margin-top:clamp(44px,5vw,72px);padding-top:22px;border-top:1px solid var(--fg)}.compare-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.compare-section-head h2{margin:7px 0 0;font-size:clamp(30px,4vw,50px);font-weight:600;line-height:1;letter-spacing:-.04em}.compare-section-head>span{color:var(--mid);font-size:8.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.compare-state,.compare-empty{margin-top:16px!important;padding:10px 12px;background:#f5f2e9;color:#555;font-size:10.5px!important;line-height:1.5}.compare-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin-top:20px}.compare-card{display:flex;height:100%;min-width:0;flex-direction:column;border:1px solid var(--line);background:#fff;color:var(--fg);text-decoration:none;transition:transform .15s ease,border-color .15s ease}.compare-card:hover{border-color:#888;transform:translateY(-2px)}.compare-card-image{display:flex;aspect-ratio:1/1;align-items:center;justify-content:center;overflow:hidden;background:var(--surface)}.compare-card-image img{display:block;width:100%;height:100%;padding:12px;background:var(--surface);object-fit:contain;object-position:center}.compare-card-copy{display:flex;min-height:184px;flex-direction:column;padding:14px}.compare-card-kicker{display:flex;justify-content:space-between;gap:12px;color:var(--mid);font-size:7.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}.compare-card-copy>p{margin-top:16px!important;font-size:9px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}.compare-card h3{display:-webkit-box;overflow:hidden;margin:4px 0 0;font-size:17px;font-weight:500;line-height:1.08;letter-spacing:-.025em;-webkit-box-orient:vertical;-webkit-line-clamp:2}.compare-card dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:auto 0 0;padding-top:12px;border-top:1px solid var(--line)}.compare-card dl div{min-width:0;padding-right:6px}.compare-card dl div+div{padding-left:8px;border-left:1px solid var(--line)}
.compare-wider{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin-top:38px;padding:22px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.compare-wider h3{margin:5px 0 0;font-size:20px;font-weight:500;letter-spacing:-.025em}.compare-market-links{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:9px}.compare-market-links a{padding:9px 11px;border:1px solid var(--fg);color:var(--fg);font-size:8.5px;font-weight:600;letter-spacing:.08em;text-decoration:none;text-transform:uppercase}.compare-market-links a:hover{background:var(--fg);color:#fff}
.compare-alert{display:grid;grid-template-columns:minmax(0,.8fr) minmax(320px,1.2fr);gap:clamp(32px,6vw,90px);margin-top:clamp(44px,5vw,72px);padding:clamp(28px,4vw,50px);border:1px solid #dedbd2;background:#f5f2e9}.compare-alert h2{margin:7px 0 0;font-size:clamp(28px,3vw,44px);font-weight:600;line-height:1;letter-spacing:-.04em}.compare-alert>div>p:last-child{max-width:42ch;margin-top:12px!important;color:#555;font-size:11px;line-height:1.6}.compare-alert .s-watch{margin:0;padding:0;border:0}.compare-alert .s-watch>h3,.compare-alert .s-watch>.s-eyebrow,.compare-alert .s-watch>.s-watch-intro{display:none}.compare-price-note{margin-top:20px!important;color:var(--mid);font-size:7.5px!important;font-weight:500;letter-spacing:.08em;line-height:1.5;text-transform:uppercase}
@media (max-width:980px){.compare-selected{grid-template-columns:minmax(280px,.8fr) minmax(0,1.2fr)}.compare-selected-visual{min-height:400px}.compare-selected-copy{padding:30px}.compare-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:720px){.compare-main{padding:28px 0 34px}.compare-intro{grid-template-columns:1fr;gap:20px;padding-bottom:26px}.compare-intro h1{font-size:46px}.compare-intro>p{font-size:11.5px}.compare-selected{grid-template-columns:1fr;margin:0 -12px;border-right:0;border-left:0}.compare-selected-visual{min-height:0;aspect-ratio:4/4}.compare-selected-visual img{padding:24px}.compare-selected-copy{padding:24px 16px 28px}.compare-brand{margin-top:24px!important}.compare-selected h2{font-size:36px}.compare-primary{margin-top:20px}.compare-search-elsewhere{align-items:flex-start;grid-template-columns:1fr;gap:10px}.compare-search-elsewhere div{justify-content:flex-start;flex-wrap:wrap;gap:10px 16px}.compare-options{margin-top:42px}.compare-section-head{align-items:flex-start;flex-direction:column;gap:12px}.compare-section-head h2{font-size:34px}.compare-grid{grid-template-columns:1fr}.compare-card{display:grid;grid-template-columns:42% 58%}.compare-card-image{height:100%;min-height:210px;aspect-ratio:auto}.compare-card-copy{min-height:210px;padding:12px}.compare-card-copy>p{margin-top:14px!important}.compare-card h3{font-size:15px}.compare-card dl{grid-template-columns:1fr}.compare-card dl div+div{margin-top:5px;padding:5px 0 0;border-top:1px solid var(--line);border-left:0}.compare-card dd{white-space:normal}.compare-wider{align-items:flex-start;flex-direction:column}.compare-market-links{justify-content:flex-start}.compare-alert{grid-template-columns:1fr;gap:26px;margin-right:-12px;margin-left:-12px;padding:28px 16px;border-right:0;border-left:0}}
.compare-card{position:relative;cursor:pointer}.compare-card-hit{position:absolute;inset:0;z-index:2;width:100%;height:100%;padding:0;border:0;background:transparent;cursor:pointer}.compare-card-hit:focus-visible{outline:2px solid var(--fg);outline-offset:-3px}.compare-card:hover .compare-card-kicker span:last-child{color:var(--fg)}
.compare-browse-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:24px;padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.compare-browse-footer p,.compare-browse-footer span{color:var(--mid);font-size:8.5px!important;font-weight:600;letter-spacing:.09em;text-transform:uppercase}.compare-browse-footer strong{color:var(--fg)}.compare-browse-footer button{padding:10px 13px;border:1px solid var(--fg);background:#fff;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:8.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase}.compare-browse-footer button:hover,.compare-browse-footer button:focus-visible{background:var(--fg);color:#fff}
.compare-quick-wrap{position:fixed;inset:0;z-index:120;display:flex;justify-content:flex-end;background:rgba(0,0,0,.32)}.compare-quick{width:min(460px,94vw);height:100%;overflow-y:auto;background:#fff;box-shadow:-14px 0 34px rgba(0,0,0,.14);padding:16px}.compare-quick-close{display:block;margin:0 0 14px auto;padding:4px 0;border:0;background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.compare-quick-close:focus-visible,.compare-quick-back:focus-visible,.compare-quick-primary:focus-visible,.compare-quick-thumbs button:focus-visible{outline:2px solid var(--fg);outline-offset:3px}.compare-quick-image{aspect-ratio:1/1;overflow:hidden;background:var(--surface)}.compare-quick-image img{display:block;width:100%;height:100%;padding:12px;object-fit:contain;object-position:center}.compare-quick-thumbs{display:grid;grid-auto-columns:58px;grid-auto-flow:column;gap:6px;overflow-x:auto;padding:8px 1px 2px}.compare-quick-thumbs button{width:58px;height:58px;padding:3px;border:1px solid var(--line);background:var(--surface);cursor:pointer}.compare-quick-thumbs button.is-active{border-color:var(--fg)}.compare-quick-thumbs img{display:block;width:100%;height:100%;object-fit:contain}.compare-quick-copy{padding:22px 2px 30px}.compare-quick-kicker{display:flex;justify-content:space-between;gap:16px;color:var(--mid);font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.compare-quick h2{margin:13px 0 0;font-size:clamp(26px,3vw,38px);font-weight:600;line-height:1;letter-spacing:-.04em}.compare-quick-facts{display:grid;grid-template-columns:1fr 1fr;margin:22px 0 0;border-top:1px solid var(--fg);border-bottom:1px solid var(--line)}.compare-quick-facts div{min-width:0;padding:10px 8px 11px 0}.compare-quick-facts div:nth-child(even){padding-left:10px;border-left:1px solid var(--line)}.compare-quick-facts div:nth-child(n+3){border-top:1px solid var(--line)}.compare-quick-facts dt{color:var(--mid);font-size:7.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase}.compare-quick-facts dd{margin:3px 0 0;font-size:10px;line-height:1.35}.compare-quick-note{margin-top:18px!important;color:#555;font-size:10.5px!important;line-height:1.6}.compare-quick-primary{display:flex;min-height:48px;align-items:center;justify-content:center;margin-top:22px;padding:12px 16px;background:var(--fg);color:#fff;font-size:9px;font-weight:600;letter-spacing:.1em;text-align:center;text-decoration:none;text-transform:uppercase}.compare-quick-primary:hover{background:#333}.compare-quick-back{display:block;margin:14px auto 0;padding:4px 0;border:0;border-bottom:1px solid var(--fg);background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:8.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase}
.compare-quick-nav{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid var(--line)}.compare-quick-nav button{width:max-content;padding:0;border:0;background:transparent;color:var(--fg);cursor:pointer;font-family:var(--f);font-size:8px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}.compare-quick-nav button:last-child{justify-self:end}.compare-quick-nav button:disabled{cursor:default;opacity:.35}.compare-quick-nav span{color:var(--mid);font-size:8px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
@media (max-width:560px){.compare-quick-wrap{align-items:flex-end}.compare-quick{width:100%;height:min(90dvh,760px);padding:14px;border-radius:16px 16px 0 0;box-shadow:0 -14px 34px rgba(0,0,0,.16)}.compare-quick-image{height:min(38vh,300px);aspect-ratio:auto}.compare-quick-copy{padding-top:17px}.compare-quick h2{font-size:25px}.compare-quick-note{font-size:10px!important}}
@media (max-width:560px){.compare-browse-footer{align-items:flex-start;flex-direction:column;gap:12px}.compare-browse-footer button{width:100%}.compare-quick-nav{margin-bottom:14px}}
`;
