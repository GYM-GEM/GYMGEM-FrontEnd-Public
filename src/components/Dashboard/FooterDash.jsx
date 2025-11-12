export default function FooterDash({
  company = "GYMGEM",
  links = [
    { label: "Docs", href: "#" },
    { label: "Support", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  className = "",
}) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`w-full border-t bg-[#FFF8F0] backdrop-blur supports-[backdrop-filter]:bg-base-100/40 ${className}`}
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-base-content/70">
          © {year} {company}. All rights reserved.
        </p>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-4 text-sm"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-base-content/80 hover:text-base-content underline-offset-4 hover:underline focus:outline-none focus-visible:ring"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
