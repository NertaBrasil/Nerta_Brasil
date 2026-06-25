import { createClient } from "@/infrastructure/supabase/server";
import { getProducts } from "@/features/products";
import type { Product, ProductImage, ProductSummary } from "@/features/products";

export const ADMIN_PAGE_SIZE = 10;

type AdminProductFilters = {
  page?: number;
  search?: string;
  categorySlug?: string;
  status?: string;
};

type AdminProductsResult = {
  products: ProductSummary[];
  total: number;
  totalPages: number;
};

const PRODUCT_CARD_SELECT =
  "id, slug, name, line, short_description, stock, featured, active, ml_url, purchase_mode, category:categories(id, name, slug, created_at), images:product_images(id, product_id, storage_path, url, position, created_at)";

const PRODUCT_CARD_SELECT_WITH_CATEGORY =
  "id, slug, name, line, short_description, stock, featured, active, ml_url, purchase_mode, category:categories!inner(id, name, slug, created_at), images:product_images(id, product_id, storage_path, url, position, created_at)";

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
  purchase_mode: string;
  category: ProductSummary["category"] | null;
  images: Array<{ id: string; product_id: string; storage_path: string; url: string; position: number; created_at: string }>;
};

function toSummary(row: ProductRow): ProductSummary {
  const cover_image = row.images.find((img) => img.position === 1) ?? null;
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

export async function getAdminProducts(
  filters: AdminProductFilters = {}
): Promise<AdminProductsResult> {
  const { page = 1, search = "", categorySlug = "", status = "" } = filters;
  const supabase = await createClient();

  const select = categorySlug ? PRODUCT_CARD_SELECT_WITH_CATEGORY : PRODUCT_CARD_SELECT;
  let query = supabase.from("products").select(select, { count: "exact" });

  if (search) query = query.ilike("name", `%${search}%`);
  if (categorySlug) query = query.eq("category.slug", categorySlug);
  if (status === "active") query = query.eq("active", true);
  if (status === "inactive") query = query.eq("active", false);

  const from = (page - 1) * ADMIN_PAGE_SIZE;
  const to = from + ADMIN_PAGE_SIZE - 1;
  const { data, count, error } = await query.order("name").range(from, to);

  if (error) return { products: [], total: 0, totalPages: 0 };

  const total = count ?? 0;
  return {
    products: ((data ?? []) as unknown as ProductRow[]).map(toSummary),
    total,
    totalPages: Math.ceil(total / ADMIN_PAGE_SIZE),
  };
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  return getProducts({ includeInactive: true });
}

const PRODUCT_DETAIL_SELECT =
  "id, slug, name, line, category_id, category:categories(id, name, slug, created_at), dilution, attributes, short_description, description, stock, featured, active, ml_url, purchase_mode, images:product_images(id, product_id, storage_path, url, position, created_at), created_at, updated_at";

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
