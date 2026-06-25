import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Pagination } from "@/shared/components/ui/Pagination";
import { getAdminProducts } from "../queries";
import { ProductRow } from "./ProductRow";

type ProductListProps = {
  page?: number;
  search?: string;
  categorySlug?: string;
  status?: string;
  searchParams?: Record<string, string>;
};

export async function ProductList({
  page = 1,
  search = "",
  categorySlug = "",
  status = "",
  searchParams = {},
}: ProductListProps) {
  const { products, totalPages } = await getAdminProducts({ page, search, categorySlug, status });

  if (products.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto encontrado"
        description={
          search || categorySlug || status
            ? "Tente ajustar os filtros."
            : "Comece adicionando o primeiro produto ao catálogo."
        }
        action={
          !search && !categorySlug && !status
            ? { label: "Adicionar produto", href: "/admin/produtos/novo" }
            : undefined
        }
      />
    );
  }

  return (
    <div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-navy-border">
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Nome
            </th>
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Categoria
            </th>
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Estoque
            </th>
            <th className="py-3 font-body text-xs font-medium uppercase tracking-label text-muted-text">
              Status
            </th>
            <th className="py-3 text-right" colSpan={4}>
              <span className="font-body text-xs font-medium uppercase tracking-label text-muted-text">
                Ações
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>

      <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
    </div>
  );
}
