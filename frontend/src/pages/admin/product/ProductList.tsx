import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageContainer } from "../../../component/styles/PageContainer";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { PageContent } from "../../../component/styles/PageContent";
import { MetricCard } from "../../../component/styles/MetricCard";
import { SearchBar } from "../../../component/SearchBar";
import { ListAddButton } from "../../../component/styles/ListAddButton";

export function ProductList() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // 🔥 MOCK DATA
  const products = [
    {
      id: "p1",
      sku: "SKU-001",
      name: "Yerba Mate Premium",
      category: "Alimentos",
      price: 1500,
      totalStock: 25
    },
    {
      id: "p2",
      sku: "SKU-002",
      name: "Azúcar 1kg",
      category: "Alimentos",
      price: 800,
      totalStock: 120
    },
    {
      id: "p3",
      sku: "SKU-003",
      name: "Café Molido",
      category: "Bebidas",
      price: 2200,
      totalStock: 0
    }
  ];

  // 🔎 FILTRO
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    const normalizedSearch = normalizeText(search);

    return products.filter(product =>
      normalizeText(product.name).includes(normalizedSearch) ||
      normalizeText(product.sku).includes(normalizedSearch) ||
      normalizeText(product.category).includes(normalizedSearch)
    );
  }, [search]);

  // 📊 MÉTRICAS
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (acc, p) => acc + p.totalStock,
    0
  );

  const outOfStock = products.filter(
    p => p.totalStock === 0
  ).length;

  const categoriesCount = new Set(
    products.map(p => p.category)
  ).size;

  return (
    <PageContainer>

      {/* HEADER */}
     <PageHeader>
  <div className="flex justify-between items-center w-full">
    <PageTitle>Productos</PageTitle>

    <ListAddButton
      onClick={() => navigate("AppRoutes.productCreate.route()")}
    >
      Nuevo producto
    </ListAddButton>
  </div>
</PageHeader>

      <PageContent>

        <div className="space-y-8">

          {/* 📊 MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <MetricCard
              title="Productos"
              value={totalProducts}
              color="text-blue-600"
            />

            <MetricCard
              title="Stock total"
              value={totalStock}
              color="text-green-600"
            />

            <MetricCard
              title="Sin stock"
              value={outOfStock}
              color="text-red-600"
            />

            <MetricCard
              title="Categorías"
              value={categoriesCount}
              color="text-purple-600"
            />

          </div>

          {/* SEARCH */}
          <div className="flex justify-end">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

          {/* 📦 TABLA */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f3ead0] text-[#5C4630]">
                  <th className="p-3">Producto</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Stock total</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => {

                    const isOut = product.totalStock === 0;

                    return (
                      <tr
                        key={product.id}
                        onClick={() =>
                          navigate(
                           " AppRoutes.productDetails.route(product.id)"
                          )
                        }
                        className="border-b border-[#f3ead0] hover:bg-orange-50 cursor-pointer transition"
                      >
                        <td className="p-3 font-medium">
                          {product.name}
                        </td>

                        <td className="p-3 text-gray-600">
                          {product.sku}
                        </td>

                        <td className="p-3">
                          {product.category}
                        </td>

                        <td className="p-3 font-semibold">
                          ${product.price.toLocaleString("es-AR")}
                        </td>

                        <td className={`p-3 font-bold ${
                          isOut
                            ? "text-red-600"
                            : "text-green-600"
                        }`}>
                          {product.totalStock}
                        </td>

                        <td className="p-3">
                          {isOut ? (
                            <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                              Sin stock
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                              Disponible
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-500">
                      {search
                        ? `No hay resultados para "${search}"`
                        : "No hay productos registrados."}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>

        </div>

      </PageContent>

    </PageContainer>
  );
}