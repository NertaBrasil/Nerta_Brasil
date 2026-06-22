import { createClient } from "@/infrastructure/supabase/server";
import { getProducts } from "@/features/products";
import type { Product, ProductImage, ProductSummary } from "@/features/products";

export async function getAllProducts(): Promise<ProductSummary[]> {
  return getProducts({ includeInactive: true });
}

const PRODUCT_DETAIL_SELECT =
  "id, slug, name, line, category_id, category:categories(id, name, slug, created_at), dilution, attributes, short_description, description, stock, featured, active, ml_url, images:product_images(id, product_id, storage_path, url, position, created_at), created_at, updated_at";

type ProductDetailRow = Omit<Product, "images" | "cover_image"> & { images: ProductImage[] };

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const row = data as unknown as ProductDetailRow;
  const images = [...row.images].sort((a, b) => a.position - b.position);
  const cover_image = images.find((image) => image.position === 1) ?? null;

  return { ...row, images, cover_image };
}
