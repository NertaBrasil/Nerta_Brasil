import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductSpecs } from "./ProductSpecs";

describe("ProductSpecs", () => {
  it("não renderiza nada quando não há dilution nem attributes cadastrados", () => {
    const { container } = render(<ProductSpecs dilution={null} attributes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("exibe a diluição e os atributos quando cadastrados", () => {
    render(<ProductSpecs dilution="3–5%" attributes={["Touchless", "Agro"]} />);
    expect(screen.getByText("3–5%")).toBeInTheDocument();
    expect(screen.getByText("Touchless")).toBeInTheDocument();
    expect(screen.getByText("Agro")).toBeInTheDocument();
  });
});
