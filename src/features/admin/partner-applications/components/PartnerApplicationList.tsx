import Link from "next/link";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Pagination } from "@/shared/components/ui/Pagination";
import { RELATIONSHIP_OPTIONS, lookupLabel } from "@/features/partner-applications/labels";
import { getPartnerApplications } from "../actions";

type PartnerApplicationListProps = {
  page?: number;
  search?: string;
  documentType?: string;
  searchParams?: Record<string, string>;
};

export async function PartnerApplicationList({
  page = 1,
  search = "",
  documentType = "",
  searchParams = {},
}: PartnerApplicationListProps) {
  const result = await getPartnerApplications({ page, search, documentType });

  if (!result.success) {
    return <p className="font-body text-sm text-muted-text">{result.error}</p>;
  }

  const { data: applications, totalPages } = result.data;

  if (applications.length === 0) {
    return (
      <EmptyState
        title={search || documentType ? "Nenhuma candidatura encontrada" : "Nenhuma candidatura recebida ainda"}
        description={
          search || documentType
            ? "Tente ajustar os filtros."
            : "Candidaturas enviadas pelo formulário público de parceria aparecerão aqui."
        }
      />
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-navy-border">
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Razão Social / Nome
            </th>
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Tipo
            </th>
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Produto
            </th>
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Interesse
            </th>
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Data
            </th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="border-b border-navy-border">
              <td className="py-3 font-body text-sm text-white">{application.legal_name}</td>
              <td className="py-3 font-body text-sm text-muted-text">
                {application.document_type === "cnpj" ? "Pessoa Jurídica" : "Pessoa Física"}
              </td>
              <td className="py-3 font-body text-sm text-muted-text">
                {application.product_name_snapshot}
              </td>
              <td className="py-3 font-body text-sm text-muted-text">
                {lookupLabel(RELATIONSHIP_OPTIONS, application.relationship_interest)}
              </td>
              <td className="py-3 font-body text-sm text-muted-text">
                {new Date(application.created_at).toLocaleDateString("pt-BR")}
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/admin/parcerias/${application.id}`}
                  className="font-body text-sm font-medium text-sky-blue hover:underline"
                >
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
    </div>
  );
}
