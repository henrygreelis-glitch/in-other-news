"use client";

import React, { useEffect, useState } from "react";
import {
  AiFinder,
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

    fetch(`/api/ebay/search?product=${pick.id}`, {
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
          message: "Live matches are unavailable. Search eBay directly.",
          searchUrl: pick.ebay_search_href,
        });
      });

    return () => controller.abort();
  }, [pick?.id, pick?.ebay_search_href]);

  if (!pick) {
    return (
      <div className="s-root search-root">
        <style>{ISSUE_CSS + SEARCH_CSS}</style>
        <header className="search-head">
          <a className="search-wordmark" href="/">In Other News</a>
          <span>Issue 01</span>
          <a className="search-back" href="/">← Back to issue</a>
        </header>
        <main className="search-missing">
          <p className="s-eyebrow">Product not found</p>
          <h1>That piece is not in this week’s issue.</h1>
          <a href="/">← Back to Issue 01</a>
        </main>
      </div>
    );
  }

  const hero = pick.hero;
  const exactProductQuery = `${hero.brand} ${hero.item}`;
  const retailSearchUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
    `${exactProductQuery} sale`
  )}`;
  const grailedSearchUrl = `https://www.grailed.com/shop?query=${encodeURIComponent(
    exactProductQuery
  )}`;
  const ebaySearchUrl = market.searchUrl || pick.ebay_search_href;
  const liveOptions = market.listings.map((listing) => ({
    id: `ebay-${listing.id}`,
    source: "eBay",
    item: listing.title,
    price: formatListingMoney(listing.price, listing.currency),
    condition: listing.condition || "Pre-owned",
    href: listing.url,
    image: listing.imageUrl || hero.image,
  }));
  const curatedOptions = pick.alternatives.map((alternative) => ({
    ...alternative,
    source: alternative.source || SOURCE_LABELS[alternative.source_type],
  }));
  const buyingOptions = [...liveOptions, ...curatedOptions];
  const optionStatus =
    market.status === "loading"
      ? "Searching live"
      : buyingOptions.length
        ? `${buyingOptions.length} available`
        : "Search directly";

  return (
    <div className="s-root search-root">
      <style>{ISSUE_CSS + SEARCH_CSS}</style>

      <header className="search-head">
        <a className="search-wordmark" href="/">In Other News</a>
        <span>Issue 01 · Product</span>
        <a className="search-back" href="/">← Back to issue</a>
      </header>

      <main className="search-pdp">
        <section className="search-visual" aria-label={`${hero.brand} ${hero.item} product image`}>
          <ProductImage pick={pick} />
        </section>

        <aside className="search-buy" aria-labelledby="search-product-title">
          <div className="search-buy-inner">
            <div className="search-kicker">
              <span>{pick.slot}</span>
              <span>{SOURCE_LABELS[hero.source_type]}</span>
            </div>

            <p className="search-brand">{hero.brand}</p>
            <h1 id="search-product-title">{hero.item}</h1>
            <div className="search-price">
              <strong>{hero.price}</strong>
              <span>{hero.status}</span>
            </div>

            <p className="search-reason">{pick.why_selected}</p>

            <dl className="search-facts">
              <div>
                <dt>Condition</dt>
                <dd>{hero.condition}</dd>
              </div>
              <div>
                <dt>Sizes</dt>
                <dd>{hero.sizes_available}</dd>
              </div>
            </dl>

            <a
              className="search-primary"
              href={hero.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hero.link_label || "View selected listing ↗"}
            </a>

            <div className="search-accordions">
              <details className="search-accordion is-buying">
                <summary>
                  <span>Used + other buying options</span>
                  <small>{optionStatus}</small>
                </summary>
                <div className="search-accordion-body">
                  {market.status === "loading" && (
                    <p className="search-state" role="status" aria-live="polite">
                      Looking for live alternatives…
                    </p>
                  )}

                  {market.status === "ready" && market.matchType !== "exact" && (
                    <p className="search-state">
                      No exact version listed. Showing close alternatives.
                    </p>
                  )}

                  {buyingOptions.length > 0 && (
                    <div className="search-options-list">
                      {buyingOptions.map((option) => (
                        <a
                          className="search-option"
                          href={option.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={option.id}
                        >
                          <img
                            src={option.image || hero.image}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = hero.image;
                            }}
                          />
                          <span>
                            <small>{option.source} · {option.condition}</small>
                            <strong>{option.item}</strong>
                            <b>{option.price}</b>
                          </span>
                          <i aria-hidden="true">↗</i>
                        </a>
                      ))}
                    </div>
                  )}

                  {market.status === "error" && (
                    <p className="search-state">{market.message}</p>
                  )}

                  <div className="search-market-links">
                    <a href={ebaySearchUrl} target="_blank" rel="noopener noreferrer">eBay ↗</a>
                    <a href={retailSearchUrl} target="_blank" rel="noopener noreferrer">Retail + sale ↗</a>
                    <a href={grailedSearchUrl} target="_blank" rel="noopener noreferrer">Grailed ↗</a>
                  </div>
                </div>
              </details>

              <details className="search-accordion">
                <summary>
                  <span>Why this source</span>
                  <small>Henry’s note</small>
                </summary>
                <div className="search-accordion-body search-note">
                  <p>{pick.why_this_source}</p>
                </div>
              </details>

              <details className="search-accordion">
                <summary>
                  <span>Find another version</span>
                  <small>AI search</small>
                </summary>
                <div className="search-accordion-body search-tool-body">
                  <AiFinder key={`ai-${pick.id}`} pick={pick} defaultOpen standalone />
                </div>
              </details>

              <details className="search-accordion">
                <summary>
                  <span>Price alert</span>
                  <small>Save this search</small>
                </summary>
                <div className="search-accordion-body search-tool-body">
                  <ProductWatch key={`watch-${pick.id}`} pick={pick} />
                </div>
              </details>
            </div>

            <p className="search-price-note">{USD_PRICE_NOTE}</p>
          </div>
        </aside>
      </main>
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
`;
