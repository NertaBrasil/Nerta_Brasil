import Link from "next/link";
import { getPartnerApplications } from "../actions";

const RELATIONSHIP_LABELS: Record<string, string> = {
  consumidor_final: "Consumidor final",
  revendedor_autorizado: "Revendedor autorizado",
  distribuidor_regional: "Distribuidor regional",
  parceiro_tecnico_aplicador: "Parceiro técnico/aplicador",
  conhecendo_marca: "Conhecendo a marca",
  outro: "Outro",
};

export async function PartnerApplicationList() {
  const result = await getPartnerApplications();

  if (!result.success) {
    return <p className="font-body text-sm text-muted-text">{result.error}</p>;
  }

  const applications = result.data;

  if (applications.length === 0) {
    return <p className="font-body text-sm text-muted-text">Nenhuma candidatura recebida.</p>;
  }

  return (
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
              {RELATIONSHIP_LABELS[application.relationship_interest] ?? application.relationship_interest}
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
  );
}
