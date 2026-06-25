"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/Input";
import { Textarea } from "@/shared/components/ui/Textarea";
import { Select } from "@/shared/components/ui/Select";
import { Button } from "@/shared/components/ui/Button";
import { isValidCnpj, isValidCpf } from "../document-validation";
import { partnerApplicationSchema } from "../schemas";
import { submitPartnerApplication } from "../actions";
import {
  EMPLOYEE_COUNT_OPTIONS,
  GEOGRAPHIC_SCOPE_OPTIONS,
  MAIN_CHALLENGE_OPTIONS,
  MARKET_SEGMENT_OPTIONS,
  PIONEER_OPTIONS,
  PURCHASE_POTENTIAL_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SUPPLIER_PRIORITY_OPTIONS,
  YEARS_OPTIONS,
} from "../labels";
import type {
  DocumentType,
  EmployeeCount,
  GeographicScope,
  InitialPurchasePotential,
  MainChallenge,
  MarketSegment,
  PioneerPartnersInterest,
  RelationshipInterest,
  SupplierPriority,
  YearsInMarket,
} from "../types";

type PartnerApplicationFormProps = {
  productId: string;
  productName: string;
};

type Answers = {
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
};

const INITIAL_ANSWERS: Answers = {
  document_type: "cnpj",
  document_number: "",
  legal_name: "",
  trade_name: "",
  city: "",
  state: "",
  website: null,
  contact_name: "",
  contact_role: "",
  phone: "",
  email: "",
  linkedin_url: null,
  relationship_interest: "consumidor_final",
  relationship_interest_other: null,
  interest_reason: null,
  market_segment: "transporte",
  market_segment_other: null,
  years_in_market: "menos_2",
  employee_count: "até_5",
  main_challenges: ["alto_consumo"],
  main_challenges_other: null,
  supplier_priorities: ["qualidade"],
  works_with_professional_products: false,
  current_brands: null,
  geographic_scope: "local",
  has_sales_team: false,
  has_logistics_structure: false,
  initial_purchase_potential: "nao_consigo_estimar",
  interested_in_training: false,
  pioneer_partners_interest: "apenas_acompanhar",
};

const STEP_TITLES = [
  "Identificação",
  "Perfil de relacionamento",
  "Perfil de mercado",
  "Desafios e prioridades",
  "Crescimento, estrutura e planejamento de compra",
  "NERTA Pioneer Partners",
];

function toggleArrayValue<T>(array: T[], value: T): T[] {
  return array.includes(value) ? array.filter((item) => item !== value) : [...array, value];
}

export function PartnerApplicationForm({ productId, productName }: PartnerApplicationFormProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function validateIdentificationStep(): string | null {
    const documentValid =
      answers.document_type === "cpf"
        ? isValidCpf(answers.document_number)
        : isValidCnpj(answers.document_number);

    if (!documentValid) return "Documento inválido. Verifique os dígitos informados.";
    return null;
  }

  function handleNext() {
    if (step === 0) {
      const validationError = validateIdentificationStep();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError(null);
    setStep((current) => Math.min(current + 1, STEP_TITLES.length - 1));
  }

  function handleBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit() {
    setError(null);

    const payload = { ...answers, product_id: productId };
    const parsed = partnerApplicationSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setPending(true);
    const result = await submitPartnerApplication(parsed.data);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-h3">Candidatura enviada!</h2>
        <p className="font-body text-sm text-muted-text">
          Recebemos sua candidatura ao Programa de Qualificação de Parceiros Nerta Brasil para o
          produto <strong>{productName}</strong>. Nossa equipe entrará em contato em breve.
        </p>
      </div>
    );
  }

  const isLastStep = step === STEP_TITLES.length - 1;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-h3">{STEP_TITLES[step]}</h2>

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={answers.document_type === "cnpj" ? "primary" : "secondary"}
              size="sm"
              onClick={() => update("document_type", "cnpj")}
            >
              Pessoa Jurídica
            </Button>
            <Button
              type="button"
              variant={answers.document_type === "cpf" ? "primary" : "secondary"}
              size="sm"
              onClick={() => update("document_type", "cpf")}
            >
              Pessoa Física
            </Button>
          </div>

          {answers.document_type === "cnpj" ? (
            <>
              <Input
                label="Razão Social"
                required
                value={answers.legal_name}
                onChange={(e) => update("legal_name", e.target.value)}
              />
              <Input
                label="Nome Fantasia"
                value={answers.trade_name ?? ""}
                onChange={(e) => update("trade_name", e.target.value || null)}
              />
            </>
          ) : (
            <Input
              label="Nome Completo"
              required
              value={answers.legal_name}
              onChange={(e) => update("legal_name", e.target.value)}
            />
          )}

          <Input
            label={answers.document_type === "cnpj" ? "CNPJ" : "CPF"}
            required
            value={answers.document_number}
            onChange={(e) => update("document_number", e.target.value)}
          />
          <Input
            label="Cidade"
            required
            value={answers.city}
            onChange={(e) => update("city", e.target.value)}
          />
          <Input
            label="Estado"
            required
            value={answers.state}
            onChange={(e) => update("state", e.target.value)}
          />
          <Input
            label="Website"
            value={answers.website ?? ""}
            onChange={(e) => update("website", e.target.value || null)}
          />
          <Input
            label="Nome do responsável"
            required
            value={answers.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
          />
          <Input
            label="Cargo"
            required
            value={answers.contact_role}
            onChange={(e) => update("contact_role", e.target.value)}
          />
          <Input
            label="Telefone"
            required
            value={answers.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <Input
            label="E-mail"
            type="email"
            required
            value={answers.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <Input
            label="LinkedIn (opcional)"
            value={answers.linkedin_url ?? ""}
            onChange={(e) => update("linkedin_url", e.target.value || null)}
          />
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <Select
            label="Qual seu interesse principal de relacionamento com a Nerta Brasil?"
            options={RELATIONSHIP_OPTIONS}
            value={answers.relationship_interest}
            onChange={(e) => update("relationship_interest", e.target.value as RelationshipInterest)}
          />
          {answers.relationship_interest === "outro" && (
            <Input
              label="Detalhe seu interesse"
              value={answers.relationship_interest_other ?? ""}
              onChange={(e) => update("relationship_interest_other", e.target.value || null)}
            />
          )}
          <Textarea
            label="O que despertou seu interesse? (opcional)"
            value={answers.interest_reason ?? ""}
            onChange={(e) => update("interest_reason", e.target.value || null)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <Select
            label="Segmento principal"
            options={MARKET_SEGMENT_OPTIONS}
            value={answers.market_segment}
            onChange={(e) => update("market_segment", e.target.value as MarketSegment)}
          />
          {answers.market_segment === "outro" && (
            <Input
              label="Detalhe o segmento"
              value={answers.market_segment_other ?? ""}
              onChange={(e) => update("market_segment_other", e.target.value || null)}
            />
          )}
          <Select
            label="Tempo de atuação no mercado"
            options={YEARS_OPTIONS}
            value={answers.years_in_market}
            onChange={(e) => update("years_in_market", e.target.value as YearsInMarket)}
          />
          <Select
            label="Número de colaboradores"
            options={EMPLOYEE_COUNT_OPTIONS}
            value={answers.employee_count}
            onChange={(e) => update("employee_count", e.target.value as EmployeeCount)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="font-body text-xs font-medium tracking-label text-light-gray">
              Maiores desafios em limpeza/manutenção
            </legend>
            {MAIN_CHALLENGE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2 font-body text-sm text-white">
                <input
                  type="checkbox"
                  checked={answers.main_challenges.includes(option.value)}
                  onChange={() =>
                    update("main_challenges", toggleArrayValue(answers.main_challenges, option.value))
                  }
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          {answers.main_challenges.includes("outro") && (
            <Input
              label="Detalhe o desafio"
              value={answers.main_challenges_other ?? ""}
              onChange={(e) => update("main_challenges_other", e.target.value || null)}
            />
          )}
          <fieldset className="flex flex-col gap-2">
            <legend className="font-body text-xs font-medium tracking-label text-light-gray">
              O que mais valoriza num fornecedor
            </legend>
            {SUPPLIER_PRIORITY_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2 font-body text-sm text-white">
                <input
                  type="checkbox"
                  checked={answers.supplier_priorities.includes(option.value)}
                  onChange={() =>
                    update(
                      "supplier_priorities",
                      toggleArrayValue(answers.supplier_priorities, option.value)
                    )
                  }
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 font-body text-sm text-white">
            <input
              type="checkbox"
              checked={answers.works_with_professional_products}
              onChange={(e) => update("works_with_professional_products", e.target.checked)}
            />
            Já trabalha com produtos profissionais
          </label>
          <Input
            label="Marcas que comercializa/utiliza atualmente (opcional)"
            value={answers.current_brands ?? ""}
            onChange={(e) => update("current_brands", e.target.value || null)}
          />
          <Select
            label="Área geográfica de atuação"
            options={GEOGRAPHIC_SCOPE_OPTIONS}
            value={answers.geographic_scope}
            onChange={(e) => update("geographic_scope", e.target.value as GeographicScope)}
          />
          <label className="flex items-center gap-2 font-body text-sm text-white">
            <input
              type="checkbox"
              checked={answers.has_sales_team}
              onChange={(e) => update("has_sales_team", e.target.checked)}
            />
            Possui equipe comercial
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-white">
            <input
              type="checkbox"
              checked={answers.has_logistics_structure}
              onChange={(e) => update("has_logistics_structure", e.target.checked)}
            />
            Possui estrutura logística
          </label>
          <Select
            label="Potencial inicial de compra mensal"
            options={PURCHASE_POTENTIAL_OPTIONS}
            value={answers.initial_purchase_potential}
            onChange={(e) =>
              update("initial_purchase_potential", e.target.value as InitialPurchasePotential)
            }
          />
          <label className="flex items-center gap-2 font-body text-sm text-white">
            <input
              type="checkbox"
              checked={answers.interested_in_training}
              onChange={(e) => update("interested_in_training", e.target.checked)}
            />
            Interesse em demonstrações/treinamentos
          </label>
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-4">
          <Select
            label="Interesse no programa NERTA Pioneer Partners"
            options={PIONEER_OPTIONS}
            value={answers.pioneer_partners_interest}
            onChange={(e) =>
              update("pioneer_partners_interest", e.target.value as PioneerPartnersInterest)
            }
          />
        </div>
      )}

      {error && (
        <p className="font-body text-sm text-[#E5634D]" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-between gap-3">
        <Button type="button" variant="secondary" onClick={handleBack} disabled={step === 0}>
          Voltar
        </Button>
        {isLastStep ? (
          <Button type="button" onClick={handleSubmit} disabled={pending}>
            {pending ? "Enviando..." : "Enviar"}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            Avançar
          </Button>
        )}
      </div>
    </div>
  );
}
