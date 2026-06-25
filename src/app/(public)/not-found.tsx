import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-display text-7xl font-bold text-nerta-blue">404</p>
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Página não encontrada</h1>
        <p className="mt-2 font-body text-sm text-muted-text">
          A página que você está procurando não existe ou foi removida.
        </p>
      </div>
      <Link
        href="/produtos"
        className="rounded-md bg-nerta-blue px-6 py-2.5 font-body text-sm font-semibold text-white transition-colors duration-fast hover:bg-nerta-blue/90"
      >
        Ver catálogo
      </Link>
    </div>
  );
}
