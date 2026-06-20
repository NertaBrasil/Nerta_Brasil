// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getUserMock = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: getUserMock },
  })),
}));

const { proxy } = await import("./proxy");

describe("proxy", () => {
  beforeEach(() => {
    getUserMock.mockReset();
  });

  it("redireciona para /admin/login quando não há sessão em rota protegida", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    const request = new NextRequest("http://localhost:3000/admin/produtos");

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/admin/login");
  });

  it("permite o acesso quando há sessão válida", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "1" } } });
    const request = new NextRequest("http://localhost:3000/admin/produtos");

    const response = await proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("nunca verifica sessão em /admin/login", async () => {
    const request = new NextRequest("http://localhost:3000/admin/login");

    const response = await proxy(request);

    expect(getUserMock).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBeNull();
  });
});
