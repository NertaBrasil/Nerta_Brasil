import { ImagePlaceholder } from "@/shared/components/ui/ImagePlaceholder";
import type { ProductImage } from "../types";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-navy-deeper">
        <ImagePlaceholder data-testid="product-gallery-image-placeholder" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.id}
          className="aspect-square w-full overflow-hidden rounded-lg bg-navy-deeper"
        >
          <img src={image.url} alt={productName} className="h-full w-full object-contain" />
        </div>
      ))}
    </div>
  );
}
