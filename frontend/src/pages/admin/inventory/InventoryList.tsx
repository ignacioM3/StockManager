import { useMemo, useState } from "react";
import { MetricCard } from "../../../component/styles/MetricCard";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { AppRoutes } from "../../../routes";
import { SearchBar } from "../../../component/SearchBar";

export function InventoryList() {
  const [search, setSearch] = useState("");

 const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase()
    .trim();

  // 🔥 DATA HARDCODEADA
  const inventories = [
    {
      id: "1",
      quantity: 3,
      lastRestocked: new Date(),
      product: {
        id: "p1",
        sku: "SKU-001",
        name: "Yerba Mate Premium",
        category: "Alimentos",
        price: 1500,
        description: ""
      },
      warehouse: {
        id: "w1",
        name: "Depósito Central",
        location: "Buenos Aires"
      }
    },
    {
      id: "2",
      quantity: 25,
      lastRestocked: new Date(),
      product: {
        id: "p2",
        sku: "SKU-002",
        name: "Azúcar 1kg",
        category: "Alimentos",
        price: 800,
        description: ""
      },
      warehouse: {
        id: "w1",
        name: "Depósito Central",
        location: "Buenos Aires"
      }
    },
    {
      id: "3",
      quantity: 0,
      lastRestocked: new Date(),
      product: {
        id: "p3",
        sku: "SKU-003",
        name: "Café Molido",
        category: "Bebidas",
        price: 2200,
        description: ""
      },
      warehouse: {
        id: "w2",
        name: "Depósito Norte",
        location: "Córdoba"
      }
    }
  ];


 const filteredInventory = useMemo(() => {
  if (!search.trim()) return inventories;

  const normalizedSearch = normalizeText(search);

  return inventories.filter(item =>
    normalizeText(item.product.name).includes(normalizedSearch) ||
    normalizeText(item.warehouse.name).includes(normalizedSearch) ||
    normalizeText(item.product.sku).includes(normalizedSearch) ||
    normalizeText(item.warehouse.location).includes(normalizedSearch)
  );
}, [inventories, search]);

  const totalProducts = inventories.length;
  const totalStock = inventories.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockCount = inventories.filter(item => item.quantity > 0 && item.quantity < 5).length;
  const outOfStockCount = inventories.filter(item => item.quantity === 0).length;

  return (
    <PageContainer>
      <PageHeader backString={AppRoutes.inventoryListOption.route()}>
        <PageTitle>Inventario</PageTitle>
      </PageHeader>

      <PageContent>
        <div className="space-y-8">

          {/* 📊 MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <MetricCard
              title="Productos distintos"
              value={totalProducts}
              color="text-blue-600"
            />

            <MetricCard
              title="Total en stock"
              value={totalStock}
              color="text-green-600"
            />

            <MetricCard
              title="Bajo stock"
              value={lowStockCount}
              color="text-orange-600"
            />

            <MetricCard
              title="Sin stock"
              value={outOfStockCount}
              color="text-red-600"
            />

          </div>

          {/* 🔎 Search */}
          <div className="flex justify-end mb-4">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

          {/* 📋 Tabla */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f3ead0] text-[#5C4630]">
                  <th className="p-3">Producto</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Depósito</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Último reabastecimiento</th>
                </tr>
              </thead>

              <tbody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map(item => {

                    const isLowStock = item.quantity > 0 && item.quantity < 5;
                    const isOutOfStock = item.quantity === 0;

                    return (
                      <tr
                        key={item.id}
                        className="border-b last:border-none border-[#f3ead0] hover:bg-orange-50 transition-colors"
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
                          isOutOfStock
                            ? "text-red-600"
                            : isLowStock
                              ? "text-orange-600"
                              : "text-green-600"
                        }`}>
                          {item.quantity}
                        </td>

                        {/* 🔥 UX MEJORADA */}
                        <td className="p-3">
                          {isOutOfStock && (
                            <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                              Sin stock
                            </span>
                          )}

                          {isLowStock && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
                              Bajo
                            </span>
                          )}

                          {!isLowStock && !isOutOfStock && (
                            <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                              Disponible
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-gray-500">
                          {new Date(item.lastRestocked).toLocaleString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-500">
                      {search
                        ? `No hay resultados para "${search}"`
                        : "No hay inventario registrado."}
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