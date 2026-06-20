import { createClient } from "@/infrastructure/supabase/server";
import type { Category, Product, ProductSummary, ProductImage } from "./types";

type GetProductsFilters = {
  category_slug?: string;
};

const PRODUCT_CARD_SELECT =
  "id, slug, name, line, short_description, stock, featured, active, ml_url, category:categories(id, name, slug, created_at), images:product_images(id, product_id, storage_path, url, position, created_at)";

const PRODUCT_CARD_SELECT_FILTERED_BY_CATEGORY =
  "id, slug, name, line, short_description, stock, featured, active, ml_url, category:categories!inner(id, name, slug, created_at), images:product_images(id, product_id, storage_path, url, position, created_at)";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  line: string;
  short_description: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  ml_url: string | null;
  category: ProductSummary["category"] | null;
  images: ProductImage[];
};

function toProductSummary(row: ProductRow): ProductSummary {
  const cover_image = row.images.find((image) => image.position === 1) ?? null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    line: row.line,
    category: row.category,
    short_description: row.short_description,
    stock: row.stock,
    featured: row.featured,
    active: row.active,
    ml_url: row.ml_url,
    cover_image,
  };
}

export async function getProducts(filters: GetProductsFilters = {}): Promise<ProductSummary[]> {
  const supabase = await createClient();

  const select = filters.category_slug
    ? PRODUCT_CARD_SELECT_FILTERED_BY_CATEGORY
    : PRODUCT_CARD_SELECT;

  let query = supabase
    .from("products")
    .select(select)
    .eq("active", true)
    .order("name", { ascending: true });

  if (filters.category_slug) {
    query = query.eq("category.slug", filters.category_slug);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as unknown as ProductRow[]).map(toProductSummary);
}

const PRODUCT_DETAIL_SELECT =
  "id, slug, name, line, category_id, category:categories(id, name, slug, created_at), dilution, attributes, short_description, description, stock, featured, active, ml_url, images:product_images(id, product_id, storage_path, url, position, created_at), created_at, updated_at";

type ProductDetailRow = Omit<Product, "images" | "cover_image">  & {
  images: ProductImage[];
};

function toProduct(row: ProductDetailRow): Product {
  const images = [...row.images].sort((a, b) => a.position - b.position);
  const cover_image = images.find((image) => image.position === 1) ?? null;

  return { ...row, images, cover_image };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_DETAIL_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;

  return toProduct(data as unknown as ProductDetailRow);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (error) throw error;

  return (data ?? []) as unknown as Category[];
}
