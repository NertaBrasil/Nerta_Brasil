import { test, expect } from "@playwright/test";
import { loginAsAdmin, ADMIN_EMAIL } from "./helpers/auth";

test.describe("Admin — autenticação", () => {
  test("redireciona /admin para /admin/login quando não autenticado", async ({ page }) => {
    await page.goto("/admin/categorias");
    await expect(page).toHaveURL(/admin\/login/);
  });

  test("login com credenciais válidas redireciona para o painel", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByText("Claude QA").first()).toBeVisible();
  });

  test("login com senha errada exibe erro", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill("senhaerrada123");
    await page.getByRole("button", { name: "Acessar painel" }).click();
    await expect(page.getByRole("alert").or(page.getByText(/inválido|incorreto|erro/i))).toBeVisible({ timeout: 8_000 });
  });

  test("logout volta para a tela de login", async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole("button", { name: /Sair/i }).click();
    await expect(page).toHaveURL(/admin\/login/);
  });
});
