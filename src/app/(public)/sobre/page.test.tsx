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
});
