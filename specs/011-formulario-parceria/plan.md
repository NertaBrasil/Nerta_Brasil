# Implementation Plan: Formulário de Parceria + Modo de Compra por Produto

**Branch**: `011-formulario-parceria` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-formulario-parceria/spec.md`

## Summary

Cada produto passa a ter um modo de compra configurável pelo admin: "Link Mercado Livre" (comportamento atual, padrão) ou "Formulário de Parceria" (novo). Quando o modo é formulário, o botão de compra na página do produto leva a uma rota dedicada (`/produtos/[slug]/parceria`) com um formulário público multi-etapas de qualificação de parceiros — incluindo a escolha entre Pessoa Jurídica (CNPJ) e Pessoa Física (CPF) na etapa de identificação. Submissões ficam vinculadas ao produto de origem e são consultáveis (somente leitura) em uma nova seção administrativa (`/admin/parcerias`), restrita a admin/editor. Reaproveita integralmente a stack, arquitetura e contratos definidos em `specs/001-vitrine-catalogo/plan.md`, estendendo a entidade `Product` (campo `purchase_mode`) e introduzindo uma entidade nova (`partner_applications`). Depende, para implementação completa, de specs ainda não implementadas: 003-pagina-produto (`BuyButton`), 005-admin-autenticacao (sessão/papel) e 007-admin-produtos-crud (formulário de produto no admin).

## Technical Context

**Language/Version**: TypeScript 5.x + Node.js 20+ (igual a 001)

**Primary Dependencies**: Next.js 14+ (App Router), Tailwind CSS, `@supabase/ssr`, React 18+, Zod (schema único client/server, incluindo validação de CNPJ/CPF via `.refine()` — sem biblioteca nova, ver `research.md` §3)

**Storage**: PostgreSQL (Supabase) — extensão de `products` (`purchase_mode`) + nova tabela `partner_applications`. Sem Storage novo (sem upload de arquivo nesta feature).

**Testing**: TDD obrigatório (Princípio VI) — Vitest cobre validação de CNPJ/CPF (`schemas.ts`), `submitPartnerApplication` (sucesso, documento inválido, etapa obrigatória ausente) e `getPartnerApplications`/`getPartnerApplicationById` (bloqueio para quem não é admin/editor); React Testing Library cobre `BuyButton` decidindo entre link ML e navegação para o formulário conforme `purchase_mode`, e o formulário multi-etapas (troca de campos PJ/PF, bloqueio de avanço com documento inválido).

**Target Platform**: Web. Rota pública nova `/produtos/[slug]/parceria` (sem autenticação); rota admin nova `/admin/parcerias` (autenticada, role admin/editor).

**Project Type**: Web application — módulo da vitrine pública + módulo do painel admin, dentro da estrutura já definida em 001.

**Performance Goals**: Mesmos da vitrine pública (LCP < 2.5s) — a rota do formulário é isolada da página de produto, então não penaliza o LCP de produtos em modo "Link Mercado Livre" (ver `research.md` §1).

**Constraints**:
- `BuyButton` (spec 003) passa a ramificar por `purchase_mode`: link ML (`target="_blank"` + analytics) ou navegação interna para `/produtos/[slug]/parceria` (mesma aba, sem analytics de e-commerce — FR-011).
- Formulário de Parceria não persiste rascunho entre sessões (Assumptions do spec).
- `partner_applications` não tem UPDATE/DELETE expostos em nenhuma camada (Server Action ausente de propósito + RLS sem política para essas ações) — FR-015.
- Submissão pública (`submitPartnerApplication`) usa o client de sessão padrão, nunca `service_role` (Princípio IV).

**Scale/Scope**: Volume de submissões é de geração de lead B2B (dezenas/centenas, não volume de e-commerce). Formulário com 7 etapas, ~30 campos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Vitrine-First | Constituição emendada (v1.2.0) para sancionar o Formulário de Parceria como segundo caminho de conversão por produto. Sem carrinho, sem checkout, sem login do usuário final em nenhum dos dois caminhos. | ✅ PASS |
| II. Server Component | Rota `/produtos/[slug]/parceria` é RSC no shell; apenas o formulário multi-etapas (estado entre etapas) é Client. `/admin/parcerias` (lista) é RSC; detalhe é RSC também (sem interatividade que exija Client). | ✅ PASS |
| III. Design System | Formulário e listagem admin reaproveitam tokens/componentes existentes (`shared/components/ui/`) — nenhum estilo hardcoded novo. | ✅ PASS |
| IV. Segurança | INSERT público em `partner_applications` via RLS+GRANT (sem `service_role`). SELECT restrito a admin/editor. Nenhuma política de UPDATE/DELETE. | ✅ PASS |
| V. Simplicidade | Sem biblioteca nova para validação de documento ou formulário multi-etapas (ver `research.md` §3 e §6). Sem bloqueio de exclusão de produto (snapshot resolve o requisito de forma mais simples — `research.md` §5). | ✅ PASS |
| VI. TDD Obrigatório | Testes de validação de CNPJ/CPF, `submitPartnerApplication`, `getPartnerApplications`/`getPartnerApplicationById` e `BuyButton` escritos antes da implementação. | ✅ PASS |

**Constitution Check pós-Phase 1: APPROVED — nenhuma violação encontrada no design.**

## Project Structure

### Documentation (this feature)

```text
specs/011-formulario-parceria/
├── plan.md              # Este arquivo
├── research.md          # Decisões técnicas e rationale
├── data-model.md        # Extensão de `products` + nova tabela `partner_applications`
├── quickstart.md        # Guia de validação manual
├── contracts/
│   ├── types.ts         # Tipos novos/estendidos
│   └── server-actions.md # Assinaturas das queries/actions desta feature
└── tasks.md             # Gerado pelo /speckit-tasks (não por este comando)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── produtos/[slug]/
│   │   ├── page.tsx                         # RSC (spec 003) — BuyButton passa a ramificar por purchase_mode
│   │   └── parceria/
│   │       └── page.tsx                     # RSC — shell da rota; delega ao formulário client
│   └── admin/
│       ├── produtos/                         # (spec 007) — formulário ganha campo "Modo de compra"
│       └── parcerias/
│           ├── page.tsx                      # RSC — lista de submissões
│           └── [id]/page.tsx                 # RSC — detalhe de uma submissão
├── features/
│   ├── products/
│   │   ├── types.ts                          # Product ganha `purchase_mode: PurchaseMode`
│   │   ├── components/
│   │   │   └── BuyButton.tsx                 # (spec 003) — ramifica por purchase_mode
│   │   └── queries.ts                        # getProductBySlug retorna purchase_mode (sem mudança de assinatura)
│   ├── partner-applications/                 # Feature nova — pública
│   │   ├── components/
│   │   │   └── PartnerApplicationForm.tsx    # Client — único "use client" da rota /parceria
│   │   ├── actions.ts                        # submitPartnerApplication
│   │   ├── schemas.ts                        # Zod schema único (client + server) + validação CNPJ/CPF
│   │   ├── types.ts                          # PartnerApplication, PartnerApplicationSummary — dono
│   │   └── index.ts
│   └── admin/
│       ├── products/                         # (spec 007) — schemas.ts passa a exigir ml_url condicionalmente
│       └── partner-applications/             # Feature nova — admin
│           ├── components/
│           │   ├── PartnerApplicationList.tsx
│           │   └── PartnerApplicationDetail.tsx
│           ├── actions.ts                    # getPartnerApplications, getPartnerApplicationById
│           └── index.ts
└── (sem novas pastas em shared/ ou infrastructure/ — nada aqui é reaproveitado por 2ª feature ainda,
     nem é wrapper de serviço externo sem regra de negócio)
```

**Structure Decision**: `features/partner-applications/` nasce como feature própria (pública) porque é quem primeiro possui a entidade `PartnerApplication` — segue a mesma regra de dono único já usada para `Product`/`features/products`. `features/admin/partner-applications/` é a contraparte administrativa, paralela a `features/admin/users/` (leitura que exige papel vive em `actions.ts`, não `queries.ts`). Nenhuma promoção a `shared/` — nada aqui é genérico o suficiente ainda. `infrastructure/` não muda: não há integração externa nova.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção omitida (a exceção ao Princípio I foi resolvida via emenda formal à constituição, não via justificativa pontual nesta tabela).
