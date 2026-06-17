# Data Model Delta: Gestão de Produtos em Destaque

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

Esta feature introduz uma única alteração de schema sobre a tabela `products`, já definida em [001-vitrine-catalogo/data-model.md](../001-vitrine-catalogo/data-model.md#products). Nenhuma tabela nova é criada (ver `research.md` §1).

## Alteração em `products`

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `featured_position` | `int` | NULL, UNIQUE WHERE `featured_position IS NOT NULL` | Posição na grade de destaques; `NULL` quando `featured = false` |

**Migração** (squema, não SQL definitivo de implementação):

```sql
ALTER TABLE products ADD COLUMN featured_position int;
CREATE UNIQUE INDEX products_featured_position_unique
  ON products (featured_position)
  WHERE featured_position IS NOT NULL;
```

**Regras**:
- `featured_position` só tem significado quando `featured = true`; deve ser mantido `NULL` em qualquer produto com `featured = false` (invariante garantida pela implementação de `toggleFeatured`, não por CHECK constraint cruzando duas colunas — Postgres não impede a UNIQUE index de aceitar múltiplos `NULL`, que é o comportamento desejado para produtos não destacados).
- Ao marcar um produto como destaque (`toggleFeatured(id, true)`), `featured_position` recebe `MAX(featured_position) + 1` entre os produtos atualmente destacados (ou `1` se nenhum produto estiver destacado).
- Ao desmarcar (`toggleFeatured(id, false)`), `featured_position` é definido como `NULL`. Os demais produtos destacados **não** são renumerados — `reorderFeatured` é a única operação que reescreve múltiplas posições de uma vez.
- `reorderFeatured(productIds)` reescreve `featured_position` de **todos** os produtos atualmente destacados em uma única transação, como `1..N` na ordem do array recebido. Produtos não incluídos no array (não deveria ocorrer, ver `contracts/server-actions.md`) não são tocados.
- A exclusão permanente de um produto (`deleteProduct`, já contratada em 001) remove a linha inteira de `products`, incluindo `featured` e `featured_position` — satisfaz FR-006 sem lógica adicional (ver `research.md` §3).

## Relationships

Sem alteração em relação a 001 — `featured_position` é um atributo escalar de `products`, sem nova FK ou relação.

## RLS

Sem alteração em relação a 001 — `featured_position` é lido pela mesma query pública (`getFeaturedProducts`, SELECT WHERE `active = true`) e escrito apenas via Server Actions com `service_role` (`toggleFeatured`, `reorderFeatured`), nunca exposto a INSERT/UPDATE direto via Data API.
