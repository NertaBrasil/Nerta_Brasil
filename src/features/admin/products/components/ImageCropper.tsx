"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { cropImageToSquareBlob } from "../cropImage";

type ImageCropperProps = {
  imageUrl: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
};

export function ImageCropper({ imageUrl, onConfirm, onCancel }: ImageCropperProps) {
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsCropping(true);
    setError(null);
    try {
      const blob = await cropImageToSquareBlob(imageUrl);
      onConfirm(blob);
    } catch {
      setError("Não foi possível recortar a imagem.");
    } finally {
      setIsCropping(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square w-full max-w-xs overflow-hidden rounded-md border border-navy-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Pré-visualização do recorte" className="h-full w-full object-cover" />
      </div>
      {error && <span className="font-body text-xs text-[#E5634D]">{error}</span>}
      <div className="flex gap-3">
        <Button type="button" onClick={handleConfirm} disabled={isCropping}>
          {isCropping ? "Recortando..." : "Confirmar recorte"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isCropping}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
