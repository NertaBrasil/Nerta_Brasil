import Link from "next/link";
import { ProductList } from "@/features/admin/products";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-h2">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="font-body text-sm font-medium text-sky-blue hover:underline"
        >
          + Novo produto
        </Link>
      </div>

      <div className="mt-6">
        <ProductList />
      </div>
    </div>
  );
}
