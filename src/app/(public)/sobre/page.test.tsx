import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("exibe o título institucional e um CTA para o catálogo", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorar catálogo/i })).toHaveAttribute(
      "href",
      "/produtos"
    );
  });

  it("exibe os indicadores institucionais (anos de tecnologia, países, certificação)", () => {
    render(<AboutPage />);

    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("60+")).toBeInTheDocument();
    expect(screen.getByText(/ISO/)).toBeInTheDocument();
  });

  it("conta a história da marca, distinta do conteúdo da home", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /nossa história/i })).toBeInTheDocument();
  });

  it("explica a ciência por trás do produto em itens numerados", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: /a ciência por trás do produto/i })
    ).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
