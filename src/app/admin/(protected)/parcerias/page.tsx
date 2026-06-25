import { Suspense } from "react";
import { PartnerApplicationFilters } from "@/features/admin/partner-applications/components/PartnerApplicationFilters";
import { PartnerApplicationList } from "@/features/admin/partner-applications";

type SearchParams = Promise<{
  page?: string;
  search?: string;
  type?: string;
}>;

export default async function AdminPartnerApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search ?? "";
  const documentType = params.type ?? "";

  const rawSearchParams: Record<string, string> = {};
  if (search) rawSearchParams.search = search;
  if (documentType) rawSearchParams.type = documentType;

  return (
    <div>
      <h1 className="text-h2">Parcerias</h1>

      <div className="mt-6">
        <Suspense>
          <PartnerApplicationFilters search={search} documentType={documentType} />
        </Suspense>

        <PartnerApplicationList
          page={page}
          search={search}
          documentType={documentType}
          searchParams={rawSearchParams}
        />
      </div>
    </div>
  );
}
