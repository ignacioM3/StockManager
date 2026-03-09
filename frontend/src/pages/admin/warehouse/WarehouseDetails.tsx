import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { PageContainer } from "../../../component/styles/PageContainer";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { PageContent } from "../../../component/styles/PageContent";
import { MetricCard } from "../../../component/styles/MetricCard";
import { SearchBar } from "../../../component/SearchBar";
import { AppRoutes } from "../../../routes";

export function WarehouseDetails() {

  const { warehouseId } = useParams();
  const [search, setSearch] = useState("");

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // 🔥 MOCK DATA
  const warehouse = {
    id: warehouseId,
    name: "Depósito Central",
    location: "Buenos Aires",
    manager: "Juan Pérez"
  };

  const inventories = [
    {
      id: "1",
      quantity: 3,
      product: {
        name: "Yerba Mate Premium",
        sku: "SKU-001",
        category: "Alimentos"
      },
      lastRestocked: new Date()
    },
    {
      id: "2",
      quantity: 25,
      product: {
        name: "Azúcar 1kg",
        sku: "SKU-002",
        category: "Alimentos"
      },
      lastRestocked: new Date()
    },
    {
      id: "3",
      quantity: 0,
      product: {
        name: "Café Molido",
        sku: "SKU-003",
        category: "Bebidas"
      },
      lastRestocked: new Date()
    }
  ];

  // 🔎 filtro
  const filteredInventory = useMemo(() => {
    if (!search.trim()) return inventories;

    const normalizedSearch = normalizeText(search);

    return inventories.filter(item =>
      normalizeText(item.product.name).includes(normalizedSearch) ||
      normalizeText(item.product.sku).includes(normalizedSearch) ||
      normalizeText(item.product.category).includes(normalizedSearch)
    );
  }, [search]);

  // 📊 métricas
  const totalProducts = inventories.length;
  const totalStock = inventories.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const lowStock = inventories.filter(
    i => i.quantity > 0 && i.quantity < 5
  ).length;

  const outOfStock = inventories.filter(
    i => i.quantity === 0
  ).length;

  return (
    <PageContainer>

      {/* HEADER */}
      <PageHeader backString={AppRoutes.warehouseList.route()}>
        <PageTitle>{warehouse.name}</PageTitle>
      </PageHeader>

      <PageContent>

        <div className="space-y-8">

          {/* INFO CARD */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">
            <h2 className="text-lg font-bold text-[#5C4630] mb-4">
              Información de la sucursal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

              <div>
                <p className="text-gray-500">Ubicación</p>
                <p className="font-semibold">{warehouse.location}</p>
              </div>

              <div>
                <p className="text-gray-500">Encargado</p>
                <p className="font-semibold">{warehouse.manager}</p>
              </div>

              <div>
                <p className="text-gray-500">ID</p>
                <p className="font-semibold">{warehouse.id}</p>
              </div>

            </div>
          </div>

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
              title="Bajo stock"
              value={lowStock}
              color="text-orange-600"
            />

            <MetricCard
              title="Sin stock"
              value={outOfStock}
              color="text-red-600"
            />

          </div>

          {/* SEARCH */}
          <div className="flex justify-end">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

          {/* 📦 INVENTORY TABLE */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f3ead0] text-[#5C4630]">
                  <th className="p-3">Producto</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Último ingreso</th>
                </tr>
              </thead>

              <tbody>
                {filteredInventory.map(item => {

                  const isLow = item.quantity > 0 && item.quantity < 5;
                  const isOut = item.quantity === 0;

                  return (
                    <tr
                      key={item.id}
                      
                      className="border-b border-[#f3ead0] hover:bg-orange-50"
                    >
                      <td className="p-3 font-medium">
                        {item.product.name}
                      </td>

                      <td className="p-3 text-gray-600">
                        {item.product.sku}
                      </td>

                      <td className="p-3">
                        {item.product.category}
                      </td>

                      <td className={`p-3 font-bold ${
                        isOut
                          ? "text-red-600"
                          : isLow
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}>
                        {item.quantity}
                      </td>

                      <td className="p-3">
                        {isOut && (
                          <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                            Sin stock
                          </span>
                        )}

                        {isLow && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
                            Bajo
                          </span>
                        )}

                        {!isLow && !isOut && (
                          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                            Disponible
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-gray-500">
                        {item.lastRestocked.toLocaleString("es-AR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>

        </div>

      </PageContent>
    </PageContainer>
  );
}