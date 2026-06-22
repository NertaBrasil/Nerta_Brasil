-- Define o comportamento do botao de compra na pagina do produto:
-- 'mercado_livre' (padrao, abre o link em nova aba) ou
-- 'formulario_parceria' (navega para o Formulario de Parceria, independente do estoque).
-- DEFAULT preserva o comportamento atual para produtos ja cadastrados (FR-002).
-- Equivalente CLI-tracked: supabase/migrations/20260622190140_products_purchase_mode.sql

alter table products
  add column purchase_mode text not null default 'mercado_livre'
  check (purchase_mode in ('mercado_livre', 'formulario_parceria'));
