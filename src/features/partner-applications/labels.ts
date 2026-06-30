import type { MainChallenge, SupplierPriority } from "./types";

export const RELATIONSHIP_OPTIONS = [
  { value: "consumidor_final", label: "Consumidor final" },
  { value: "revendedor_autorizado", label: "Revendedor autorizado" },
  { value: "distribuidor_regional", label: "Agente" },
  { value: "parceiro_tecnico_aplicador", label: "Parceiro técnico/aplicador" },
  { value: "conhecendo_marca", label: "Estou conhecendo a marca" },
  { value: "outro", label: "Outro" },
];

export const MARKET_SEGMENT_OPTIONS = [
  { value: "transporte", label: "Transporte" },
  { value: "logistica", label: "Logística" },
  { value: "lavagem_profissional", label: "Lavagem profissional" },
  { value: "agricultura", label: "Agricultura" },
  { value: "construcao", label: "Construção" },
  { value: "industria", label: "Indústria" },
  { value: "oficina_mecanica", label: "Oficina mecânica" },
  { value: "comercio", label: "Comércio" },
  { value: "outro", label: "Outro" },
];

export const YEARS_OPTIONS = [
  { value: "menos_2", label: "Menos de 2 anos" },
  { value: "2_a_5", label: "2 a 5 anos" },
  { value: "5_a_10", label: "5 a 10 anos" },
  { value: "mais_10", label: "Mais de 10 anos" },
];

export const EMPLOYEE_COUNT_OPTIONS = [
  { value: "até_5", label: "Até 5" },
  { value: "6_a_20", label: "6 a 20" },
  { value: "21_a_50", label: "21 a 50" },
  { value: "51_a_100", label: "51 a 100" },
  { value: "mais_100", label: "Mais de 100" },
];

export const MAIN_CHALLENGE_OPTIONS: { value: MainChallenge; label: string }[] = [
  { value: "alto_consumo", label: "Alto consumo de produtos" },
  { value: "custos_elevados", label: "Custos elevados" },
  { value: "baixa_eficiencia", label: "Baixa eficiência" },
  { value: "tempo_excessivo", label: "Tempo excessivo" },
  { value: "falta_assistencia", label: "Falta de assistência técnica" },
  { value: "problemas_ambientais", label: "Problemas ambientais" },
  { value: "outro", label: "Outro" },
];

export const SUPPLIER_PRIORITY_OPTIONS: { value: SupplierPriority; label: string }[] = [
  { value: "qualidade", label: "Qualidade" },
  { value: "preco", label: "Preço" },
  { value: "suporte_tecnico", label: "Suporte técnico" },
  { value: "disponibilidade_estoque", label: "Disponibilidade de estoque" },
  { value: "formacao", label: "Formação/treinamento" },
  { value: "inovacao", label: "Inovação" },
  { value: "sustentabilidade", label: "Sustentabilidade" },
];

export const GEOGRAPHIC_SCOPE_OPTIONS = [
  { value: "local", label: "Local" },
  { value: "regional", label: "Regional" },
  { value: "estadual", label: "Estadual" },
  { value: "nacional", label: "Nacional" },
];

export const PURCHASE_POTENTIAL_OPTIONS = [
  { value: "até_5000", label: "Até R$ 5.000" },
  { value: "5000_a_20000", label: "R$ 5.000 a R$ 20.000" },
  { value: "20000_a_50000", label: "R$ 20.000 a R$ 50.000" },
  { value: "acima_50000", label: "Acima de R$ 50.000" },
  { value: "nao_consigo_estimar", label: "Não consigo estimar" },
];

export const PIONEER_OPTIONS = [
  { value: "sim_tenho_interesse", label: "Sim, tenho interesse" },
  { value: "quero_mais_detalhes", label: "Quero mais detalhes" },
  { value: "apenas_acompanhar", label: "Apenas acompanhar" },
];

type Option = { value: string; label: string };

export function lookupLabel(options: Option[], value: string | null): string | null {
  if (value === null) return null;
  return options.find((o) => o.value === value)?.label ?? value;
}

export function lookupLabels(options: Option[], values: string[]): string {
  return values.map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ");
}
