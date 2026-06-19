import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFilters } from "./ProductFilters";
import type { Category } from "../types";

const categories: Category[] = [
  { id: "cat-1", name: "Categoria A", slug: "categoria-a", created_at: "2026-01-01T00:00:00Z" },
  { id: "cat-2", name: "Categoria B", slug: "categoria-b", created_at: "2026-01-02T00:00:00Z" },
];

const pushMock = vi.fn();
let searchParamsValue = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/produtos",
  useSearchParams: () => new URLSearchParams(searchParamsValue),
}));

describe("ProductFilters", () => {
  beforeEach(() => {
    pushMock.mockReset();
    searchParamsValue = "";
  });

  it("seleciona uma categoria e navega com o slug na query string", async () => {
    render(<ProductFilters categories={categories} />);

    await userEvent.click(screen.getByRole("button", { name: "Categoria A" }));

    expect(pushMock).toHaveBeenCalledWith("/produtos?category=categoria-a");
  });

  it("reseta para 'Todas as categorias' removendo o filtro da query string", async () => {
    searchParamsValue = "category=categoria-a";
    render(<ProductFilters categories={categories} />);

    await userEvent.click(screen.getByRole("button", { name: "Todas as categorias" }));

    expect(pushMock).toHaveBeenCalledWith("/produtos");
  });

  it("marca 'Todas as categorias' como ativa quando nenhum filtro está selecionado", () => {
    render(<ProductFilters categories={categories} />);

    expect(screen.getByRole("button", { name: "Todas as categorias" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
