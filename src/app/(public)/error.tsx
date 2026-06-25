"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PublicError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Algo deu errado</h1>
        <p className="mt-2 font-body text-sm text-muted-text">
          Ocorreu um erro inesperado. Tente novamente ou volte mais tarde.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-nerta-blue px-6 py-2.5 font-body text-sm font-semibold text-white transition-colors duration-fast hover:bg-nerta-blue/90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
