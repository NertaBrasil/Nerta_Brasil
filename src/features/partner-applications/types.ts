export type DocumentType = "cnpj" | "cpf";

export type RelationshipInterest =
  | "consumidor_final"
  | "revendedor_autorizado"
  | "distribuidor_regional"
  | "parceiro_tecnico_aplicador"
  | "conhecendo_marca"
  | "outro";

export type MarketSegment =
  | "transporte"
  | "logistica"
  | "lavagem_profissional"
  | "agricultura"
  | "construcao"
  | "industria"
  | "oficina_mecanica"
  | "comercio"
  | "outro";

export type YearsInMarket = "menos_2" | "2_a_5" | "5_a_10" | "mais_10";

export type EmployeeCount = "até_5" | "6_a_20" | "21_a_50" | "51_a_100" | "mais_100";

export type MainChallenge =
  | "alto_consumo"
  | "custos_elevados"
  | "baixa_eficiencia"
  | "tempo_excessivo"
  | "falta_assistencia"
  | "problemas_ambientais"
  | "outro";

export type SupplierPriority =
  | "qualidade"
  | "preco"
  | "suporte_tecnico"
  | "disponibilidade_estoque"
  | "formacao"
  | "inovacao"
  | "sustentabilidade";

export type GeographicScope = "local" | "regional" | "estadual" | "nacional";

export type InitialPurchasePotential =
  | "até_5000"
  | "5000_a_20000"
  | "20000_a_50000"
  | "acima_50000"
  | "nao_consigo_estimar";

export type PioneerPartnersInterest =
  | "sim_tenho_interesse"
  | "quero_mais_detalhes"
  | "apenas_acompanhar";

export type PartnerApplication = {
  id: string;
  product_id: string | null;
  product_name_snapshot: string;
  document_type: DocumentType;
  document_number: string;
  legal_name: string;
  trade_name: string | null;
  city: string;
  state: string;
  website: string | null;
  contact_name: string;
  contact_role: string;
  phone: string;
  email: string;
  linkedin_url: string | null;
  relationship_interest: RelationshipInterest;
  relationship_interest_other: string | null;
  interest_reason: string | null;
  market_segment: MarketSegment;
  market_segment_other: string | null;
  years_in_market: YearsInMarket;
  employee_count: EmployeeCount;
  main_challenges: MainChallenge[];
  main_challenges_other: string | null;
  supplier_priorities: SupplierPriority[];
  works_with_professional_products: boolean;
  current_brands: string | null;
  geographic_scope: GeographicScope;
  has_sales_team: boolean;
  has_logistics_structure: boolean;
  initial_purchase_potential: InitialPurchasePotential;
  interested_in_training: boolean;
  pioneer_partners_interest: PioneerPartnersInterest;
  created_at: string;
};

/** Versão resumida usada na listagem em /admin/parcerias */
export type PartnerApplicationSummary = Pick<
  PartnerApplication,
  | "id"
  | "legal_name"
  | "document_type"
  | "product_name_snapshot"
  | "relationship_interest"
  | "created_at"
>;

export type SubmitPartnerApplicationInput = Omit<
  PartnerApplication,
  "id" | "product_name_snapshot" | "created_at"
> & {
  product_id: string;
};
