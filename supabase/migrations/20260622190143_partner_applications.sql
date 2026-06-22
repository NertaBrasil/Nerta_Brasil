-- Candidaturas do Programa de Qualificacao de Parceiros Nerta Brasil.
-- Originadas pelo botao de compra de um produto em purchase_mode = 'formulario_parceria'.
-- Somente leitura apos o envio (FR-015): sem politica de UPDATE/DELETE para nenhuma role.

create table partner_applications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_name_snapshot text not null,
  document_type text not null check (document_type in ('cnpj', 'cpf')),
  document_number text not null,
  legal_name text not null,
  trade_name text,
  city text not null,
  state text not null,
  website text,
  contact_name text not null,
  contact_role text not null,
  phone text not null,
  email text not null,
  linkedin_url text,
  relationship_interest text not null check (
    relationship_interest in (
      'consumidor_final', 'revendedor_autorizado', 'distribuidor_regional',
      'parceiro_tecnico_aplicador', 'conhecendo_marca', 'outro'
    )
  ),
  relationship_interest_other text,
  interest_reason text,
  market_segment text not null check (
    market_segment in (
      'transporte', 'logistica', 'lavagem_profissional', 'agricultura',
      'construcao', 'industria', 'oficina_mecanica', 'comercio', 'outro'
    )
  ),
  market_segment_other text,
  years_in_market text not null check (years_in_market in ('menos_2', '2_a_5', '5_a_10', 'mais_10')),
  employee_count text not null check (
    employee_count in ('até_5', '6_a_20', '21_a_50', '51_a_100', 'mais_100')
  ),
  main_challenges text[] not null default '{}',
  main_challenges_other text,
  supplier_priorities text[] not null default '{}',
  works_with_professional_products boolean not null,
  current_brands text,
  geographic_scope text not null check (geographic_scope in ('local', 'regional', 'estadual', 'nacional')),
  has_sales_team boolean not null,
  has_logistics_structure boolean not null,
  initial_purchase_potential text not null check (
    initial_purchase_potential in (
      'até_5000', '5000_a_20000', '20000_a_50000', 'acima_50000', 'nao_consigo_estimar'
    )
  ),
  interested_in_training boolean not null,
  pioneer_partners_interest text not null check (
    pioneer_partners_interest in ('sim_tenho_interesse', 'quero_mais_detalhes', 'apenas_acompanhar')
  ),
  created_at timestamptz not null default now()
);

alter table partner_applications enable row level security;

create policy "partner_applications_insert_public"
  on partner_applications for insert
  to anon, authenticated
  with check (true);

create policy "partner_applications_select_authenticated"
  on partner_applications for select
  to authenticated
  using (true);

grant insert on partner_applications to anon, authenticated;
grant select on partner_applications to authenticated;
