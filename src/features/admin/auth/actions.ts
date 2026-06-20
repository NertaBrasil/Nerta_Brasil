"use server";

import { createClient } from "@/infrastructure/supabase/server";
import type { ActionResult } from "@/shared/types";
import { loginSchema, type LoginInput } from "./schemas";

const GENERIC_ERROR = "E-mail ou senha inválidos.";

export async function login(input: LoginInput): Promise<ActionResult<void>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: GENERIC_ERROR };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: GENERIC_ERROR };
  }

  return { success: true, data: undefined };
}
