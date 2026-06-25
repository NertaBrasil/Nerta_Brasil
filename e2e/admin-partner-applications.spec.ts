import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("Admin — candidaturas de parceria (spec 011)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/parcerias");
  });

  test("lista as candidaturas recebidas", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Parcerias/i })).toBeVisible();
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("filtra candidaturas por razão social", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Buscar por razão social…");
    await searchInput.fill("São Jorge");
    await page.waitForURL(/search=S/);
    await expect(page.getByText("Transportes São Jorge Ltda")).toBeVisible();
  });

  test("filtra por tipo de documento (CNPJ)", async ({ page }) => {
    // Select sem label — único <select> na página de filtros
    await page.locator("select").selectOption("cnpj");
    await page.waitForURL(/type=cnpj/, { timeout: 8_000 });
    // Apenas "Pessoa Jurídica" deve aparecer na coluna Tipo
    const typeCell = page.locator("td").filter({ hasText: "Pessoa Jurídica" }).first();
    await expect(typeCell).toBeVisible();
  });

  test("abre o detalhe de uma candidatura", async ({ page }) => {
    await page.getByRole("link", { name: "Ver detalhes" }).first().click();
    await expect(page).toHaveURL(/\/admin\/parcerias\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("detalhe mostra o produto de origem", async ({ page }) => {
    await page.getByRole("link", { name: "Ver detalhes" }).first().click();
    await expect(page).toHaveURL(/\/admin\/parcerias\/.+/);
    // Produto de origem sempre começa com "Nerta"
    await expect(page.getByText(/Nerta/i).first()).toBeVisible();
  });

  test("exibe candidatura de pessoa física (CPF)", async ({ page }) => {
    await page.locator("select").selectOption("cpf");
    await page.waitForURL(/type=cpf/, { timeout: 8_000 });
    const typeCell = page.locator("td").filter({ hasText: "Pessoa Física" }).first();
    await expect(typeCell).toBeVisible();
  });

  test("exibe paginação quando há mais de 10 candidaturas", async ({ page }) => {
    const total = await page.locator("table tbody tr").count();
    if (total >= 10) {
      await expect(page.getByRole("navigation")).toBeVisible();
    }
  });
});
