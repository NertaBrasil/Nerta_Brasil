"use server";

import { createClient } from "@/infrastructure/supabase/server";
import type { ActionResult } from "@/shared/types";
import { loginSchema, type LoginInput } from "./schemas";
import { checkRateLimit, clearAttempts, getClientIp, recordFailedAttempt } from "./rate-limit";

const GENERIC_ERROR = "E-mail ou senha inválidos.";

export async function login(input: LoginInput): Promise<ActionResult<void>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: GENERIC_ERROR };
  }

  const ip = await getClientIp();
  const { blocked, minutesLeft } = await checkRateLimit(ip, parsed.data.email);

  if (blocked) {
    return {
      success: false,
      error: `Muitas tentativas incorretas. Tente novamente em ${minutesLeft} minuto${minutesLeft !== 1 ? "s" : ""}.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    await recordFailedAttempt(ip, parsed.data.email);
    return { success: false, error: GENERIC_ERROR };
  }

  await clearAttempts(ip);
  return { success: true, data: undefined };
}
