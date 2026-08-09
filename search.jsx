"use client";

import React, { useEffect, useState } from "react";
import {
  AiFinder,
  ISSUE_CSS,
  PICKS,
  PieceCard,
  ProductWatch,
} from "./issue";

export default function ProductSearch({ productKey }) {
  const pick = PICKS.find((candidate) => candidate.id === productKey);
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

  const exactProductQuery = `${pick.hero.brand} ${pick.hero.item}`;
  const retailSearchUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
    `${exactProductQuery} sale`
  )}`;
  const grailedSearchUrl = `https://www.grailed.com/shop?query=${encodeURIComponent(
    exactProductQuery
  )}`;

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
        <PieceCard piece={pick} market={market} />

        <section className="search-tools" aria-labelledby="search-page-title">
          <div className="search-intro">
            <p className="s-eyebrow">Compare &amp; personalize</p>
            <h1 id="search-page-title">Find the version that works for you.</h1>
            <p>
              Start with this week’s selection, then change the brief, compare
              pre-owned options, or set an alert for the right listing.
            </p>
          </div>

          <section className="search-shortcuts" aria-labelledby="search-elsewhere-title">
            <div className="s-used-kicker">
              <span>Search elsewhere</span>
              <span>Exact product first</span>
            </div>
            <h2 id="search-elsewhere-title">
              Check another store or resale market.
            </h2>
            <p>
              Look for the same piece at another retailer, on sale, or listed
              secondhand on Grailed.
            </p>
            <div className="search-shortcut-links">
              <a
                href={retailSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Retail + sale</span>
                <strong>Find it somewhere else ↗</strong>
              </a>
              <a
                href={grailedSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Resale</span>
                <strong>Search Grailed ↗</strong>
              </a>
            </div>
          </section>

          <AiFinder
            key={`ai-${pick.id}`}
            pick={pick}
            defaultOpen
            standalone
          />
          <ProductWatch key={`watch-${pick.id}`} pick={pick} />
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
.search-layout{display:grid;grid-template-columns:minmax(0,620px) minmax(320px,480px);align-items:start;justify-content:center;gap:clamp(40px,6vw,80px);max-width:1220px;margin:0 auto;padding:52px 0 88px}
.search-intro{padding-bottom:29px;border-bottom:1px solid var(--fg)}.search-intro h1{max-width:12ch;margin-top:10px;font-size:clamp(34px,5vw,60px);font-weight:600;line-height:.98;letter-spacing:-.04em}.search-intro>p:last-child{max-width:55ch;margin-top:20px!important;color:#4d4d4d;font-size:12px;line-height:1.65}
.search-shortcuts{margin-top:32px;padding:24px;border:1px solid var(--line)}.search-shortcuts h2{max-width:17ch;margin:10px 0 0;font-size:24px;font-weight:500;line-height:1.08;letter-spacing:-.025em}.search-shortcuts>p{max-width:52ch;margin-top:10px!important;color:#555;font-size:11.5px;line-height:1.6}.search-shortcut-links{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:20px}.search-shortcut-links a{display:flex;min-height:92px;flex-direction:column;justify-content:space-between;padding:14px;border:1px solid var(--fg);color:var(--fg);text-decoration:none}.search-shortcut-links a:hover{background:#f2f2ef}.search-shortcut-links span{color:var(--mid);font-size:8.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.search-shortcut-links strong{font-size:10px;font-weight:600;letter-spacing:.08em;line-height:1.35;text-transform:uppercase}
.search-tools>.s-ai{margin-top:32px;padding:26px}.search-tools>.s-ai h3{font-size:25px}.search-tools>.s-watch{margin-top:46px;padding-top:32px}.search-tools>.s-watch h3{font-size:22px}.search-tools .s-used-card{grid-template-columns:86px minmax(0,1fr);min-height:108px}.search-tools .s-used-card img{width:86px;height:108px}.search-tools .s-ai-list .s-used-card{grid-template-columns:76px minmax(0,1fr);min-height:96px}.search-tools .s-ai-list .s-used-card img{width:76px;height:96px}
.search-foot{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-top:1px solid var(--line);color:var(--mid);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.search-foot a{color:var(--fg);text-decoration:none}.search-foot a:hover{color:var(--mid)}
.search-missing{max-width:760px;margin:0 auto;padding:15vh 0}.search-missing h1{max-width:16ch;margin-top:10px;font-size:clamp(34px,6vw,64px);font-weight:600;line-height:1;letter-spacing:-.04em}.search-missing a{display:inline-block;margin-top:28px;border-bottom:1px solid var(--fg);color:var(--fg);font-size:10px;font-weight:500;letter-spacing:.1em;text-decoration:none;text-transform:uppercase}
@media (max-width:760px){.search-root{padding:0 12px 24px}.search-head{grid-template-columns:1fr auto}.search-head>span{display:none}.search-layout{grid-template-columns:1fr;gap:52px;padding:30px 0 64px}.search-intro h1{font-size:40px}.search-shortcuts{padding:20px 16px}.search-shortcut-links{grid-template-columns:1fr}.search-shortcut-links a{min-height:76px}.search-tools>.s-ai{padding:20px 16px}.search-tools>.s-watch{margin-top:38px;padding-top:28px}.search-foot{align-items:flex-start;flex-direction:column}.search-tools .s-used-card,.search-tools .s-ai-list .s-used-card{grid-template-columns:70px minmax(0,1fr);min-height:90px}.search-tools .s-used-card img,.search-tools .s-ai-list .s-used-card img{width:70px;height:90px}}
`;
