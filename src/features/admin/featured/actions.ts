"use server";

import { createAdminClient } from "@/infrastructure/supabase/admin";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import type { ActionResult } from "@/shared/types";
import type { ReorderFeaturedInput } from "./types";

const NOT_AUTHENTICATED_ERROR = "Não autenticado.";
const NOT_FOUND_ERROR = "Produto não encontrado.";
const INCONSISTENT_LIST_ERROR = "Lista de destaques inconsistente com o estado atual.";

export async function toggleFeatured(product_id: string, featured: boolean): Promise<ActionResult> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = createAdminClient();

  if (!featured) {
    const { error } = await supabase
      .from("products")
      .update({ featured: false, featured_position: null })
      .eq("id", product_id);

    if (error) return { success: false, error: "Erro ao remover destaque." };
    return { success: true, data: undefined };
  }

  const { data: current, error: fetchError } = await supabase
    .from("products")
    .select("featured, featured_position")
    .eq("id", product_id)
    .single();

  if (fetchError || !current) return { success: false, error: NOT_FOUND_ERROR };
  if (current.featured) return { success: true, data: undefined };

  const { data: topFeatured, error: maxError } = await supabase
    .from("products")
    .select("featured_position")
    .eq("featured", true)
    .order("featured_position", { ascending: false })
    .limit(1);

  if (maxError) return { success: false, error: "Erro ao calcular posição de destaque." };

  const currentMax = (topFeatured as { featured_position: number }[] | null)?.[0]?.featured_position ?? 0;
  const nextPosition = currentMax + 1;

  const { error } = await supabase
    .from("products")
    .update({ featured: true, featured_position: nextPosition })
    .eq("id", product_id);

  if (error) return { success: false, error: "Erro ao marcar destaque." };
  return { success: true, data: undefined };
}

export async function reorderFeatured(input: ReorderFeaturedInput): Promise<ActionResult> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = createAdminClient();

  const { data: currentFeatured, error: fetchError } = await supabase
    .from("products")
    .select("id")
    .eq("featured", true);

  if (fetchError) return { success: false, error: "Erro ao validar destaques atuais." };

  const currentIds = new Set(((currentFeatured as { id: string }[] | null) ?? []).map((row) => row.id));
  const inputIds = input.productIds;
  const uniqueInputIds = new Set(inputIds);

  const isConsistent =
    inputIds.length === currentIds.size &&
    uniqueInputIds.size === inputIds.length &&
    inputIds.every((id) => currentIds.has(id));

  if (!isConsistent) return { success: false, error: INCONSISTENT_LIST_ERROR };

  for (let index = 0; index < inputIds.length; index += 1) {
    const { error } = await supabase
      .from("products")
      .update({ featured_position: index + 1 })
      .eq("id", inputIds[index]);

    if (error) return { success: false, error: "Erro ao reordenar destaques." };
  }

  return { success: true, data: undefined };
}
