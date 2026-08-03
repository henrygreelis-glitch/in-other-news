"use client";

import React, { useEffect, useState } from "react";
import {
  AiFinder,
  ISSUE_CSS,
  PICKS,
  ProductImage,
  ProductWatch,
  UsedMarket,
} from "./issue";

export default function ProductSearch({ productKey }) {
  const pick = PICKS.find((candidate) => candidate.ebayProduct === productKey);
  const [market, setMarket] = useState({
    status: "idle",
    listings: [],
    matchType: "none",
    message: "",
    searchUrl: "",
  });

  useEffect(() => {
    if (!pick?.ebayProduct) return undefined;

    const controller = new AbortController();
    setMarket({
      status: "loading",
      listings: [],
      matchType: "none",
      message: "",
      searchUrl: pick.ebaySearchHref,
    });

    fetch(`/api/ebay/search?product=${pick.ebayProduct}`, {
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
          searchUrl: data.searchUrl || pick.ebaySearchHref,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setMarket({
          status: "error",
          listings: [],
          matchType: "none",
          message: "Live matches are unavailable. Search eBay directly.",
          searchUrl: pick.ebaySearchHref,
        });
      });

    return () => controller.abort();
  }, [pick?.ebayProduct, pick?.ebaySearchHref]);

  if (!pick) {
    return (
      <div className="s-root search-root">
        <style>{ISSUE_CSS + SEARCH_CSS}</style>
        <header className="search-head">
          <a className="search-wordmark" href="/">
            In Other News
          </a>
          <span>Uniform 01 · Compare &amp; Search</span>
        </header>
        <main className="search-missing">
          <p className="s-eyebrow">Product not found</p>
          <h1>That piece is not in this week’s issue.</h1>
          <a href="/">← Back to Uniform 01</a>
        </main>
      </div>
    );
  }

  return (
    <div className="s-root search-root">
      <style>{ISSUE_CSS + SEARCH_CSS}</style>

      <header className="search-head">
        <a className="search-wordmark" href="/">
          In Other News
        </a>
        <span>Uniform 01 · Compare &amp; Search</span>
        <a className="search-back" href="/">
          ← Back to issue
        </a>
      </header>

      <main className="search-layout">
        <aside className="search-product" aria-label="Original selection">
          <p className="s-slot">{pick.slot} · Original selection</p>
          <ProductImage key={pick.img} pick={pick} />
          <div className="search-product-copy">
            <p className="search-brand">{pick.brand}</p>
            <h2>{pick.item}</h2>
            <div className="search-meta">
              <span>{pick.price}</span>
              <span className="s-tag">{pick.tag}</span>
            </div>
            <p className="search-why">{pick.why}</p>
            <a
              className="search-retail"
              href={pick.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pick.linkLabel || "View original listing ↗"}
            </a>
          </div>
        </aside>

        <section className="search-tools" aria-labelledby="search-page-title">
          <div className="search-intro">
            <p className="s-eyebrow">Compare &amp; personalize</p>
            <h1 id="search-page-title">Find the version that works for you.</h1>
            <p>
              Start with this week’s selection, then change the brief, compare
              pre-owned options, or set an alert for the right listing.
            </p>
          </div>

          <AiFinder
            key={`ai-${pick.ebayProduct}`}
            pick={pick}
            defaultOpen
            standalone
          />
          <UsedMarket pick={pick} market={market} />
          <ProductWatch key={`watch-${pick.ebayProduct}`} pick={pick} />
        </section>
      </main>

      <footer className="search-foot">
        <span>In Other News · Uniform 01</span>
        <a href="/">Return to the full issue →</a>
      </footer>
    </div>
  );
}

const SEARCH_CSS = `
.search-root{max-width:none;min-height:100vh;padding:0 24px 32px}
.search-head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;padding:18px 0;border-bottom:1px solid var(--line);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}
.search-head a{width:max-content;color:var(--fg);text-decoration:none}.search-head a:hover{color:var(--mid)}.search-wordmark{font-size:11px;font-weight:600}.search-back{justify-self:end}
.search-layout{display:grid;grid-template-columns:minmax(280px,380px) minmax(0,700px);align-items:start;justify-content:center;gap:clamp(56px,8vw,120px);max-width:1180px;margin:0 auto;padding:52px 0 88px}
.search-product{position:sticky;top:24px}.search-product>img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:var(--plate)}.search-product-copy{padding-top:18px}.search-brand{font-size:12px;font-weight:600}.search-product h2{margin:2px 0 0;font-size:25px;font-weight:500;line-height:1.1;letter-spacing:-.025em}.search-meta{display:flex;justify-content:space-between;gap:16px;margin-top:18px;padding:11px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.search-why{margin-top:19px!important;color:#3f3f3f;font-size:12px;line-height:1.65}.search-retail{display:block;margin-top:22px;padding:12px 14px;background:var(--fg);color:#fff;font-size:9.5px;font-weight:600;letter-spacing:.1em;text-align:center;text-decoration:none;text-transform:uppercase}.search-retail:hover{background:#333}
.search-intro{padding-bottom:29px;border-bottom:1px solid var(--fg)}.search-intro h1{max-width:12ch;margin-top:10px;font-size:clamp(34px,5vw,60px);font-weight:600;line-height:.98;letter-spacing:-.04em}.search-intro>p:last-child{max-width:55ch;margin-top:20px!important;color:#4d4d4d;font-size:12px;line-height:1.65}
.search-tools>.s-ai{margin-top:32px;padding:26px}.search-tools>.s-ai h3{font-size:25px}.search-tools>.s-used,.search-tools>.s-watch{margin-top:46px;padding-top:32px}.search-tools>.s-used h3,.search-tools>.s-watch h3{font-size:22px}.search-tools .s-used-card{grid-template-columns:86px minmax(0,1fr);min-height:108px}.search-tools .s-used-card img{width:86px;height:108px}.search-tools .s-ai-list .s-used-card{grid-template-columns:76px minmax(0,1fr);min-height:96px}.search-tools .s-ai-list .s-used-card img{width:76px;height:96px}
.search-foot{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-top:1px solid var(--line);color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.search-foot a{color:var(--fg);text-decoration:none}.search-foot a:hover{color:var(--mid)}
.search-missing{max-width:760px;margin:0 auto;padding:15vh 0}.search-missing h1{max-width:16ch;margin-top:10px;font-size:clamp(34px,6vw,64px);font-weight:600;line-height:1;letter-spacing:-.04em}.search-missing a{display:inline-block;margin-top:28px;border-bottom:1px solid var(--fg);color:var(--fg);font-size:10px;font-weight:500;letter-spacing:.1em;text-decoration:none;text-transform:uppercase}
@media (max-width:760px){.search-root{padding:0 12px 24px}.search-head{grid-template-columns:1fr auto}.search-head>span{display:none}.search-layout{grid-template-columns:1fr;gap:52px;padding:30px 0 64px}.search-product{position:static}.search-product>img{aspect-ratio:16/11;object-fit:contain}.search-product h2{font-size:22px}.search-intro h1{font-size:40px}.search-tools>.s-ai{padding:20px 16px}.search-tools>.s-used,.search-tools>.s-watch{margin-top:38px;padding-top:28px}.search-foot{align-items:flex-start;flex-direction:column}.search-tools .s-used-card,.search-tools .s-ai-list .s-used-card{grid-template-columns:70px minmax(0,1fr);min-height:90px}.search-tools .s-used-card img,.search-tools .s-ai-list .s-used-card img{width:70px;height:90px}}
`;
