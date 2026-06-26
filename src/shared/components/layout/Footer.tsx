import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-navy-border bg-navy-deeper px-4 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nerta-logo-dark.svg" alt="Nerta" className="h-7 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-body text-muted-text">
              Química automotiva premium de origem belga. Alta performance para frotas, agro,
              animal care e detailing profissional.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-body text-xs font-semibold uppercase tracking-label text-light-gray">
              Navegação
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Início" },
                { href: "/produtos", label: "Catálogo" },
                { href: "/sobre", label: "Sobre" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-muted-text transition-colors duration-fast hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-body text-xs font-semibold uppercase tracking-label text-light-gray">
              Contato
            </h3>
            <ul className="flex flex-col gap-2.5 font-body text-sm text-muted-text">
              <li>
                <a
                  href="mailto:contato@nertabrasil.com.br"
                  className="transition-colors duration-fast hover:text-white"
                >
                  contato@nertabrasil.com.br
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com/nertabrasil"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Nerta Brasil"
                className="text-muted-text transition-colors duration-fast hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/nertabrasil"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Nerta Brasil"
                className="text-muted-text transition-colors duration-fast hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-border pt-6">
          <p className="font-body text-xs text-muted-text">
            © 2026 Nerta Brasil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
