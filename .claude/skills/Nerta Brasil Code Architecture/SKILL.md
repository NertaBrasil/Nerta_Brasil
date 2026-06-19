---
name: nerta-brasil-code-architecture
description: Use this skill when writing or reviewing Next.js/TypeScript code in the Nerta Brasil repo — to decide where a file belongs (app/, features/, shared/ or infrastructure/), how to split queries.ts vs actions.ts, where a type/hook/component should live, and how auth/session checks are layered. Read before creating any new file under src/.
user-invocable: true
---

# Arquitetura de Código — Nerta Brasil

Guia prático de "onde colocar isso e como escrever". A decisão arquitetural em si (por que esse desenho) está registrada em `specs/001-vitrine-catalogo/plan.md` → seção "Code Architecture Conventions"; este skill é a versão operacional, por camada, para consulta rápida durante a implementação.

## As quatro camadas

```text
src/
├── app/             # Roteamento Next.js. Só orquestra — quase zero lógica.
├── features/        # Domínio de negócio. Onde tudo nasce.
├── shared/           # Reuso entre 2+ features. Nasce vazio, cresce por promoção.
└── infrastructure/   # Integrações externas (Supabase, analytics). Não conhece domínio.
```

Regra de ouro: **tudo nasce dentro de uma feature.** Só sai de lá quando uma segunda feature precisar do mesmo código (`shared/`) ou quando for, de fato, um wrapper de serviço externo sem regra de negócio (`infrastructure/`).

---

## Camada `app/`

**O que vai aqui**: arquivos de rota do Next.js App Router (`page.tsx`, `layout.tsx`, `route.ts`) e nada mais.

**Como escrever**: a página importa do `index.ts` (barrel) da feature e compõe. Não escreva query, validação ou regra de negócio direto num `page.tsx`.

```tsx
// app/(public)/produtos/page.tsx  ← segmento de URL em PT-BR (SEO), arquivo/código em inglês
import { getProducts, ProductGrid, ProductFilters } from "@/features/products";

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <ProductFilters />
      <ProductGrid products={products} />
    </>
  );
}
```

> **Convenção de idioma (P0)**: pastas, arquivos, funções, variáveis, tipos e componentes em `src/` são sempre em inglês (`features/products`, `getProducts()`, `ProductsPage`). A única exceção são os *segmentos de URL* (`/produtos`, `/produtos/[slug]`), que continuam em português por SEO — a pasta de rota carrega o nome da URL, mas tudo o que ela importa/exporta é inglês. Route groups (`app/(grupo)/`) seguem nomes descritivos em inglês, nunca genéricos como `(site)` — use algo como `(public)`/`(admin)`.

Se uma página está crescendo (mais de ~30 linhas de lógica), o código que está crescendo pertence à feature, não à página.

`middleware.ts` mora na raiz de `src/`, não dentro de `app/` — ver seção de auth abaixo.

---

## Camada `features/`

Cada feature é uma pasta com até este conjunto de arquivos (só crie o que a feature realmente precisar):

```text
features/<nome>/
├── components/     # UI da feature, compõe regra de negócio usando shared/components/ui
├── queries.ts       # Leituras simples, sem "use server"
├── actions.ts        # Mutações, "use server"
├── schemas.ts        # Zod — única fonte de validação, client e server
├── types.ts           # Tipos cuja a feature é a dona
└── index.ts            # Barrel — única porta de entrada pública
```

### `queries.ts` vs `actions.ts` — nunca no mesmo arquivo

| | `queries.ts` | `actions.ts` |
|---|---|---|
| Marcação | nenhuma (`async function` puro) | `"use server"` no topo |
| Quem chama | Server Components, direto | Client Components (forms, botões) |
| Checa sessão/papel? | Não — é leitura geral | Sim, sempre primeiro |
| Pode lançar exceção? | Pode (erro de infra) | Nunca — retorna `ActionResult<T>` |

Toda função em `actions.ts` segue esta ordem, sem pular passo:

```ts
"use server";

export async function updateProduct(input: UpdateProductInput): Promise<ActionResult<Product>> {
  const profile = await getCurrentAdminProfile();
  if (!profile) return { success: false, error: "Não autenticado." };

  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.message };

  // mutação...

  return { success: true, data: product };
}
```

Uma função que é tecnicamente uma leitura, mas exige checagem de papel (ex: `getAdminUsers`), vive em `actions.ts` — a separação é sobre **quem pode chamar**, não sobre verbo HTTP.

### Dono único por tipo de entidade

Cada entidade de domínio (`Product`, `Category`, `AdminProfile`...) é declarada em **um** `types.ts` e importada de lá — nunca redeclarada em outra feature. Convenção: a feature que primeiro "possui" a entidade é a dona; as demais importam com `import type`.

```ts
// features/admin/products/actions.ts
import type { Product } from "@/features/products";
```

Nunca importe um caminho profundo de outra feature (`@/features/products/components/ProductCard/internal/...`) — só o que o `index.ts` exporta.

### Inputs de formulário ficam com quem os consome

`CreateProductInput`, `UpdateProductInput` etc. não são entidades — são contrato de uma action específica. Moram no `types.ts` da feature admin que tem a action, não na feature pública.

---

## Camada `shared/`

```text
shared/
├── components/ui/   # Button, Card, Modal... — apresentação pura, zero regra de negócio
├── hooks/             # useDebounce, useMediaQuery — só o genérico de verdade
├── utils.ts            # slugify(), cn() — sem saber o que é um "produto"
└── types.ts             # ActionResult<T> — o único tipo realmente transversal
```

**Critério de promoção**: nasceu numa feature → uma segunda feature precisa do mesmo código → só então move para `shared/`. Nunca crie algo direto em `shared/` "porque pode ser reutilizado depois" — isso é compartilhamento prematuro.

**Teste rápido antes de colocar algo aqui**: se a função/componente soubesse o nome de uma entidade de negócio (`Product`, `stock`, `featured`), ela não pertence a `shared/` — pertence a uma feature.

---

## Camada `infrastructure/`

```text
infrastructure/
├── supabase/
│   ├── client.ts    # createBrowserClient — só em Client Components
│   ├── server.ts    # createServerClient — Server Components, actions, route handlers
│   └── admin.ts      # createClient com service_role — só dentro de actions.ts em features/admin/**
└── analytics.ts        # trackBuyClick() → GA4 + Meta Pixel, disparado client-side
```

Regras:
- `infrastructure/` nunca importa de `features/`. Se uma função aqui precisa saber o que é "produto em destaque", ela não é infraestrutura — mova para a feature.
- `infrastructure/supabase/admin.ts` é o único lugar com acesso à `service_role` key. Importe-o exclusivamente de `actions.ts` dentro de `features/admin/`. Nunca em código que roda no browser.
- Não instancie um client Supabase inline em nenhum outro arquivo — sempre via um dos três wrappers acima.

---

## Auth: duas camadas, não confundir

1. **`middleware.ts`** (Edge, raiz de `src/`): só confirma que existe sessão válida em `/admin/*`. Não consulta papel — round-trip de banco no Edge é caro.
2. **`features/admin/auth/session.ts`** → `getCurrentAdminProfile()`: consulta o papel (`admin`/`editor`), envolvida em `cache()` do React para deduplicar dentro do mesmo request. Chamada por `(admin)/layout.tsx` (monta o Sidebar) e por qualquer página/action que precise saber o papel exato (ex: bloquear `/admin/usuarios` para `editor`).

Nunca decida acesso por papel dentro do `middleware.ts` — isso é responsabilidade de `getCurrentAdminProfile()`.

---

## Checklist rápido ao criar um arquivo novo

1. É rota Next.js? → `app/`, só orquestração.
2. É regra de negócio, leitura ou mutação de uma entidade? → dentro da feature certa, em `queries.ts` ou `actions.ts`.
3. Já existe em 2+ features e é puramente genérico? → `shared/`.
4. É wrapper de serviço externo (Supabase, analytics) sem saber de domínio? → `infrastructure/`.
5. Em dúvida entre `shared/` e a feature → comece na feature. Promover depois é barato; despromover é retrabalho.
