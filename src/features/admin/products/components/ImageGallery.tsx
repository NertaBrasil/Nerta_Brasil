"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProductImage } from "@/features/products";
import { Lightbox } from "@/shared/components/ui/Lightbox";
import { deleteProductImage, reorderProductImages, uploadProductImage } from "../actions";
import { ImageUploader } from "./ImageUploader";
import { ImageCropper } from "./ImageCropper";

type ImageGalleryProps = {
  productId: string;
  images: ProductImage[];
};

type PendingFile = {
  file: File;
  previewUrl: string;
};

type Dimensions = { width: number; height: number };

function withRecalculatedPositions(images: ProductImage[]): ProductImage[] {
  return images.map((image, index) => ({ ...image, position: index + 1 }));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageGallery({ productId, images: initialImages }: ImageGalleryProps) {
  const router = useRouter();
  const [images, setImages] = useState(() =>
    [...initialImages].sort((a, b) => a.position - b.position)
  );
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dimensionsById, setDimensionsById] = useState<Record<string, Dimensions>>({});
  const [sizeById, setSizeById] = useState<Record<string, string>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  async function handleCropConfirm(blob: Blob) {
    const file = new File([blob], pendingFile?.file.name ?? "imagem.png", { type: "image/png" });
    const sizeLabel = formatBytes(file.size);
    setPendingFile(null);

    const result = await uploadProductImage(productId, file);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setImages((current) => withRecalculatedPositions([...current, result.data]));
    setSizeById((current) => ({ ...current, [result.data.id]: sizeLabel }));
    router.refresh();
  }

  function handleDragStart(index: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      setDraggedIndex(index);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    };
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  async function persistReorder(reordered: ProductImage[]) {
    const result = await reorderProductImages({
      product_id: productId,
      image_ids: reordered.map((image) => image.id),
    });
    if (!result.success) setError(result.error);
  }

  function handleDrop(targetIndex: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (draggedIndex === null || draggedIndex === targetIndex) return;

      const reordered = [...images];
      const [moved] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      const withPositions = withRecalculatedPositions(reordered);

      setImages(withPositions);
      setDraggedIndex(null);
      void persistReorder(withPositions);
    };
  }

  function handleSetPrimary(imageId: string) {
    const chosen = images.find((image) => image.id === imageId);
    if (!chosen || chosen.position === 1) return;

    const reordered = [chosen, ...images.filter((image) => image.id !== imageId)];
    const withPositions = withRecalculatedPositions(reordered);

    setImages(withPositions);
    void persistReorder(withPositions);
  }

  async function handleDelete(imageId: string) {
    const result = await deleteProductImage(imageId);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setImages((current) => withRecalculatedPositions(current.filter((image) => image.id !== imageId)));
    router.refresh();
  }

  const lightboxImages = images.map((image) => ({ url: image.url, alt: `Imagem ${image.position}` }));

  return (
    <div className="flex flex-col gap-4">
      {error && <span className="font-body text-xs text-[#E5634D]">{error}</span>}

      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            data-testid="gallery-image"
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={handleDrop(index)}
            className="relative flex w-36 flex-col gap-1.5"
          >
            {image.position === 1 && (
              <span className="absolute left-2 top-2 z-10 rounded-full bg-nerta-blue px-2 py-[2px] font-body text-[10px] font-semibold text-white">
                Principal
              </span>
            )}
            <button
              type="button"
              aria-label={`Ampliar imagem ${image.position}`}
              onClick={() => setLightboxIndex(index)}
              className="block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={`Imagem ${image.position}`}
                onLoad={(event) => {
                  const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
                  setDimensionsById((current) => ({
                    ...current,
                    [image.id]: { width, height },
                  }));
                }}
                className="aspect-square w-full rounded-md border border-navy-border object-cover transition-opacity duration-fast hover:opacity-80"
              />
            </button>

            <span className="font-body text-[11px] text-muted-text">
              {dimensionsById[image.id]
                ? `${dimensionsById[image.id].width} × ${dimensionsById[image.id].height}px`
                : "—"}
              {sizeById[image.id] ? ` · ${sizeById[image.id]}` : ""}
            </span>

            <div className="flex items-center gap-2.5">
              {image.position !== 1 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(image.id)}
                  className="font-body text-xs text-sky-blue hover:underline"
                >
                  Tornar principal
                </button>
              )}
              <button
                type="button"
                aria-label="Excluir imagem"
                onClick={() => handleDelete(image.id)}
                className="font-body text-xs text-[#E5634D] hover:underline"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingFile ? (
        <ImageCropper
          imageUrl={pendingFile.previewUrl}
          onConfirm={handleCropConfirm}
          onCancel={() => setPendingFile(null)}
        />
      ) : (
        <ImageUploader onFileSelected={(file, previewUrl) => setPendingFile({ file, previewUrl })} />
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
