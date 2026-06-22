import type { ReactNode } from "react";
import type { PartnerApplication } from "@/features/partner-applications";

type PartnerApplicationDetailProps = {
  application: PartnerApplication;
};

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-body text-xs font-medium tracking-label text-light-gray">{label}</span>
      <span className="font-body text-sm text-white">{value ?? "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-nerta-blue pl-4">
      <h2 className="text-h3">{title}</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function PartnerApplicationDetail({ application: a }: PartnerApplicationDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      <Section title="Identificação">
        <Field
          label={a.document_type === "cnpj" ? "Razão Social" : "Nome Completo"}
          value={a.legal_name}
        />
        {a.document_type === "cnpj" && <Field label="Nome Fantasia" value={a.trade_name} />}
        <Field label={a.document_type === "cnpj" ? "CNPJ" : "CPF"} value={a.document_number} />
        <Field label="Cidade" value={a.city} />
        <Field label="Estado" value={a.state} />
        <Field label="Website" value={a.website} />
        <Field label="Nome do responsável" value={a.contact_name} />
        <Field label="Cargo" value={a.contact_role} />
        <Field label="Telefone" value={a.phone} />
        <Field label="E-mail" value={a.email} />
        <Field label="LinkedIn" value={a.linkedin_url} />
      </Section>

      <Section title="Produto de origem">
        <Field label="Produto" value={a.product_name_snapshot} />
      </Section>

      <Section title="Perfil de relacionamento">
        <Field label="Interesse" value={a.relationship_interest} />
        <Field label="Detalhe" value={a.relationship_interest_other} />
        <Field label="Motivo do interesse" value={a.interest_reason} />
      </Section>

      <Section title="Perfil de mercado">
        <Field label="Segmento" value={a.market_segment} />
        <Field label="Detalhe do segmento" value={a.market_segment_other} />
        <Field label="Tempo de atuação" value={a.years_in_market} />
        <Field label="Colaboradores" value={a.employee_count} />
      </Section>

      <Section title="Desafios e prioridades">
        <Field label="Principais desafios" value={a.main_challenges.join(", ")} />
        <Field label="Detalhe do desafio" value={a.main_challenges_other} />
        <Field label="Prioridades no fornecedor" value={a.supplier_priorities.join(", ")} />
      </Section>

      <Section title="Crescimento, estrutura e planejamento de compra">
        <Field
          label="Já trabalha com produtos profissionais"
          value={a.works_with_professional_products ? "Sim" : "Não"}
        />
        <Field label="Marcas atuais" value={a.current_brands} />
        <Field label="Área geográfica" value={a.geographic_scope} />
        <Field label="Possui equipe comercial" value={a.has_sales_team ? "Sim" : "Não"} />
        <Field label="Possui estrutura logística" value={a.has_logistics_structure ? "Sim" : "Não"} />
        <Field label="Potencial de compra mensal" value={a.initial_purchase_potential} />
        <Field
          label="Interesse em treinamentos"
          value={a.interested_in_training ? "Sim" : "Não"}
        />
      </Section>

      <Section title="NERTA Pioneer Partners">
        <Field label="Interesse no programa" value={a.pioneer_partners_interest} />
      </Section>

      <p className="font-body text-xs text-muted-text">
        Recebida em {new Date(a.created_at).toLocaleString("pt-BR")}
      </p>
    </div>
  );
}
