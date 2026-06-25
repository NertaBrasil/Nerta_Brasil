import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test.describe("Admin — categorias (spec 006)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/categorias");
  });

  test("lista as categorias existentes", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Categorias/i })).toBeVisible();
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible();
  });

  test("cria uma nova categoria com slug gerado automaticamente", async ({ page }) => {
    // Formulário de criação é inline na própria página
    const nameField = page.getByLabel("Nome").first();
    await nameField.fill("Categoria E2E Teste");
    const slugField = page.getByLabel("Slug").first();
    await expect(slugField).toHaveValue(/categoria-e2e-teste/i);
    await page.getByRole("button", { name: "Salvar" }).first().click();
    await expect(page.getByText("Categoria E2E Teste")).toBeVisible({ timeout: 8_000 });
  });

  test("edita uma categoria existente via modal", async ({ page }) => {
    // Clica em "Editar" na primeira linha
    await page.getByRole("button", { name: "Editar" }).first().click();

    const dialog = page.getByRole("dialog", { name: "Editar categoria" });
    await expect(dialog).toBeVisible();

    // Usa input diretamente (evita problema de ID duplicado entre form inline e modal)
    const nameInput = dialog.locator("input").first();
    await nameInput.clear();
    await nameInput.fill("Categoria E2E Editada");

    await dialog.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText("Categoria E2E Editada")).toBeVisible({ timeout: 8_000 });
  });

  test("modal de exclusão de categoria funciona corretamente", async ({ page }) => {
    await page.getByRole("button", { name: "Excluir" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Excluir categoria" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Excluir" })).toBeVisible();
    // Cancela sem excluir
    await dialog.getByRole("button", { name: "Cancelar" }).click();
    await expect(dialog).toBeHidden();
  });
});
