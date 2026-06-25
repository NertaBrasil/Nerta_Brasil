import { notFound } from "next/navigation";
import { getPartnerApplicationById, PartnerApplicationDetail } from "@/features/admin/partner-applications";
import { BackLink } from "@/shared/components/ui/BackLink";

type AdminPartnerApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPartnerApplicationDetailPage({
  params,
}: AdminPartnerApplicationDetailPageProps) {
  const { id } = await params;
  const result = await getPartnerApplicationById(id);

  if (!result.success) notFound();

  return (
    <div>
      <BackLink href="/admin/parcerias" label="Voltar para parcerias" />
      <h1 className="mt-3 text-h2">Candidatura de Parceria</h1>
      <div className="mt-6">
        <PartnerApplicationDetail application={result.data} />
      </div>
    </div>
  );
}
