import { EmptyState } from "@/shared/components/ui/EmptyState";
import { getAllProducts } from "../queries";
import { ProductRow } from "./ProductRow";

export async function ProductList() {
  const products = await getAllProducts();

  if (products.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto cadastrado"
        description="Comece adicionando o primeiro produto ao catálogo."
        action={{ label: "Adicionar produto", href: "/admin/produtos/novo" }}
      />
    );
  }

  return (
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
  );
}
