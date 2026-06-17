# Research: Home / Landing Institucional

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

## Decisões Técnicas

### 1. Ordem de exibição dos destaques é consumida, não definida por esta feature

**Decision**: `getFeaturedProducts()` retorna os produtos já na ordem que deve ser exibida na home. Esta feature não implementa nenhuma lógica de ordenação própria — apenas renderiza a lista na ordem recebida.

**Rationale**: A curadoria de quais produtos são destaque e em que ordem aparecem é responsabilidade da tela administrativa de destaques (spec 009-admin-destaques, que introduz reordenação por drag-and-drop). Implementar uma ordenação alternativa aqui duplicaria essa responsabilidade e poderia divergir da intenção do admin. Por Princípio V (Simplicidade), a home apenas reflete o que a query já entrega.

**Alternatives considered**: Ordenar por `created_at` ou `name` na própria query da home — descartado, pois ignoraria a curadoria manual que é o propósito central da spec 009.

**Nota de dependência**: Caso a spec 009 introduza uma coluna de ordem (ex: `featured_position`) na tabela `products`, `getFeaturedProducts()` deve ordenar por essa coluna — mudança interna à query, sem impacto no contrato consumido por esta feature (`ProductCard[]`).
