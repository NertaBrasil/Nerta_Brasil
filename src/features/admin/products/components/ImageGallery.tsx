"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProductImage } from "@/features/products";
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

function withRecalculatedPositions(images: ProductImage[]): ProductImage[] {
  return images.map((image, index) => ({ ...image, position: index + 1 }));
}

export function ImageGallery({ productId, images: initialImages }: ImageGalleryProps) {
  const router = useRouter();
  const [images, setImages] = useState(() =>
    [...initialImages].sort((a, b) => a.position - b.position)
  );
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCropConfirm(blob: Blob) {
    const file = new File([blob], pendingFile?.file.name ?? "imagem.png", { type: "image/png" });
    setPendingFile(null);

    const result = await uploadProductImage(productId, file);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setImages((current) => withRecalculatedPositions([...current, result.data]));
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

  async function handleDelete(imageId: string) {
    const result = await deleteProductImage(imageId);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setImages((current) => withRecalculatedPositions(current.filter((image) => image.id !== imageId)));
    router.refresh();
  }

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
            className="relative flex w-32 flex-col gap-2"
          >
            {image.position === 1 && (
              <span className="absolute left-2 top-2 rounded-full bg-nerta-blue px-2 py-[2px] font-body text-[10px] font-semibold text-white">
                Principal
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={`Imagem ${image.position}`}
              className="aspect-square w-full rounded-md border border-navy-border object-cover"
            />
            <button
              type="button"
              aria-label="Excluir imagem"
              onClick={() => handleDelete(image.id)}
              className="font-body text-xs text-[#E5634D] hover:underline"
            >
              Excluir
            </button>
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
    </div>
  );
}
