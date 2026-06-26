"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { PartnerApplicationForm } from "./PartnerApplicationForm";

export function PartnerButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="partner" size="lg" onClick={() => setOpen(true)}>
        Seja um parceiro
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-scrim p-5 backdrop-blur-[3px]"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Programa de Qualificação de Parceiros"
            className="relative flex w-full max-w-[560px] max-h-[90vh] flex-col overflow-hidden rounded-xl border border-navy-border bg-navy-mid shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-navy-border px-7 py-5 flex-shrink-0">
              <div>
                <p className="font-body text-xs text-muted-text">Programa · Nerta Brasil</p>
                <h2 className="text-h3">Programa de Qualificação de Parceiros</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="ml-4 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-navy-border text-muted-text transition-colors hover:bg-navy-light hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-7">
              <PartnerApplicationForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
