import { useMemo, useState } from "react";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { MetricCard } from "../../../component/styles/MetricCard";
import { AppRoutes } from "../../../routes";
import { SearchBar } from "../../../component/SearchBar";

export function LowStockInventory() {

  const [search, setSearch] = useState("");
  const MIN_STOCK = 5;

  // 🔥 DATA HARDCODEADA
  const inventories = [
    {
      id: "1",
      quantity: 3,
      product: { name: "Yerba Mate Premium", sku: "SKU-001" },
      warehouse: { name: "Depósito Central" }
    },
    {
      id: "2",
      quantity: 25,
      product: { name: "Azúcar 1kg", sku: "SKU-002" },
      warehouse: { name: "Depósito Central" }
    },
    {
      id: "3",
      quantity: 0,
      product: { name: "Café Molido", sku: "SKU-003" },
      warehouse: { name: "Depósito Norte" }
    }
  ];

  // ⚠️ Filtrar solo bajo stock
  const lowStockItems = useMemo(() => {
    return inventories.filter(item => item.quantity < MIN_STOCK);
  }, [inventories]);

  // 🔎 Buscador
  const filteredItems = useMemo(() => {
    if (!search.trim()) return lowStockItems;

    const lowerSearch = search.toLowerCase();

    return lowStockItems.filter(item =>
      item.product.name.toLowerCase().includes(lowerSearch) ||
      item.product.sku.toLowerCase().includes(lowerSearch) ||
      item.warehouse.name.toLowerCase().includes(lowerSearch)
    );
  }, [lowStockItems, search]);

  const criticalCount = lowStockItems.filter(i => i.quantity === 0).length;
  const warningCount = lowStockItems.filter(i => i.quantity > 0).length;

  return (
    <PageContainer>
      <PageHeader backString={AppRoutes.inventoryListOption.route()}>
        <PageTitle>Productos con bajo stock</PageTitle>
      </PageHeader>

      <PageContent>
        <div className="space-y-8">

          {/* 📊 MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <MetricCard
              title="Stock crítico"
              value={criticalCount}
              color="text-red-600"
            />

            <MetricCard
              title="Stock bajo"
              value={warningCount}
              color="text-orange-600"
            />

          </div>

          {/* 🔎 Buscador */}
          <div className="flex justify-end">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* 📋 Tabla */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f3ead0] text-[#5C4630]">
                  <th className="p-3">Producto</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Depósito</th>
                  <th className="p-3">Stock actual</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acción</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => {

                    const isCritical = item.quantity === 0;

                    return (
                      <tr
                        key={item.id}
                        className="border-b last:border-none hover:bg-red-50 transition-colors"
                      >
                        <td className="p-3 font-medium">
                          {item.product.name}
                        </td>

                        <td className="p-3 text-gray-600">
                          {item.product.sku}
                        </td>

                        <td className="p-3">
                          {item.warehouse.name}
                        </td>

                        <td className={`p-3 font-bold ${
                          isCritical
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}>
                          {item.quantity}
                        </td>

                        <td className="p-3">
                          {isCritical ? (
                            <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                              Crítico
                            </span>
                          ) : (
                            <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
                              Bajo
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <button
                            className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            onClick={() => alert("Reabastecer producto")}
                          >
                            Reabastecer
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No hay productos con bajo stock 🎉
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