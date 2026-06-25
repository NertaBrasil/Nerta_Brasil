import { type Page } from "@playwright/test";

// Credenciais carregadas de .env.test.local (gitignored)
// Crie o arquivo com: E2E_ADMIN_EMAIL=... e E2E_ADMIN_PASSWORD=...
export const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "";
export const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "";

export async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
  await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Acessar painel" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15_000 });
}
