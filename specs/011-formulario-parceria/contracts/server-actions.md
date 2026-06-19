# Queries & Server Actions — Contratos desta Feature

**Date**: 2026-06-19
**Types**: [types.ts](./types.ts)

Extensão dos contratos de `specs/001-vitrine-catalogo/contracts/server-actions.md`. Segue a mesma separação: `queries.ts` (leitura simples, sem checagem de papel) vs `actions.ts` (`"use server"`, sempre valida sessão/papel antes de mutar ou ler dado sensível).

---

## Extensão de contrato existente — `features/products/queries.ts`

### `getProductBySlug(slug)` (spec 001/003 — extensão aditiva)

O tipo `Product` retornado passa a incluir `purchase_mode: PurchaseMode`. Nenhuma mudança de assinatura.

---

## Extensão de contrato existente — `features/admin/products` (spec 007)

`CreateProductInput`/`UpdateProductInput` passam a incluir `purchase_mode: PurchaseMode`. A validação em `schemas.ts` passa a exigir `ml_url` apenas quando `purchase_mode === 'mercado_livre'`.

---

## Server Actions — Formulário de Parceria (público) (`features/partner-applications/actions.ts`)

> Sem checagem de sessão — o visitante é anônimo. Validação de input via `schemas.ts` (inclui checksum de CNPJ/CPF).

### `submitPartnerApplication(input)`
```ts
submitPartnerApplication(
  input: SubmitPartnerApplicationInput
): Promise<ActionResult<void>>
```
Valida `input` via `partnerApplicationSchema` (`schemas.ts`), incluindo o checksum de CNPJ ou CPF conforme `document_type`. Busca o nome atual do produto (`product_id`) para preencher `product_name_snapshot`. Insere em `partner_applications` usando o client de sessão padrão (`infrastructure/supabase/server.ts`) — não usa `service_role`, já que o INSERT público é coberto por RLS + GRANT (ver `data-model.md`). NÃO dispara nenhum evento de analytics (FR-011).

---

## Server Actions — Admin Parcerias (`features/admin/partner-applications/actions.ts`)

> Todas exigem `role IN ('admin', 'editor')` via `getCurrentAdminProfile()`. Tecnicamente leituras, mas vivem em `actions.ts` (não `queries.ts`) porque expõem dados de candidatos e exigem checagem de papel — mesmo raciocínio de `getAdminUsers` (spec 001).

### `getPartnerApplications()`
```ts
getPartnerApplications(): Promise<ActionResult<PartnerApplicationSummary[]>>
```
Lista todas as submissões, mais recentes primeiro (`created_at DESC`).

### `getPartnerApplicationById(id)`
```ts
getPartnerApplicationById(id: string): Promise<ActionResult<PartnerApplication>>
```
Retorna a submissão completa para a tela de detalhe. `error` caso o `id` não exista.

Não há `updatePartnerApplication`/`deletePartnerApplication` — FR-015 proíbe edição/exclusão nesta versão; a ausência intencional destas funções é o contrato.
