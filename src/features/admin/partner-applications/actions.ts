"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import type { ActionResult } from "@/shared/types";
import type { PartnerApplication, PartnerApplicationSummary } from "@/features/partner-applications";

const NOT_AUTHENTICATED_ERROR = "Não autenticado.";
const NOT_FOUND_ERROR = "Candidatura não encontrada.";

const SUMMARY_SELECT = "id, legal_name, document_type, product_name_snapshot, relationship_interest, created_at";

export async function getPartnerApplications(): Promise<ActionResult<PartnerApplicationSummary[]>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("partner_applications")
    .select(SUMMARY_SELECT)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: "Erro ao buscar candidaturas." };

  return { success: true, data: (data ?? []) as unknown as PartnerApplicationSummary[] };
}

export async function getPartnerApplicationById(id: string): Promise<ActionResult<PartnerApplication>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("partner_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return { success: false, error: NOT_FOUND_ERROR };

  return { success: true, data: data as unknown as PartnerApplication };
}
