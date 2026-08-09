import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes from Henry Greelis on products, positioning, and culture.",
};

export default function WritingPage() {
  return (
    <main className="plain-site plain-page">
      <div className="plain-page-inner">
        <a className="plain-back" href="/">
          ← Home
        </a>

        <h1>Writing</h1>
        <p className="plain-writing-intro">
          Notes on products, positioning, fashion, technology, and the
          internet.
        </p>

        <div className="plain-post-list">
          <a className="plain-post" href="/in-other-news">
            <time dateTime="2026-08">August 2026</time>
            <h2>What I’m building: In Other News</h2>
            <p>
              A weekly uniform, why each piece belongs, and every reasonable
              way to buy it.
            </p>
          </a>
        </div>

        <p className="plain-more">More notes will live here as I publish them.</p>
      </div>
    </main>
  );
}
