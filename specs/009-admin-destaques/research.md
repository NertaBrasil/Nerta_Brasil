# Research: Gestão de Produtos em Destaque no Painel Administrativo

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

## Decisões Técnicas

### 1. Ordem persistida via coluna `featured_position` em `products`, não tabela própria

**Decision**: Adicionar uma coluna `featured_position` (`int`, nullable) à tabela `products`, em vez de criar uma tabela de junção dedicada (ex: `featured_products`). `NULL` quando `featured = false`; um inteiro positivo, único entre os produtos atualmente em destaque, quando `featured = true`.

**Rationale**: 001-vitrine-catalogo definiu `products.featured` como booleano simples, sem qualquer noção de ordem — gap identificado já em [004-home-landing/research.md](../004-home-landing/research.md#1-ordem-de-exibição-dos-destaques-é-consumida-não-definida-por-esta-feature). A relação "produto está em destaque, em que posição" é estritamente 1:1 por produto (um produto não pode estar em destaque duas vezes, nem ocupar duas posições), então uma tabela de junção separada introduziria um JOIN e uma entidade extra sem benefício real — descartada por Princípio V (Simplicidade). Uma coluna nullable na própria tabela resolve o requisito com a menor mudança de schema possível.

**Alternatives considered**:
- Tabela `featured_products (product_id, position)`: modelaria a relação de forma mais "pura", mas adiciona uma tabela, uma FK e um JOIN em toda leitura da home pública para um caso que nunca é N:M — descartada.
- Derivar ordem de `updated_at` ou ordem de marcação: não atende ao requisito explícito de reordenação manual por drag-and-drop (FR-004) — descartada.

---

### 2. `toggleFeatured` mantém assinatura; `reorderFeatured` é o único contrato novo

**Decision**: `toggleFeatured(product_id, featured)` (já contratado em 001) passa a, internamente, também gerenciar `featured_position`: ao marcar como destaque (`featured: true`), atribui `featured_position = COALESCE(MAX(featured_position) entre os já destacados, 0) + 1` (acrescenta ao final); ao desmarcar (`featured: false`), define `featured_position = NULL`. Nenhuma mudança na assinatura pública da action. Um novo contrato, `reorderFeatured(productIds)`, é adicionado para persistir a ordem definida via drag-and-drop, atualizando `featured_position` de todos os produtos destacados em uma única transação — mesmo padrão já usado por `reorderProductImages` (001).

**Rationale**: Manter a assinatura de `toggleFeatured` evita uma mudança de contrato em uma action que páginas/telas futuras possam já estar consumindo, e a lógica de "acrescentar ao final" é a única coisa que faz sentido ao marcar um produto via toggle simples (sem drag-and-drop envolvido nesse ponto). A reordenação em si é uma operação distinta o suficiente (afeta múltiplos produtos simultaneamente) para justificar uma action própria, no mesmo padrão arquitetural já validado por `reorderProductImages`.

**Alternatives considered**: Calcular `featured_position` via posição fracionária no client (ex: técnica de "lexorank") — descartada por complexidade desnecessária dado o volume baixo de produtos em destaque (Princípio V).

---

### 3. Remoção da grade ao excluir produto não exige lógica adicional

**Decision**: Nenhuma action ou trigger adicional é necessária para FR-006 ("remover produto excluído da grade de destaques"). Como `featured` e `featured_position` são colunas da própria linha de `products`, a exclusão do produto (`deleteProduct`, já contratada em 001) remove a linha inteira — não há registro residual em nenhuma tabela a limpar.

**Rationale**: Consequência direta da Decisão 1 (coluna em vez de tabela separada). Se a ordem fosse modelada em uma tabela própria, seria necessário um `ON DELETE CASCADE` explícito; com a coluna embutida, o requisito é satisfeito automaticamente.

---

### 4. `getFeaturedProducts()` ordena por `featured_position ASC`

**Decision**: A query `getFeaturedProducts()` (já contratada em 001, consumida por 004-home-landing) passa a incluir `ORDER BY featured_position ASC` na cláusula que filtra `featured = true AND active = true`.

**Rationale**: Resolve a "nota de dependência" deixada em [004-home-landing/research.md](../004-home-landing/research.md): o contrato consumido pela home (`ProductCard[]`) não muda, apenas a ordenação interna da query passa a refletir a curadoria definida nesta tela, em vez de uma ordem implícita (ex: `created_at`).
