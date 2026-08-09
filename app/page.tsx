const links = [
  {
    label: "In Other News",
    href: "/in-other-news",
    className: "plain-tile--news",
  },
  {
    label: "About me",
    href: "/about",
    className: "plain-tile--about",
  },
  {
    label: "Resume",
    href: "/henry-greelis-resume.pdf",
    className: "plain-tile--resume",
    external: true,
  },
  {
    label: "Email me",
    href: "mailto:henrygreelis@gmail.com",
    className: "plain-tile--email",
  },
  {
    label: "Writing",
    href: "/writing",
    className: "plain-tile--writing",
  },
];

export default function Home() {
  return (
    <main className="plain-site plain-home">
      <div>
        <p className="plain-welcome">
          Welcome, I’m <strong>Henry Greelis.</strong>
        </p>
        <p className="plain-intro">
          I’m interested in understanding customers and shaping how products
          are positioned.
        </p>

        <nav className="plain-menu" aria-label="Henry Greelis">
          {links.map((link) => (
            <a
              className={`plain-tile ${link.className}`}
              href={link.href}
              key={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
              {link.external ? <span aria-hidden="true"> ↗</span> : null}
            </a>
          ))}
        </nav>
      </div>

      <p className="plain-copyright">© 2026 Henry Greelis</p>
    </main>
  );
}
