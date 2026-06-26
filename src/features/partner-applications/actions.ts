"use server";

import { createClient } from "@/infrastructure/supabase/server";
import type { ActionResult } from "@/shared/types";
import { partnerApplicationSchema } from "./schemas";
import type { SubmitPartnerApplicationInput } from "./types";

const PRODUCT_NOT_FOUND_ERROR = "Produto não encontrado.";
const SUBMIT_ERROR = "Erro ao enviar formulário.";

export async function submitPartnerApplication(
  input: SubmitPartnerApplicationInput
): Promise<ActionResult<void>> {
  const parsed = partnerApplicationSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const supabase = await createClient();

  let productNameSnapshot = "";

  if (parsed.data.product_id) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("name")
      .eq("id", parsed.data.product_id)
      .single();

    if (productError || !product) return { success: false, error: PRODUCT_NOT_FOUND_ERROR };
    productNameSnapshot = product.name;
  }

  const { error } = await supabase.from("partner_applications").insert({
    ...parsed.data,
    product_name_snapshot: productNameSnapshot,
  });

  if (error) return { success: false, error: SUBMIT_ERROR };

  return { success: true, data: undefined };
}
