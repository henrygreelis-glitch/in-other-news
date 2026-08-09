import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Henry Greelis and the work he is interested in.",
};

export default function AboutPage() {
  return (
    <main className="plain-site plain-page">
      <div className="plain-page-inner">
        <a className="plain-back" href="/">
          ← Home
        </a>

        <h1>About me</h1>
        <div className="plain-copy">
          <p>
            I’m Henry. I’m interested in understanding customers and shaping
            how products are positioned.
          </p>
          <p>
            I like the point where customer insight, product strategy,
            fashion, technology, and culture meet.
          </p>
          <p>
            I’m currently building In Other News, a weekly fashion editorial
            that compares retail and pre-owned buying options.
          </p>
        </div>

        <div className="plain-links">
          <a href="mailto:henrygreelis@gmail.com">Email me</a>
          <a
            href="/henry-greelis-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume ↗
          </a>
          <a href="/in-other-news">In Other News</a>
        </div>
      </div>
    </main>
  );
}
