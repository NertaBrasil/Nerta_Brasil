import { PartnerApplicationList } from "@/features/admin/partner-applications";

export default function AdminPartnerApplicationsPage() {
  return (
    <div>
      <h1 className="text-h2">Parcerias</h1>

      <div className="mt-6">
        <PartnerApplicationList />
      </div>
    </div>
  );
}
