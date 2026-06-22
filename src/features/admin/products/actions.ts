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
import type { ReorderImagesInput } from "./types";

const NOT_AUTHENTICATED_ERROR = "Não autenticado.";
const DUPLICATE_SLUG_ERROR = "Já existe um produto com esse slug.";
const INVALID_CATEGORY_ERROR = "Categoria inválida. Selecione uma categoria existente.";
const INVALID_IMAGE_ERROR = "Arquivo inválido. Selecione uma imagem.";
const IMAGES_BUCKET = "product-images";

const PRODUCT_SELECT =
  "id, slug, name, line, category_id, category:categories(id, name, slug, created_at), dilution, attributes, short_description, description, stock, featured, active, ml_url, purchase_mode, images:product_images(id, product_id, storage_path, url, position, created_at), created_at, updated_at";

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

export async function uploadProductImage(
  product_id: string,
  file: File
): Promise<ActionResult<ProductImage>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  if (!file.type.startsWith("image/")) {
    return { success: false, error: INVALID_IMAGE_ERROR };
  }

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", product_id);

  const position = (count ?? 0) + 1;
  const path = `products/${product_id}/${crypto.randomUUID()}.png`;

  const { error: uploadError } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, file, { contentType: "image/png" });

  if (uploadError) return { success: false, error: "Erro ao enviar imagem." };

  const {
    data: { publicUrl },
  } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id, storage_path: path, url: publicUrl, position })
    .select("id, product_id, storage_path, url, position, created_at")
    .single();

  if (error) return { success: false, error: "Erro ao salvar imagem." };

  return { success: true, data: data as ProductImage };
}

export async function deleteProductImage(image_id: string): Promise<ActionResult> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = createAdminClient();

  const { data: image, error: fetchError } = await supabase
    .from("product_images")
    .select("id, product_id, storage_path, position")
    .eq("id", image_id)
    .single();

  if (fetchError || !image) return { success: false, error: "Imagem não encontrada." };

  await supabase.storage.from(IMAGES_BUCKET).remove([image.storage_path]);
  await supabase.from("product_images").delete().eq("id", image_id);

  const { data: remaining } = await supabase
    .from("product_images")
    .select("id, position")
    .eq("product_id", image.product_id)
    .order("position", { ascending: true });

  for (let index = 0; index < (remaining ?? []).length; index += 1) {
    const row = (remaining as { id: string; position: number }[])[index];
    const desired = index + 1;
    if (row.position !== desired) {
      await supabase.from("product_images").update({ position: desired }).eq("id", row.id);
    }
  }

  return { success: true, data: undefined };
}

export async function reorderProductImages(input: ReorderImagesInput): Promise<ActionResult> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = createAdminClient();

  for (let index = 0; index < input.image_ids.length; index += 1) {
    const { error } = await supabase
      .from("product_images")
      .update({ position: index + 1 })
      .eq("id", input.image_ids[index])
      .eq("product_id", input.product_id);

    if (error) return { success: false, error: "Erro ao reordenar imagens." };
  }

  return { success: true, data: undefined };
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
