"use server";

import { createAdminClient } from "@/infrastructure/supabase/admin";
import { getCurrentAdminProfile } from "@/features/admin/auth";
import type { ActionResult } from "@/shared/types";
import { createUserSchema } from "./schemas";
import type { AdminProfile, AdminRole, CreateUserInput } from "./types";

const NOT_AUTHENTICATED_ERROR = "Não autenticado.";
const NOT_AUTHORIZED_ERROR = "Apenas administradores podem gerenciar usuários.";
const DUPLICATE_EMAIL_ERROR = "Já existe um usuário com esse e-mail.";
const SELF_DELETE_ERROR = "Você não pode excluir a própria conta.";

type AdminProfileRow = {
  id: string;
  name: string;
  role: AdminRole;
  created_at: string;
};

function isDuplicateEmailError(error: { code?: string; message?: string }): boolean {
  return error.code === "email_exists" || Boolean(error.message?.toLowerCase().includes("already"));
}

async function requireAdmin(): Promise<ActionResult<AdminProfile>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: NOT_AUTHENTICATED_ERROR };
  if (profile.role !== "admin") return { success: false, error: NOT_AUTHORIZED_ERROR };
  return { success: true, data: profile };
}

export async function createUser(input: CreateUserInput): Promise<ActionResult<AdminProfile>> {
  const guard = await requireAdmin();
  if (!guard.success) return guard;

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const supabase = createAdminClient();

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (createError || !created?.user) {
    if (createError && isDuplicateEmailError(createError)) {
      return { success: false, error: DUPLICATE_EMAIL_ERROR };
    }
    return { success: false, error: "Erro ao criar usuário." };
  }

  const userId = created.user.id;

  const { data: profileRow, error: profileError } = await supabase
    .from("admin_profiles")
    .insert({ id: userId, name: parsed.data.name, role: parsed.data.role })
    .select("id, name, role, created_at")
    .single();

  if (profileError || !profileRow) {
    await supabase.auth.admin.deleteUser(userId);
    return { success: false, error: "Erro ao criar usuário." };
  }

  return {
    success: true,
    data: { ...(profileRow as AdminProfileRow), email: parsed.data.email },
  };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.success) return guard;

  if (id === guard.data.id) return { success: false, error: SELF_DELETE_ERROR };

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return { success: false, error: "Erro ao excluir usuário." };

  return { success: true, data: undefined };
}

export async function getAdminUsers(): Promise<ActionResult<AdminProfile[]>> {
  const guard = await requireAdmin();
  if (!guard.success) return guard;

  const supabase = createAdminClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("admin_profiles")
    .select("id, name, role, created_at")
    .order("name", { ascending: true });

  if (profilesError) return { success: false, error: "Erro ao carregar usuários." };

  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) return { success: false, error: "Erro ao carregar usuários." };

  const emailById = new Map(
    (usersData?.users ?? []).map((user: { id: string; email?: string }) => [user.id, user.email ?? ""])
  );

  const result = ((profiles ?? []) as AdminProfileRow[]).map((row) => ({
    ...row,
    email: emailById.get(row.id) ?? "",
  }));

  return { success: true, data: result };
}
