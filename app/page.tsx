const links = [
  {
    label: "In Other News",
    href: "/in-other-news",
  },
  {
    label: "About me",
    href: "/about",
  },
  {
    label: "Resume",
    href: "/henry-greelis-resume.pdf",
    external: true,
  },
  {
    label: "Email me",
    href: "mailto:henrygreelis@gmail.com",
  },
  {
    label: "Writing",
    href: "/writing",
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

        <nav aria-label="Henry Greelis">
          <ul className="plain-menu">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                  {link.external ? <span aria-hidden="true"> ↗</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="plain-copyright">© 2026 Henry Greelis</p>
    </main>
  );
}
