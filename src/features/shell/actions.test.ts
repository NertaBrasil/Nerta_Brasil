import { beforeEach, describe, expect, it, vi } from "vitest";

const signOutMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("@/infrastructure/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signOut: signOutMock },
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const { logout } = await import("./actions");

describe("logout", () => {
  beforeEach(() => {
    signOutMock.mockReset();
    redirectMock.mockReset();
  });

  it("encerra a sessão Supabase e redireciona para /admin/login", async () => {
    await logout();

    expect(signOutMock).toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith("/admin/login");
  });
});
