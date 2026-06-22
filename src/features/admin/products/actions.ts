"use server";

import { createAdminClient } from "@/infrastructure/supabase/admin";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import type { ActionResult } from "@/shared/types";
import type { Product, ProductImage } from "@/features/products";
import {
  productSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "./schemas";

const NOT_AUTHENTICATED_ERROR = "Não autenticado.";
const DUPLICATE_SLUG_ERROR = "Já existe um produto com esse slug.";
const INVALID_CATEGORY_ERROR = "Categoria inválida. Selecione uma categoria existente.";

const PRODUCT_SELECT =
  "id, slug, name, line, category_id, category:categories(id, name, slug, created_at), dilution, attributes, short_description, description, stock, featured, active, ml_url, images:product_images(id, product_id, storage_path, url, position, created_at), created_at, updated_at";

type ProductRow = Omit<Product, "images" | "cover_image"> & { images: ProductImage[] };

function toProduct(row: ProductRow): Product {
  const images = [...row.images].sort((a, b) => a.position - b.position);
  const cover_image = images.find((image) => image.position === 1) ?? null;
  return { ...row, images, cover_image };
}

function mapWriteError(error: { code?: string }): string {
  if (error.code === "23505") return DUPLICATE_SLUG_ERROR;
  if (error.code === "23503") return INVALID_CATEGORY_ERROR;
  return "Erro ao salvar produto.";
}

export async function createProduct(input: CreateProductInput): Promise<ActionResult<Product>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert(parsed.data)
    .select(PRODUCT_SELECT)
    .single();

  if (error) return { success: false, error: mapWriteError(error) };

  return { success: true, data: toProduct(data as unknown as ProductRow) };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: "Erro ao excluir produto." };

  return { success: true, data: undefined };
}

export async function toggleProductActive(
  id: string,
  active: boolean
): Promise<ActionResult<Pick<Product, "id" | "active">>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update({ active })
    .eq("id", id)
    .select("id, active")
    .single();

  if (error) return { success: false, error: "Erro ao atualizar status." };

  return { success: true, data: data as Pick<Product, "id" | "active"> };
}

export async function updateProduct(input: UpdateProductInput): Promise<ActionResult<Product>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { id, ...fields } = parsed.data;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) return { success: false, error: mapWriteError(error) };

  return { success: true, data: toProduct(data as unknown as ProductRow) };
}
