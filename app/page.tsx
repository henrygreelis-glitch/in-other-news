const PROJECT_IMAGES = [
  {
    src: "/products/traveller-coat-clean.jpg",
    alt: "",
    className: "hg-preview-coat",
  },
  {
    src: "/products/brooks-brothers-cashmere-v-neck-clean.jpg",
    alt: "",
    className: "hg-preview-knit",
  },
  {
    src: "/products/rick-owens-geth-jeans-clean.jpg",
    alt: "",
    className: "hg-preview-trouser",
  },
  {
    src: "/products/kiko-kostadinov-farkas-boots-clean.jpg",
    alt: "",
    className: "hg-preview-boot",
  },
];

export default function Home() {
  return (
    <div className="hg-home">
      <header className="hg-header">
        <a href="#top" aria-label="Henry Greelis, back to top">
          Henry Greelis
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="/in-other-news">In Other News</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main id="top">
        <section className="hg-hero" aria-labelledby="home-title">
          <div className="hg-hero-meta">
            <span>Positioning</span>
            <span>Product stories</span>
            <span>Editorial ideas</span>
          </div>
          <h1 id="home-title">
            <span>Henry</span>
            <span>Greelis</span>
          </h1>
          <div className="hg-hero-bottom">
            <p>
              I’m interested in understanding customers and shaping how
              products are positioned.
            </p>
            <a href="#work">Selected work ↓</a>
          </div>
        </section>

        <section className="hg-work" id="work" aria-labelledby="work-title">
          <div className="hg-section-head">
            <h2 id="work-title">Current project</h2>
            <span>01 / 01</span>
          </div>

          <a className="hg-project" href="/in-other-news">
            <div className="hg-project-copy">
              <p className="hg-project-kicker">Fashion · Editorial · Product</p>
              <h3>In Other News</h3>
              <p>
                A weekly fashion editorial that starts with one uniform, then
                shows every reasonable way to buy it—retail, sale, and
                pre-owned.
              </p>
              <span>Open Issue 01 →</span>
            </div>
            <div className="hg-project-preview" aria-hidden="true">
              {PROJECT_IMAGES.map((image) => (
                <img
                  src={image.src}
                  alt={image.alt}
                  className={image.className}
                  key={image.src}
                />
              ))}
              <span className="hg-preview-label">Uniform 01 · 8 pieces</span>
            </div>
          </a>
        </section>

        <section className="hg-about" id="about" aria-labelledby="about-title">
          <div className="hg-section-head">
            <h2 id="about-title">About</h2>
            <span>Independent · 2026</span>
          </div>
          <div className="hg-about-grid">
            <p>
              I’m drawn to the point where customer insight, product strategy,
              and culture meet. This site is where I develop projects around
              positioning, discovery, and the way people decide what is worth
              paying attention to.
            </p>
            <div>
              <span>Contact</span>
              <a href="mailto:henrygreelis@gmail.com">
                henrygreelis@gmail.com ↗
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="hg-footer">
        <span>Henry Greelis</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
