-- Adiciona a posicao de um produto na grade de destaques da home publica.
-- NULL quando o produto nao esta marcado como destaque (featured = false).
-- Indice unico parcial garante que nao haja dois produtos com a mesma posicao
-- entre os destacados, mas permite multiplos NULL (produtos nao destacados).

alter table products add column featured_position int;

create unique index products_featured_position_unique
  on products (featured_position)
  where featured_position is not null;
