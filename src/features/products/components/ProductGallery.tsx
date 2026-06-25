"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/shared/components/ui/ImagePlaceholder";
import { Lightbox } from "@/shared/components/ui/Lightbox";
import { cn } from "@/shared/utils";
import type { ProductImage } from "../types";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-navy-deeper">
        <ImagePlaceholder data-testid="product-gallery-image-placeholder" />
      </div>
    );
  }

  const selected = images[selectedIndex];
  const hasMultiple = images.length > 1;

  function goTo(index: number) {
    setSelectedIndex((index + images.length) % images.length);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square w-full overflow-hidden rounded-lg bg-navy-deeper">
        <button
          type="button"
          aria-label="Ampliar imagem"
          onClick={() => setLightboxOpen(true)}
          className="block h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.url} alt={productName} className="h-full w-full object-contain" />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Imagem anterior"
              onClick={() => goTo(selectedIndex - 1)}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/70 text-white opacity-0 transition-opacity duration-fast ease-standard group-hover:opacity-100"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3 5 8l5 5" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Próxima imagem"
              onClick={() => goTo(selectedIndex + 1)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/70 text-white opacity-0 transition-opacity duration-fast ease-standard group-hover:opacity-100"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-navy-deep/70 px-2 py-[2px] font-body text-[11px] text-white">
              {selectedIndex + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Ver imagem ${index + 1}`}
              onClick={() => goTo(index)}
              className={cn(
                "aspect-square w-16 flex-shrink-0 overflow-hidden rounded-md border bg-navy-deeper transition-colors duration-fast ease-standard",
                index === selectedIndex
                  ? "border-nerta-blue"
                  : "border-navy-border hover:border-navy-light"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={images.map((image) => ({ url: image.url, alt: productName }))}
          index={selectedIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setSelectedIndex}
        />
      )}
    </div>
  );
}
