# Registro de Execuções de Migrations

Controle manual de execução por ambiente. Ver [PROCEDURE.md](./PROCEDURE.md) para o processo completo.

| NNNN | Tipo | Descrição | Ambiente | Referência | Data | Responsável | Status |
|------|------|-----------|----------|------------|------------|--------------|--------|
| 0001 | UP | initial_schema | local | supabase/migrations/20260617221247_initial_schema.sql | 2026-06-17 | Matheus Dias Campos | executado ✅ |
| 0002 | UP | grant_data_api_access | local | supabase/migrations/20260617232437_grant_data_api_access.sql | 2026-06-17 | Matheus Dias Campos | executado ✅ |
| 0001 | UP | initial_schema | produção (Supabase) | projeto `wcouxyjezwmabeapvbsq` | 2026-06-19 | Matheus Dias Campos | executado ✅ |
| 0002 | UP | grant_data_api_access | produção (Supabase) | projeto `wcouxyjezwmabeapvbsq` | 2026-06-19 | Matheus Dias Campos | executado ✅ |
| 0003 | UP | grant_service_role_categories | local | supabase/migrations/20260622202828_grant_service_role_categories.sql | 2026-06-22 | Matheus Dias Campos | executado ✅ |
| 0003 | DOWN | grant_service_role_categories | local | rollback validado via psql (UP→DOWN→UP) | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0004 | UP | grant_service_role_products | local | supabase/migrations/20260622203218_grant_service_role_products.sql | 2026-06-22 | Matheus Dias Campos | executado ✅ |
| 0004 | DOWN | grant_service_role_products | local | rollback validado via psql (UP→DOWN→UP) | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0005 | UP | grant_service_role_product_images | local | supabase/migrations/20260622203538_grant_service_role_product_images.sql | 2026-06-22 | Matheus Dias Campos | executado ✅ |
| 0005 | DOWN | grant_service_role_product_images | local | rollback validado via psql (UP→DOWN→UP) | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0006 | UP | products_featured_position | local | supabase/migrations/20260622183450_products_featured_position.sql | 2026-06-22 | Matheus Dias Campos | validado ✅ |
| 0006 | DOWN | products_featured_position | local | — | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0007 | UP | products_purchase_mode | local | supabase/migrations/20260622190140_products_purchase_mode.sql | 2026-06-22 | Matheus Dias Campos | validado ✅ |
| 0007 | DOWN | products_purchase_mode | local | — | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0008 | UP | partner_applications | local | supabase/migrations/20260622190143_partner_applications.sql | 2026-06-22 | Matheus Dias Campos | validado ✅ |
| 0008 | DOWN | partner_applications | local | — | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0009 | UP | grant_service_role_admin_profiles | local | supabase/migrations/20260622204526_grant_service_role_admin_profiles.sql | 2026-06-22 | Matheus Dias Campos | executado ✅ |
| 0009 | DOWN | grant_service_role_admin_profiles | local | rollback validado via psql (UP→DOWN→UP) | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0010 | UP | add_partner_viewer_role | produção (Supabase) | supabase/migrations/20260623000000_add_partner_viewer_role.sql | 2026-06-23 | Lucas Vital | executado ✅ |
| 0011 | UP | products_price | produção (Supabase) | supabase/migrations/20260626000000_products_price.sql | 2026-06-26 | Matheus Dias Campos | executado ✅ |
| 0011 | DOWN | products_price | — | — | — | — | pendente |
| 0012 | UP | login_attempts | — | supabase/migrations/20260626120000_login_attempts.sql | — | — | pendente |
| 0012 | DOWN | login_attempts | — | — | — | — | pendente |
