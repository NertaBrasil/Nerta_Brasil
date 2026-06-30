"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { headers } from "next/headers";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function getWindowStart(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - WINDOW_MINUTES);
  return d.toISOString();
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

export async function checkRateLimit(
  ip: string,
  email: string
): Promise<{ blocked: boolean; minutesLeft: number }> {
  const supabase = await createClient();
  const windowStart = getWindowStart();

  const { count } = await supabase
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("attempted_at", windowStart);

  if ((count ?? 0) >= MAX_ATTEMPTS) {
    const { data: oldest } = await supabase
      .from("login_attempts")
      .select("attempted_at")
      .eq("ip", ip)
      .gte("attempted_at", windowStart)
      .order("attempted_at", { ascending: true })
      .limit(1)
      .single();

    const unlocksAt = oldest
      ? new Date(new Date(oldest.attempted_at).getTime() + WINDOW_MINUTES * 60 * 1000)
      : new Date();
    const minutesLeft = Math.ceil((unlocksAt.getTime() - Date.now()) / 60000);

    return { blocked: true, minutesLeft: Math.max(1, minutesLeft) };
  }

  return { blocked: false, minutesLeft: 0 };
}

export async function recordFailedAttempt(ip: string, email: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("login_attempts").insert({ ip, email });
}

export async function clearAttempts(ip: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("login_attempts").delete().eq("ip", ip);
}
