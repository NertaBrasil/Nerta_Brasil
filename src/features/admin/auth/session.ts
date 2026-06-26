import { cache } from "react";
import { createClient } from "@/infrastructure/supabase/server";
import type { AdminProfile, AdminRole } from "@/features/admin/users";

const VALID_ROLES: AdminRole[] = ["admin", "editor", "partner_viewer"];

export const getCurrentAdminProfile = cache(async (): Promise<AdminProfile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("id, name, role, created_at")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  if (!VALID_ROLES.includes(data.role as AdminRole)) return null;

  return {
    id: data.id,
    name: data.name,
    role: data.role as AdminRole,
    created_at: data.created_at,
    email: user.email ?? "",
  };
});
