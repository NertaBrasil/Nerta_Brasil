"use client";

import { useEffect, useState } from "react";

type LightboxImage = {
  url: string;
  alt: string;
};

type LightboxProps = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const image = images[index];

  useEffect(() => {
    setDimensions(null);
  }, [image?.url]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (images.length < 2) return;
      if (event.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [index, images.length, onClose, onIndexChange]);

  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-scrim p-5 backdrop-blur-[3px]"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
      >
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 4l12 12M16 4 4 16" />
        </svg>
      </button>

      <div
        className="relative flex max-h-[80vh] max-w-[85vw] items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
            className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-navy-deep/70 text-white hover:bg-navy-deep"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3 5 8l5 5" />
            </svg>
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.alt}
          onLoad={(event) =>
            setDimensions({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })
          }
          className="max-h-[80vh] max-w-[85vw] rounded-md object-contain"
        />

        {images.length > 1 && (
          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={() => onIndexChange((index + 1) % images.length)}
            className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-navy-deep/70 text-white hover:bg-navy-deep"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        )}
      </div>

      <span className="font-body text-xs text-muted-text" onClick={(event) => event.stopPropagation()}>
        {dimensions ? `${dimensions.width} × ${dimensions.height}px` : ""}
        {images.length > 1 && (dimensions ? ` · ${index + 1}/${images.length}` : `${index + 1}/${images.length}`)}
      </span>
    </div>
  );
}
