import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

// Sufixo para tornar nomes únicos por execução
const RUN_ID = Date.now().toString().slice(-6);

test.describe("Admin — produtos CRUD (spec 007)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/produtos");
  });

  test("lista produtos com paginação", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Produtos/i })).toBeVisible();
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible();
  });

  test("filtra produtos por texto", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar/i);
    await searchInput.fill("foam");
    await page.waitForURL(/search=foam/);
    const rows = page.locator("table tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await expect(rows.first()).toContainText(/foam/i);
  });

  test("filtra produtos por status ativo/inativo", async ({ page }) => {
    // Página tem dois selects: categoria (index 0) e status (index 1)
    const statusSelect = page.locator("select").nth(1);
    await statusSelect.selectOption("active");
    await page.waitForURL(/status=active/, { timeout: 8_000 });
  });

  test("cria um novo produto com modo de compra Mercado Livre", async ({ page }) => {
    await page.getByRole("link", { name: "+ Novo produto" }).click();
    await expect(page).toHaveURL(/produtos\/novo/);

    const productName = `E2E ML ${RUN_ID}`;
    await page.getByLabel("Nome").fill(productName);
    await page.getByLabel("Linha comercial").fill("Linha E2E");
    await page.getByLabel("Estoque").fill("10");
    // Seleciona a primeira categoria disponível (campo obrigatório no DB)
    await page.getByLabel("Categoria").selectOption({ index: 1 });

    // Modo de compra: "Link Mercado Livre" (valor padrão = mercado_livre)
    await page.getByLabel("Modo de compra").selectOption("mercado_livre");
    await page.getByLabel("Link Mercado Livre").fill("https://www.mercadolivre.com.br/produto-e2e");

    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page).toHaveURL(/\/admin\/produtos$/, { timeout: 15_000 });
    await expect(page.getByText(productName)).toBeVisible({ timeout: 10_000 });
  });

  test("cria um novo produto com modo de compra formulário de parceria", async ({ page }) => {
    await page.getByRole("link", { name: "+ Novo produto" }).click();
    await expect(page).toHaveURL(/produtos\/novo/);

    const productName = `E2E Parceria ${RUN_ID}`;
    await page.getByLabel("Nome").fill(productName);
    await page.getByLabel("Linha comercial").fill("Linha E2E");
    await page.getByLabel("Estoque").fill("5");
    await page.getByLabel("Categoria").selectOption({ index: 1 });
    await page.getByLabel("Modo de compra").selectOption("formulario_parceria");

    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page).toHaveURL(/\/admin\/produtos$/, { timeout: 15_000 });
    await expect(page.getByText(productName)).toBeVisible({ timeout: 10_000 });
  });

  test("edita um produto existente", async ({ page }) => {
    await page.getByRole("link", { name: "Editar" }).first().click();
    await expect(page).toHaveURL(/\/admin\/produtos\/.+/);

    const nameField = page.getByLabel("Nome");
    const originalName = await nameField.inputValue();
    await nameField.clear();
    await nameField.fill(originalName + " (editado)");
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page).toHaveURL(/\/admin\/produtos$/, { timeout: 15_000 });
    await expect(page.getByText(originalName + " (editado)")).toBeVisible({ timeout: 10_000 });
  });

  test("exibe link de volta na página de edição", async ({ page }) => {
    await page.getByRole("link", { name: "Editar" }).first().click();
    await expect(page).toHaveURL(/\/admin\/produtos\/.+/);
    // BackLink renderiza <a>SVG + "Voltar para produtos"</a>
    await expect(page.getByText("Voltar para produtos")).toBeVisible();
  });
});

test.describe("Admin — imagens de produto (spec 008)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/produtos");
  });

  test("galeria de imagens está visível na página de edição do produto", async ({ page }) => {
    await page.getByRole("link", { name: "Editar" }).first().click();
    await expect(page).toHaveURL(/\/admin\/produtos\/.+/);
    // A página de edição tem <h2>Imagens</h2>
    await expect(page.getByRole("heading", { name: "Imagens" })).toBeVisible();
  });
});
