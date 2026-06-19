-- Concede SELECT explicito para anon/authenticated nas tabelas publicas.
-- Criar tabela + RLS nao basta: sem GRANT, a Data API retorna 42501 (insufficient_privilege)
-- mesmo com policies corretas, pois GRANT controla acesso a tabela e RLS controla as linhas.

grant select on categories to anon, authenticated;
grant select on products to anon, authenticated;
grant select on product_images to anon, authenticated;
grant select on admin_profiles to authenticated;
