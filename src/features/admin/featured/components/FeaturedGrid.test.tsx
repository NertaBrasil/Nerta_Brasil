import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const toggleFeaturedMock = vi.fn();
const reorderFeaturedMock = vi.fn();
vi.mock("../actions", () => ({
  toggleFeatured: toggleFeaturedMock,
  reorderFeatured: reorderFeaturedMock,
}));

const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const { FeaturedGrid } = await import("./FeaturedGrid");

const PRODUCTS = [
  { id: "prod-1", name: "Truck Clean", slug: "truck-clean", active: true, featured_position: 1 },
  { id: "prod-2", name: "Glass Shine", slug: "glass-shine", active: true, featured_position: 2 },
];

describe("FeaturedGrid", () => {
  beforeEach(() => {
    toggleFeaturedMock.mockReset();
    reorderFeaturedMock.mockReset();
    refreshMock.mockReset();
  });

  it("exibe um estado vazio claro quando nenhum produto está destacado", () => {
    render(<FeaturedGrid products={[]} />);

    expect(screen.getByText(/nenhum produto.*destaque/i)).toBeInTheDocument();
  });

  it("exibe os produtos destacados em ordem", () => {
    render(<FeaturedGrid products={PRODUCTS} />);

    const items = screen.getAllByTestId("featured-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Truck Clean");
    expect(items[1]).toHaveTextContent("Glass Shine");
  });

  it("remove o destaque em uma única interação", async () => {
    toggleFeaturedMock.mockResolvedValue({ success: true, data: undefined });
    render(<FeaturedGrid products={PRODUCTS} />);

    const removeButtons = screen.getAllByRole("button", { name: /remover destaque/i });
    await userEvent.click(removeButtons[0]);

    expect(toggleFeaturedMock).toHaveBeenCalledWith("prod-1", false);
    expect(screen.queryByText("Truck Clean")).not.toBeInTheDocument();
    expect(refreshMock).toHaveBeenCalled();
  });

  it("ao reordenar via drag-and-drop, persiste a nova ordem chamando reorderFeatured", async () => {
    reorderFeaturedMock.mockResolvedValue({ success: true, data: undefined });
    render(<FeaturedGrid products={PRODUCTS} />);

    const items = screen.getAllByTestId("featured-item");
    fireEvent.dragStart(items[1]);
    fireEvent.dragOver(items[0]);
    fireEvent.drop(items[0]);

    expect(reorderFeaturedMock).toHaveBeenCalledWith({ productIds: ["prod-2", "prod-1"] });
    const reordered = screen.getAllByTestId("featured-item");
    expect(reordered[0]).toHaveTextContent("Glass Shine");
  });
});
