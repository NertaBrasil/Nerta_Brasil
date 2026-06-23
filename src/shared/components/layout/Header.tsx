import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Catálogo" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-navy-border bg-navy-deep/85 px-4 py-3 backdrop-blur-md sm:px-10">
      <Link href="/" className="flex items-center">
        <img src="/nerta-logo-dark.svg" alt="Nerta" className="h-8 w-auto" />
      </Link>
      <nav className="flex items-center gap-6 sm:gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-body text-sm font-medium text-muted-text transition-colors duration-fast ease-standard hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
