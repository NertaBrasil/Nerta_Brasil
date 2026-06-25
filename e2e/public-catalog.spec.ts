import { test, expect } from "@playwright/test";

test.describe("Catálogo público", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/produtos");
  });

  test("exibe o título e produtos do catálogo", async ({ page }) => {
    await expect(page).toHaveTitle(/Catálogo de Produtos/);
    await expect(page.getByRole("heading", { name: "Catálogo de Produtos" })).toBeVisible();
    const productLinks = page.locator('a[href^="/produtos/"]').filter({ hasNot: page.locator('[href*="parceria"]') });
    await expect(productLinks.first()).toBeVisible();
  });

  test("filtra produtos por categoria", async ({ page }) => {
    const firstChip = page.getByRole("group", { name: "Filtrar por categoria" }).getByRole("button").nth(1);
    await firstChip.click();
    await page.waitForURL(/category=/);
    const productLinks = page.locator('a[href^="/produtos/"]');
    await expect(productLinks.first()).toBeVisible();
  });

  test("busca produtos por texto", async ({ page }) => {
    const searchInput = page.getByLabel("Buscar produto");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("foam");
    await page.waitForURL(/search=foam/);
    await expect(page.locator('a[href^="/produtos/"]').first()).toContainText(/foam/i);
  });

  test("busca sem resultados exibe estado vazio", async ({ page }) => {
    const searchInput = page.getByLabel("Buscar produto");
    await searchInput.fill("xyzprodutoinexistente");
    await page.waitForURL(/search=/);
    await expect(page.getByText(/nenhum produto/i).or(page.locator('[data-testid="empty-state"]'))).toBeVisible();
  });

  test("combina filtro de categoria com busca", async ({ page }) => {
    const searchInput = page.getByLabel("Buscar produto");
    await searchInput.fill("nerta");
    await page.waitForURL(/search=nerta/);
    const chip = page.getByRole("group", { name: "Filtrar por categoria" }).getByRole("button").nth(1);
    await chip.click();
    await expect(page).toHaveURL(/search=nerta/);
    await expect(page).toHaveURL(/category=/);
  });
});

test.describe("Página de produto", () => {
  test("exibe nome e CTA correto para modo Mercado Livre", async ({ page }) => {
    await page.goto("/produtos/nerta-fleet-foam-25l");
    await expect(page).toHaveTitle(/Nerta Fleet Foam/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Nerta Fleet Foam");
    await expect(page.getByRole("link", { name: /Comprar no Mercado Livre/i })).toBeVisible();
  });

  test("exibe CTA 'Comprar este produto' para modo formulário de parceria", async ({ page }) => {
    await page.goto("/produtos/nerta-agro-power-25l");
    await expect(page.getByRole("link", { name: /Comprar este produto/i })).toBeVisible();
  });

  test("página de produto inexistente exibe not-found", async ({ page }) => {
    await page.goto("/produtos/produto-que-nao-existe-xyz");
    await expect(page.getByRole("heading", { name: /não encontrada/i })).toBeVisible();
  });
});

test.describe("Formulário de parceria", () => {
  test("abre o formulário ao clicar em 'Comprar este produto'", async ({ page }) => {
    await page.goto("/produtos/nerta-agro-power-25l");
    await page.getByRole("link", { name: /Comprar este produto/i }).click();
    await expect(page).toHaveURL(/parceria/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Solicitar/);
  });

  test("preenche e envia o formulário como pessoa jurídica (CNPJ)", async ({ page }) => {
    await page.goto("/produtos/nerta-agro-power-25l/parceria");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Solicitar/);

    // Etapa 0 — Identificação (Pessoa Jurídica já é o padrão)
    await page.getByRole("button", { name: "Pessoa Jurídica" }).click();

    await page.getByLabel("Razão Social").fill("Transportes Teste Ltda");
    await page.getByLabel("Nome Fantasia").fill("TransTeste");
    // CNPJ válido (verificado pelo algoritmo)
    await page.getByLabel("CNPJ").fill("11.222.333/0001-81");
    await page.getByLabel("Cidade").fill("São Paulo");
    await page.getByLabel("Estado").fill("SP");
    await page.getByLabel("Nome do responsável").fill("João Silva");
    await page.getByLabel("Cargo").fill("Gerente");
    await page.getByLabel("Telefone").fill("+55 11 99999-0000");
    await page.getByLabel("E-mail").fill("joao@transportesteste.com.br");

    // Avança todas as etapas (steps 0→5, só step 0 valida)
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Avançar" }).click();
      await page.waitForTimeout(200);
    }

    // Etapa 5 — "Enviar" (último step)
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("heading", { name: "Candidatura enviada!" })).toBeVisible({ timeout: 15_000 });
  });

  test("preenche e envia o formulário como pessoa física (CPF)", async ({ page }) => {
    await page.goto("/produtos/nerta-agro-power-25l/parceria");

    // Etapa 0 — Identificação: Pessoa Física
    await page.getByRole("button", { name: "Pessoa Física" }).click();

    // CPF válido
    await page.getByLabel("Nome Completo").fill("Maria Fernanda Souza");
    await page.getByLabel("CPF").fill("123.456.789-09");
    await page.getByLabel("Cidade").fill("Curitiba");
    await page.getByLabel("Estado").fill("PR");
    await page.getByLabel("Nome do responsável").fill("Maria Fernanda Souza");
    await page.getByLabel("Cargo").fill("Proprietária");
    await page.getByLabel("Telefone").fill("+55 41 98888-1111");
    await page.getByLabel("E-mail").fill("maria@exemplo.com.br");

    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Avançar" }).click();
      await page.waitForTimeout(200);
    }

    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("heading", { name: "Candidatura enviada!" })).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Site público — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("exibe hamburger menu e abre o drawer no mobile", async ({ page }) => {
    await page.goto("/");
    const hamburger = page.getByRole("button", { name: "Abrir menu" });
    await expect(hamburger).toBeVisible();
    // { force: true } porque o Next.js dev overlay pode interceptar o clique
    await hamburger.click({ force: true });
    await expect(page.getByRole("link", { name: "Catálogo" }).first()).toBeVisible();
  });
});
