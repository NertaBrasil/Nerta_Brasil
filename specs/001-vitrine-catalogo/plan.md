# Implementation Plan: Vitrine Digital e Catálogo — Nerta Brasil

**Branch**: `001-vitrine-catalogo` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-vitrine-catalogo/spec.md`

## Summary

Vitrine digital com catálogo de produtos para a Nerta Brasil (química automotiva premium). O site apresenta produtos, direciona o visitante para o Mercado Livre e expõe um painel administrativo restrito para gestão do catálogo. Este plano define a arquitetura completa — stack, estrutura de pastas, modelo de dados e contratos — que serve de referência para todas as specs granulares que virão.

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+

**Primary Dependencies**: Next.js 14+ (App Router), Tailwind CSS, `@supabase/ssr`, React 18+, oxlint (design system)

**Storage**: PostgreSQL — Docker Compose local / Supabase managed em produção. Supabase Storage para imagens de produto (PNGs 1:1).

**Testing**: TDD obrigatório (Princípio VI da constituição) — ciclo red-green-refactor antes de qualquer código de produção. Vitest para `queries.ts`, `actions.ts` e regras de negócio; React Testing Library para componentes com lógica condicional (ex: `ProductCard` com `stock === 0`). `quickstart.md` permanece como validação manual complementar de ponta a ponta, nunca substituto da suite automatizada.

**Target Platform**: Web (browser moderno) na Vercel. SSR/SSG via Next.js App Router.

**Project Type**: Web application — vitrine pública (SSR, SEO crítico) + painel admin (interativo, autenticado).

**Performance Goals**: LCP < 2.5s nas páginas públicas via Server Components. Páginas de produto indexáveis individualmente pelo Google.

**Constraints**:
- SEO crítico → Server Components como padrão absoluto na vitrine pública
- `.env` e `.env.local` nunca commitados — apenas `.env.example` vai ao repo
- `service_role` key exclusiva de Server Actions no contexto admin
- RLS habilitado em todas as tabelas expostas via Data API
- Imagens obrigatoriamente recortadas em 1:1 antes de persistir no Storage

**Scale/Scope**: ~100 produtos iniciais, 2 papéis admin (admin/editor), tráfego orgânico inicial em centenas de visitantes simultâneos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Sem carrinho, checkout ou login de cliente. Botão ML com `target="_blank"` + GA/Pixel. | ✅ PASS |
| II. Server Component | Páginas públicas são RSC. `"use client"` apenas em: filtros, botão Comprar, formulários admin, cropper, drag-and-drop. | ✅ PASS |
| III. Design System | Tokens via Tailwind config. Oxlint enforced. Imagens 1:1. Danger button vermelho em exclusões. Scrim escuro em modais. | ✅ PASS |
| IV. Segurança | RLS em todas as tabelas. `service_role` apenas em Server Actions admin. `.env` não commitado. Guard backend: admin não deleta a própria conta. | ✅ PASS |
| V. Simplicidade | MVP fechado: landing → catálogo → produto → ML. Nenhuma abstração além do necessário. | ✅ PASS |
| VI. TDD Obrigatório | Vitest cobre `queries.ts`/`actions.ts`/regras de negócio; RTL cobre componentes com lógica condicional. Testes escritos e falhando antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/001-vitrine-catalogo/
├── plan.md              # Este arquivo
├── research.md          # Decisões técnicas e rationale
├── data-model.md        # Schema completo do banco de dados
├── quickstart.md        # Guia de validação do ambiente de dev
├── contracts/
│   ├── types.ts         # Tipos TypeScript compartilhados entre features
│   └── server-actions.md # Assinaturas das Server Actions por domínio
└── tasks.md             # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (site)/
│   │   ├── page.tsx                    # Home — RSC
│   │   ├── produtos/
│   │   │   ├── page.tsx               # Catálogo — RSC (filtros como Client)
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Detalhe do produto — RSC
│   │   └── sobre/
│   │       └── page.tsx               # Institucional — RSC
│   ├── (admin)/
│   │   ├── layout.tsx                 # AdminShell + guard de auth
│   │   ├── login/
│   │   │   └── page.tsx              # Login — Client
│   │   ├── produtos/
│   │   │   ├── page.tsx              # Lista produtos — RSC
│   │   │   ├── novo/page.tsx         # Formulário — Client
│   │   │   └── [id]/page.tsx         # Editar produto — Client
│   │   ├── categorias/
│   │   │   └── page.tsx              # Gestão — RSC + modal Client
│   │   ├── destaques/
│   │   │   └── page.tsx              # Grid drag-and-drop — Client
│   │   └── usuarios/
│   │       └── page.tsx              # Gestão usuários — RSC (admin only)
│   ├── layout.tsx
│   └── globals.css                    # Tokens do design system → Tailwind
├── middleware.ts                       # Verifica apenas SE há sessão válida em /admin/*
├── features/
│   ├── produtos/                     # Feature "dona" das entidades de catálogo
│   │   ├── components/               # ProductCard, ProductGrid, ProductFilters
│   │   ├── queries.ts                # getProducts, getProductBySlug, getFeaturedProducts, getCategories
│   │   ├── types.ts                  # Product, Category, ProductImage (tipos de entidade — fonte única)
│   │   └── index.ts                  # Barrel: exporta só o que é público da feature
│   ├── admin/
│   │   ├── auth/                     # Resolução de sessão + papel do usuário logado
│   │   │   ├── session.ts            # getCurrentAdminProfile() — cached() por request
│   │   │   └── index.ts
│   │   ├── produtos/
│   │   │   ├── components/           # ProductForm, ImageCropper, ImageGallery
│   │   │   ├── actions.ts            # createProduct, updateProduct, deleteProduct,
│   │   │   │                         # uploadProductImage, deleteProductImage, reorderProductImages
│   │   │   ├── schemas.ts            # Zod schemas — únicos, usados no client (form) e na action
│   │   │   ├── types.ts              # CreateProductInput, UpdateProductInput, ReorderImagesInput
│   │   │   └── index.ts
│   │   ├── categorias/
│   │   │   ├── components/           # CategoryForm, CategoryList
│   │   │   ├── actions.ts            # createCategory, updateCategory, deleteCategory
│   │   │   ├── schemas.ts
│   │   │   └── index.ts
│   │   ├── destaques/
│   │   │   ├── components/           # DestaquesGrid
│   │   │   ├── actions.ts            # toggleFeatured
│   │   │   └── index.ts
│   │   └── usuarios/
│   │       ├── components/           # UserForm, UserList
│   │       ├── actions.ts            # createUser, deleteUser, getAdminUsers
│   │       ├── schemas.ts
│   │       ├── types.ts              # AdminProfile, AdminRole, CreateUserInput
│   │       └── index.ts
│   └── shell/
│       ├── actions.ts                # logout()
│       └── components/               # AdminShell, Sidebar, TopBar
├── shared/                            # Reutilizado por 2+ features — nasce pequeno, cresce sob demanda
│   ├── components/
│   │   └── ui/                       # Button, Badge, Card, Modal, Input, Select, Switch
│   │                                 # — puramente apresentacional, zero regra de negócio
│   ├── hooks/                        # useDebounce, useMediaQuery — só o que é genérico
│   ├── utils.ts                      # slugify(), cn() — sem conhecimento de domínio
│   └── types.ts                      # ActionResult<T> — único tipo verdadeiramente transversal
└── infrastructure/                    # Integrações externas — nunca conhece Product/Category
    ├── supabase/
    │   ├── client.ts                 # createBrowserClient (@supabase/ssr)
    │   ├── server.ts                 # createServerClient (@supabase/ssr)
    │   └── admin.ts                  # createClient com service_role — só dentro de Server Actions admin
    └── analytics.ts                  # trackBuyClick() → GA4 + Meta Pixel
```

**Structure Decision**: Feature-based com separação clara vitrine/admin. As páginas em `/app` apenas compõem — toda lógica em `/features`. `shared/` concentra o que é reaproveitado por 2+ features (UI primitives, hooks genéricos, utils, `ActionResult<T>`); `infrastructure/` concentra integrações externas (Supabase, analytics) e nunca importa de `features/`. Clientes Supabase centralizados em `infrastructure/supabase/` — jamais instanciados inline. Analytics encapsulado em `infrastructure/analytics.ts` para não vazar dependências de browser em RSC.

## Code Architecture Conventions

Regras de fronteira entre módulos — aplicam-se a toda spec granular futura, não apenas a esta.

### 1. `queries.ts` vs `actions.ts` — leitura nunca se mistura com mutação

- **`queries.ts`**: funções `async` simples, **sem** `"use server"`, chamadas diretamente por Server Components. Só leem dados (ex: `getProducts`, `getProductBySlug`). Nunca validam input de formulário nem checam papel de admin — são de uso geral.
- **`actions.ts`**: funções marcadas `"use server"`, invocadas por Client Components (forms, botões). Sempre fazem, nesta ordem: (1) validar sessão/papel, (2) validar input via `schemas.ts`, (3) mutar, (4) retornar `ActionResult<T>`. Nunca lançam exceção para o cliente.

Misturar os dois sob `actions/` (como na primeira versão deste plano) esconde qual função precisa de autenticação e qual não precisa — por isso a separação.

### 2. Tipos de entidade têm um dono único

Cada entidade (`Product`, `Category`, `ProductImage`, `AdminProfile`) é definida em **um único lugar** e importada de lá por qualquer outra feature — nunca redeclarada.

- `Product`, `Category`, `ProductImage` → `features/produtos/types.ts` (a feature pública é a "dona", já que ambos os lados — vitrine e admin — leem a mesma entidade).
- `AdminProfile`, `AdminRole` → `features/admin/usuarios/types.ts`.
- Inputs de formulário (`CreateProductInput`, `UpdateProductInput` etc.) são admin-only e vivem junto da action que os consome (`features/admin/produtos/types.ts`).
- Imports cruzados usam `import type`, nunca o barrel completo da feature alheia — evita arrastar componentes/queries para dentro de uma Server Action por engano.

### 3. Cada feature expõe uma única porta de entrada (`index.ts`)

Tudo que não é exportado pelo `index.ts` da feature é privado a ela. Páginas em `/app` e outras features só importam do barrel — nunca de um caminho profundo como `features/admin/produtos/components/internal/X`. Isso é o que torna possível, mais adiante, mover ou reescrever uma feature inteira sem quebrar quem a consome.

### 4. Verificação de sessão e de papel são duas camadas distintas

- **`middleware.ts`** (Edge): só confirma que existe uma sessão Supabase válida em qualquer rota `/admin/*`. Não consulta papel — checagem de papel em Edge exigiria round-trip de banco em toda request.
- **`features/admin/auth/session.ts`**: expõe `getCurrentAdminProfile()`, envolvido em `cache()` do React para deduplicar a consulta dentro do mesmo request. É chamado pelo `(admin)/layout.tsx` (para montar o Sidebar com o papel correto) e, de novo, pela página `usuarios/` para redirecionar se o papel não for `admin` — o `cache()` garante que isso não dobra a consulta ao banco.

### 5. `infrastructure/` é integração externa; `features/` é domínio

`infrastructure/` nunca importa nada de `features/` nem conhece `Product`, `Category` ou regras de negócio — apenas wrappers genéricos (clientes Supabase, disparo de evento de analytics com parâmetros genéricos). Se uma função em `infrastructure/` começa a precisar saber o que é um "produto em destaque", ela pertence a `features/`. `infrastructure/supabase/admin.ts` (client com `service_role`) só pode ser importado por arquivos `actions.ts` dentro de `features/admin/`.

### 6. `shared/` nasce pequeno; algo só entra lá quando 2+ features já o usam

Regra de promoção: todo componente, hook ou util nasce dentro da feature que o criou. Só migra para `shared/` quando uma segunda feature precisar do mesmo código — nunca antecipadamente ("primeiro usar, depois compartilhar"). `shared/components/ui/` mapeia 1:1 o design system (Button, Card, Modal...) e não sabe o que é `stock` ou `featured`. `ProductCard` (em `features/produtos/components/`) decide, por exemplo, que `stock === 0` desabilita o botão — e usa `Button`/`Badge` de `shared/components/ui/` para isso. `ActionResult<T>` mora em `shared/types.ts` por ser o único tipo genérico o bastante para ser usado por toda Server Action, independente do domínio.

### 7. Validação (`schemas.ts`) é a fonte única entre client e server

O Zod schema usado para validar o formulário no Client Component é o **mesmo** importado pela Server Action — nunca duas validações divergentes para a mesma entrada.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida.
