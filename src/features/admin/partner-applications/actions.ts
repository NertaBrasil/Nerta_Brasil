"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import type { ActionResult } from "@/shared/types";
import type { PartnerApplication, PartnerApplicationSummary } from "@/features/partner-applications";

const NOT_AUTHENTICATED_ERROR = "Não autenticado.";
const NOT_FOUND_ERROR = "Candidatura não encontrada.";

const SUMMARY_SELECT = "id, legal_name, document_type, product_name_snapshot, relationship_interest, created_at";

export const PARTNER_PAGE_SIZE = 10;

type PartnerApplicationFilters = {
  page?: number;
  search?: string;
  documentType?: string;
};

type PartnerApplicationsResult = {
  data: PartnerApplicationSummary[];
  total: number;
  totalPages: number;
};

export async function getPartnerApplications(
  filters: PartnerApplicationFilters = {}
): Promise<ActionResult<PartnerApplicationsResult>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };

  const { page = 1, search = "", documentType = "" } = filters;
  const supabase = await createClient();

  let query = supabase.from("partner_applications").select(SUMMARY_SELECT, { count: "exact" });

  if (search) query = query.ilike("legal_name", `%${search}%`);
  if (documentType) query = query.eq("document_type", documentType);

  const from = (page - 1) * PARTNER_PAGE_SIZE;
  const to = from + PARTNER_PAGE_SIZE - 1;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return { success: false, error: "Erro ao buscar candidaturas." };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      data: (data ?? []) as unknown as PartnerApplicationSummary[],
      total,
      totalPages: Math.ceil(total / PARTNER_PAGE_SIZE),
    },
  };
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
