import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.fn();
const singleMock = vi.fn();
const eqMock = vi.fn(() => ({ single: singleMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));

vi.mock("@/infrastructure/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
    from: fromMock,
  })),
}));

const { getCurrentAdminProfile } = await import("./session");

describe("getCurrentAdminProfile", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    singleMock.mockReset();
    fromMock.mockClear();
  });

  it("retorna null quando não há sessão", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    const profile = await getCurrentAdminProfile();

    expect(profile).toBeNull();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("retorna null quando o papel não é admin nem editor", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "1", email: "x@nerta.com.br" } } });
    singleMock.mockResolvedValue({
      data: { id: "1", name: "Fulano", role: "guest", created_at: "2026-01-01T00:00:00Z" },
      error: null,
    });

    const profile = await getCurrentAdminProfile();

    expect(profile).toBeNull();
  });

  it("retorna o perfil quando o papel é admin ou editor", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "1", email: "admin@nerta.com.br" } } });
    singleMock.mockResolvedValue({
      data: { id: "1", name: "Admin", role: "admin", created_at: "2026-01-01T00:00:00Z" },
      error: null,
    });

    const profile = await getCurrentAdminProfile();

    expect(profile).toEqual({
      id: "1",
      name: "Admin",
      role: "admin",
      created_at: "2026-01-01T00:00:00Z",
      email: "admin@nerta.com.br",
    });
  });
});
