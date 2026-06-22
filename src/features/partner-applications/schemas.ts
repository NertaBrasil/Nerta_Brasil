import { z } from "zod";
import { isValidCnpj, isValidCpf } from "./document-validation";

const INVALID_DOCUMENT_ERROR = "Documento inválido. Verifique os dígitos informados.";
const TRADE_NAME_NOT_ALLOWED_ERROR = "Nome Fantasia não se aplica para Pessoa Física.";

export const partnerApplicationSchema = z
  .object({
    product_id: z.string().min(1, "Produto de origem é obrigatório."),
    document_type: z.enum(["cnpj", "cpf"]),
    document_number: z.string().trim().min(1, "Documento é obrigatório."),
    legal_name: z.string().trim().min(1, "Campo obrigatório."),
    trade_name: z.string().trim().nullable().default(null),
    city: z.string().trim().min(1, "Cidade é obrigatória."),
    state: z.string().trim().min(1, "Estado é obrigatório."),
    website: z.string().trim().nullable().default(null),
    contact_name: z.string().trim().min(1, "Nome do responsável é obrigatório."),
    contact_role: z.string().trim().min(1, "Cargo é obrigatório."),
    phone: z.string().trim().min(1, "Telefone é obrigatório."),
    email: z.string().trim().email("E-mail inválido."),
    linkedin_url: z.string().trim().nullable().default(null),
    relationship_interest: z.enum([
      "consumidor_final",
      "revendedor_autorizado",
      "distribuidor_regional",
      "parceiro_tecnico_aplicador",
      "conhecendo_marca",
      "outro",
    ]),
    relationship_interest_other: z.string().trim().nullable().default(null),
    interest_reason: z.string().trim().nullable().default(null),
    market_segment: z.enum([
      "transporte",
      "logistica",
      "lavagem_profissional",
      "agricultura",
      "construcao",
      "industria",
      "oficina_mecanica",
      "comercio",
      "outro",
    ]),
    market_segment_other: z.string().trim().nullable().default(null),
    years_in_market: z.enum(["menos_2", "2_a_5", "5_a_10", "mais_10"]),
    employee_count: z.enum(["até_5", "6_a_20", "21_a_50", "51_a_100", "mais_100"]),
    main_challenges: z
      .array(
        z.enum([
          "alto_consumo",
          "custos_elevados",
          "baixa_eficiencia",
          "tempo_excessivo",
          "falta_assistencia",
          "problemas_ambientais",
          "outro",
        ])
      )
      .min(1, "Selecione ao menos um desafio."),
    main_challenges_other: z.string().trim().nullable().default(null),
    supplier_priorities: z
      .array(
        z.enum([
          "qualidade",
          "preco",
          "suporte_tecnico",
          "disponibilidade_estoque",
          "formacao",
          "inovacao",
          "sustentabilidade",
        ])
      )
      .min(1, "Selecione ao menos uma prioridade."),
    works_with_professional_products: z.boolean(),
    current_brands: z.string().trim().nullable().default(null),
    geographic_scope: z.enum(["local", "regional", "estadual", "nacional"]),
    has_sales_team: z.boolean(),
    has_logistics_structure: z.boolean(),
    initial_purchase_potential: z.enum([
      "até_5000",
      "5000_a_20000",
      "20000_a_50000",
      "acima_50000",
      "nao_consigo_estimar",
    ]),
    interested_in_training: z.boolean(),
    pioneer_partners_interest: z.enum([
      "sim_tenho_interesse",
      "quero_mais_detalhes",
      "apenas_acompanhar",
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.document_type === "cpf") {
      if (!isValidCpf(data.document_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: INVALID_DOCUMENT_ERROR,
          path: ["document_number"],
        });
      }
      if (data.trade_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: TRADE_NAME_NOT_ALLOWED_ERROR,
          path: ["trade_name"],
        });
      }
    } else if (!isValidCnpj(data.document_number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: INVALID_DOCUMENT_ERROR,
        path: ["document_number"],
      });
    }
  });

export type PartnerApplicationSchemaInput = z.infer<typeof partnerApplicationSchema>;
