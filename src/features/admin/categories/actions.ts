"use server";

import { createAdminClient } from "@/infrastructure/supabase/admin";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import type { ActionResult } from "@/shared/types";
import type { Category } from "@/features/products";
import {
  categorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "./schemas";

const NOT_AUTHENTICATED_ERROR = "Não autenticado.";
const DUPLICATE_ERROR = "Já existe uma categoria com esse nome ou slug.";
const LINKED_PRODUCTS_ERROR =
  "Categoria possui produtos vinculados. Reclassifique os produtos antes de excluir.";

export async function createCategory(input: CreateCategoryInput): Promise<ActionResult<Category>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name, slug: parsed.data.slug })
    .select("id, name, slug, created_at")
    .single();

  if (error) {
    if (error.code === "23505") return { success: false, error: DUPLICATE_ERROR };
    return { success: false, error: "Erro ao criar categoria." };
  }

  return { success: true, data: data as Category };
}

export async function updateCategory(input: UpdateCategoryInput): Promise<ActionResult<Category>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .update({ name: parsed.data.name, slug: parsed.data.slug })
    .eq("id", parsed.data.id)
    .select("id, name, slug, created_at")
    .single();

  if (error) {
    if (error.code === "23505") return { success: false, error: DUPLICATE_ERROR };
    return { success: false, error: "Erro ao atualizar categoria." };
  }

  return { success: true, data: data as Category };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = createAdminClient();

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) return { success: false, error: "Erro ao verificar produtos vinculados." };
  if ((count ?? 0) > 0) return { success: false, error: LINKED_PRODUCTS_ERROR };

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: "Erro ao excluir categoria." };

  return { success: true, data: undefined };
}
