import { useMemo, useState } from "react";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { MetricCard } from "../../../component/styles/MetricCard";
import { AppRoutes } from "../../../routes";
import { SearchBar } from "../../../component/SearchBar";

export function InventoryByWarehouse() {

  const [selectedWarehouse, setSelectedWarehouse] = useState("w1");
  const [search, setSearch] = useState("");

  // 🔥 Warehouses hardcodeados
  const warehouses = [
    { id: "w1", name: "Depósito Central", location: "Buenos Aires" },
    { id: "w2", name: "Depósito Norte", location: "Córdoba" }
  ];

  // 🔥 Inventario hardcodeado
  const inventories = [
    {
      id: "1",
      quantity: 3,
      warehouseId: "w1",
      product: { name: "Yerba Mate Premium", sku: "SKU-001" }
    },
    {
      id: "2",
      quantity: 25,
      warehouseId: "w1",
      product: { name: "Azúcar 1kg", sku: "SKU-002" }
    },
    {
      id: "3",
      quantity: 0,
      warehouseId: "w2",
      product: { name: "Café Molido", sku: "SKU-003" }
    }
  ];

  // 📦 Filtrado por depósito seleccionado
  const warehouseInventory = useMemo(() => {
    return inventories.filter(i => i.warehouseId === selectedWarehouse);
  }, [selectedWarehouse]);

  // 🔎 Search dentro del depósito
  const filteredInventory = useMemo(() => {
    if (!search.trim()) return warehouseInventory;

    const lowerSearch = search.toLowerCase();

    return warehouseInventory.filter(item =>
      item.product.name.toLowerCase().includes(lowerSearch) ||
      item.product.sku.toLowerCase().includes(lowerSearch)
    );
  }, [warehouseInventory, search]);

  const totalStock = warehouseInventory.reduce((acc, i) => acc + i.quantity, 0);
  const lowStock = warehouseInventory.filter(i => i.quantity > 0 && i.quantity < 5).length;
  const outOfStock = warehouseInventory.filter(i => i.quantity === 0).length;

  return (
    <PageContainer>
      <PageHeader backString={AppRoutes.inventoryListOption.route()}>
        <PageTitle>Inventario por depósito</PageTitle>
      </PageHeader>

      <PageContent>
        <div className="space-y-8">

          {/* 🏬 Selector de depósito */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">
            <label className="block text-sm font-semibold mb-2 text-[#5C4630]">
              Seleccionar depósito
            </label>

            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full p-3 border rounded-xl border-[#f3ead0] focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.location}
                </option>
              ))}
            </select>
          </div>

          {/* 📊 Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard
              title="Total en stock"
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
                  <th className="p-3">Stock</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const isLow = item.quantity > 0 && item.quantity < 5;
                  const isOut = item.quantity === 0;

                  return (
                    <tr key={item.id} className="border-b last:border-none hover:bg-orange-50">
                      <td className="p-3 font-medium">
                        {item.product.name}
                      </td>
                      <td className="p-3 text-gray-600">
                        {item.product.sku}
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
                        {isOut && <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">Sin stock</span>}
                        {isLow && <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">Bajo</span>}
                        {!isLow && !isOut && <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">Disponible</span>}
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