import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("exibe os links de navegação Início, Catálogo e Sobre", () => {
    render(<Header />);

    const inicioLinks = screen.getAllByRole("link", { name: "Início" });
    const catalogoLinks = screen.getAllByRole("link", { name: "Catálogo" });
    const sobreLinks = screen.getAllByRole("link", { name: "Sobre" });

    expect(inicioLinks.length).toBeGreaterThanOrEqual(1);
    expect(inicioLinks[0]).toHaveAttribute("href", "/");
    expect(catalogoLinks.length).toBeGreaterThanOrEqual(1);
    expect(catalogoLinks[0]).toHaveAttribute("href", "/produtos");
    expect(sobreLinks.length).toBeGreaterThanOrEqual(1);
    expect(sobreLinks[0]).toHaveAttribute("href", "/sobre");
  });
});
