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
          ← In Other News
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
            In Other News is where I work that out in public. Each issue builds
            one complete outfit, then matches every piece against live retail
            and resale listings, so the writing and the buying sit in the same
            place instead of the reader having to go hunting.
          </p>
        </div>

        <div className="plain-links">
          <a href="/">In Other News</a>
          <a href="/writing">Writing</a>
          <a href="mailto:henrygreelis@gmail.com">Email me</a>
          <a
            href="/henry-greelis-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </main>
  );
}
