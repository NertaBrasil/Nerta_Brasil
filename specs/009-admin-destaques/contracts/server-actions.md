# Server Actions — Admin Destaques

**Date**: 2026-06-16
**Feature**: [spec.md](../spec.md)

Revisa `toggleFeatured` (já contratada em [001-vitrine-catalogo/contracts/server-actions.md](../../001-vitrine-catalogo/contracts/server-actions.md#server-actions--admin-destaques-featuresadmindestaquesactionsts)) e introduz `reorderFeatured`, único contrato novo desta feature. Ambas exigem `role IN ('admin', 'editor')` via `getCurrentAdminProfile()`.

---

## `toggleFeatured(product_id, featured)` — assinatura inalterada, comportamento revisado

```ts
toggleFeatured(
  product_id: string,
  featured: boolean
): Promise<ActionResult>
```

**Fluxo revisado**:
1. Se `featured === true`: dentro de uma transação, calcula `next_position = COALESCE(MAX(featured_position), 0) + 1` entre os produtos com `featured = true`, e faz `UPDATE products SET featured = true, featured_position = next_position WHERE id = product_id`.
2. Se `featured === false`: `UPDATE products SET featured = false, featured_position = NULL WHERE id = product_id`. Os demais produtos destacados não são renumerados (ver `data-model.md`).
3. Idempotente: marcar um produto já destacado como destaque novamente não altera sua `featured_position` (a verificação de "já destacado" evita recalcular a posição).

**Não afetado**: validação de existência do produto e checagem de papel — inalteradas em relação a 001.

---

## `reorderFeatured(productIds)`

```ts
reorderFeatured(input: ReorderFeaturedInput): Promise<ActionResult>
```

```ts
type ReorderFeaturedInput = {
  productIds: string[]; // IDs de TODOS os produtos atualmente destacados, na nova ordem desejada
};
```

**Fluxo**:
1. Valida que `productIds` corresponde exatamente ao conjunto de produtos atualmente com `featured = true` (mesmo tamanho, mesmos IDs, sem duplicados) — caso contrário retorna `{ success: false, error: "Lista de destaques inconsistente com o estado atual." }` sem aplicar nenhuma alteração. Essa validação evita que uma reordenação enviada com base em um snapshot desatualizado (ex: outro admin excluiu um produto destacado nesse intervalo) sobrescreva o estado parcialmente.
2. Atualiza `featured_position` de cada produto em `productIds` para seu índice + 1 (1-based), em uma única transação — mesmo padrão de `reorderProductImages` (001).
3. Retorna `{ success: true, data: undefined }` em caso de sucesso.

**Análogo a**: `reorderProductImages` (001) — mesma estrutura de "lista completa reordenada, persistida atomicamente", aplicada a produtos em vez de imagens.

---

## `getFeaturedProducts()` — comportamento de ordenação revisado

```ts
getFeaturedProducts(): Promise<ProductCard[]>
```

Já contratada em 001; a única mudança é a cláusula de ordenação da query: passa a incluir `ORDER BY featured_position ASC` (além do filtro já existente `featured = true AND active = true`). O contrato de retorno (`ProductCard[]`) não muda — ver nota de dependência em [004-home-landing/research.md](../../004-home-landing/research.md).
