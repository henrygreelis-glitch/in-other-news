import React, { useState } from "react";

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
};

const PICKS = [
  {
    slot: "Outer",
    brand: "Kaptain Sunshine",
    item: "Traveller Coat",
    price: "$1,076",
    tag: "Final sale",
    href: "https://www.namu-shop.com/products/kaptain-sunshine-traveller-coat-top-navy-aw25",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85",
    why: "Balmacaan collar, raglan shoulder, cut long enough to cover a jacket. The one coat that works over everything else here.",
  },
  {
    slot: "Layer",
    brand: "Camiel Fortgens",
    item: "Big Shirt",
    price: "$576",
    tag: "1 left",
    href: "https://wdepartment.com/product/camiel-fortgens-big-shirt-blockprint/",
    img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=85",
    why: "Cut like a pattern block someone forgot to grade down. Worn open it becomes a light jacket, which is the job in October.",
  },
  {
    slot: "Knit",
    brand: "Beams Plus",
    item: "Shawl Collar Cardigan",
    price: "¥27,500",
    tag: "In stock",
    href: "https://www.beams.co.jp/item/beamsplus/tops/38150255148/",
    img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85",
    why: "Reads as tailoring from the front and a sweatshirt from behind. Beams cut theirs closer through the body, so it goes under the coat without bulking.",
  },
  {
    slot: "Shirt",
    brand: "Prada",
    item: "Sky Cotton Shirt",
    price: "$1,350",
    tag: "Available",
    href: "https://www.prada.com/us/en/p/cotton-shirt/UCN596_10IV_F0AB7_S_OOO",
    img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=85",
    why: "Straight fit, classic collar, rounded hem, mother-of-pearl buttons. The triangle is the only thing telling you what it cost. Here for the collar roll, not the logo.",
  },
  {
    slot: "Tee",
    brand: "Sunspel",
    item: "Long Sleeve Riviera",
    price: "£160",
    tag: "In stock",
    href: "https://www.sunspel.com/products/mens-cotton-riviera-long-sleeve-polo-shirt-in-black",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
    why: "Mesh knit breathes under the cardigan and holds its shape at the collar after washing, which is the specific way most white tees die.",
  },
  {
    slot: "Trouser",
    brand: "Our Legacy",
    item: "Third Cut",
    price: "€360",
    tag: "In stock",
    href: "https://www.ourlegacy.com/third-cut-black-selvedge",
    img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85",
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
    img: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=1200&q=85",
    why: "Cheapest thing here and the one that changes the fit most. Waffle sits higher and gives you an edge between boot and hem instead of a gap.",
  },
  {
    slot: "Shoe",
    brand: "Hender Scheme",
    item: "Manual Industrial Product 22",
    price: "¥74,800",
    tag: "Check stock",
    href: "https://online.henderscheme.com/item/detail/1_1_mip-22_1",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
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

export default function Uniform() {
  const [openIdx, setOpenIdx] = useState(null);
  const [email, setEmail] = useState("");
  const [signed, setSigned] = useState(false);
  const submit = () => email.includes("@") && email.length > 4 && setSigned(true);
  return (
    <div className="s-root">
      <style>{CSS}</style>
      <header className="s-head">
        <span>{MASTHEAD.title}</span>
        <span>{MASTHEAD.issue} &nbsp; {MASTHEAD.date}</span>
      </header>

      <div className="s-open">
        <h1>{MASTHEAD.theme}</h1>
        <span className="s-n">{PICKS.length} pieces &nbsp; 4 currencies</span>
      </div>

      <main className="s-grid">
        {PICKS.map((pick, index) => (
          <article className="s-tile" key={pick.brand + pick.item}>
            <p className="s-slot">{pick.slot}</p>
            <button
              className="s-shot"
              onClick={() => setOpenIdx(openIdx === index ? null : index)}
              aria-expanded={openIdx === index}
              aria-label={`Read why we picked ${pick.brand} ${pick.item}`}
            >
              <ProductImage pick={pick} />
              {openIdx === index && (
                <span className="s-why">
                  {pick.why}
                  <span className="s-go">Tap to close</span>
                </span>
              )}
            </button>
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
            </div>
          </article>
        ))}
      </main>

      <section className="s-sub">
        {signed ? (
          <p>Subscribed. Uniform 02 lands Sunday.</p>
        ) : (
          <>
            <p>One uniform, every Sunday.</p>
            <div className="s-field">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && submit()}
                placeholder="Email"
                aria-label="Email address"
              />
              <button onClick={submit}>Subscribe</button>
            </div>
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
.s-root{--fg:#000;--mid:#767676;--line:#e4e4e4;--plate:#f1f1f1;--f:'Archivo',Helvetica,Arial,sans-serif;background:#fff;color:var(--fg);font-family:var(--f);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;padding:0 16px}
.s-root *{box-sizing:border-box}.s-root h1,.s-root p{margin:0}.s-root h1{font-weight:400}.s-root button:focus-visible,.s-root input:focus-visible{outline:1px solid var(--fg);outline-offset:2px}
.s-head{display:flex;justify-content:space-between;padding:18px 0;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}
.s-open{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding:56px 0 44px}.s-open h1{font-size:clamp(24px,3.4vw,42px);font-weight:600;line-height:1.04;letter-spacing:-.02em;max-width:16ch}
.s-n{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mid);flex:none}
.s-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:34px 16px}.s-tile{display:flex;flex-direction:column}.s-slot{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--mid);padding-bottom:8px}
.s-shot{position:relative;display:block;width:100%;padding:0;border:0;background:var(--plate);cursor:pointer;text-align:left;overflow:hidden}.s-shot img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.s-why{position:absolute;inset:0;background:#fff;padding:16px;font-size:12.5px;line-height:1.55;display:flex;flex-direction:column;justify-content:space-between;border:1px solid var(--fg)}.s-go{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mid)}
.s-cap{padding-top:10px}.s-brand{font-size:12.5px;font-weight:600}.s-item{font-size:12.5px;color:var(--mid);margin-top:1px}.s-line{display:flex;justify-content:space-between;gap:10px;margin-top:6px;font-size:12.5px}.s-tag{font-size:10px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--mid)}
.s-shop{display:inline-block;margin-top:10px;color:var(--fg);font-size:10px;font-weight:500;letter-spacing:.1em;line-height:1.4;text-decoration:none;text-transform:uppercase;border-bottom:1px solid var(--fg)}.s-shop:hover{color:var(--mid);border-color:var(--mid)}.s-shop:focus-visible{outline:1px solid var(--fg);outline-offset:3px}
.s-sub{margin-top:80px;padding:44px 0;border-top:1px solid var(--line)}.s-sub p{font-size:13px}.s-field{display:flex;margin-top:18px;border-bottom:1px solid var(--fg);max-width:380px}.s-field input{flex:1;min-width:0;border:0;background:transparent;font-family:var(--f);font-size:13px;color:var(--fg);padding:0 0 8px}.s-field input::placeholder{color:var(--mid)}.s-field button{border:0;background:transparent;cursor:pointer;padding:0 0 8px;font-family:var(--f);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase}.s-field button:hover{color:var(--mid)}
.s-foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px 0;border-top:1px solid var(--line);font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--mid)}
@media (max-width:560px){.s-grid{grid-template-columns:repeat(2,1fr);gap:24px 12px}.s-open{padding:36px 0 30px;flex-direction:column;align-items:flex-start;gap:12px}.s-why{padding:12px;font-size:11.5px}}
@media (prefers-reduced-motion:reduce){.s-root *{transition:none!important}}
`;
