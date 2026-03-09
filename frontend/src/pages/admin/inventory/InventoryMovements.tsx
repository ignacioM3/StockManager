import { useMemo, useState } from "react";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { MetricCard } from "../../../component/styles/MetricCard";
import { AppRoutes } from "../../../routes";
import { SearchBar } from "../../../component/SearchBar";

export function InventoryMovements() {

  const [search, setSearch] = useState("");

  // 🔥 DATA HARDCODEADA
  const movements = [
    {
      id: "1",
      type: "IN",
      quantity: 50,
      product: { name: "Yerba Mate Premium", sku: "SKU-001" },
      warehouse: { name: "Depósito Central" },
      createdAt: new Date(),
      reference: "Proveedor A"
    },
    {
      id: "2",
      type: "OUT",
      quantity: 3,
      product: { name: "Azúcar 1kg", sku: "SKU-002" },
      warehouse: { name: "Depósito Central" },
      createdAt: new Date(),
      reference: "Ajuste manual"
    },
    {
      id: "3",
      type: "TRANSFER",
      quantity: 10,
      product: { name: "Café Molido", sku: "SKU-003" },
      warehouse: { name: "Depósito Norte" },
      createdAt: new Date(),
      reference: "Transferencia interna"
    }
  ];

  // 🔎 Filtro
  const filteredMovements = useMemo(() => {
    if (!search.trim()) return movements;

    const lowerSearch = search.toLowerCase();

    return movements.filter(m =>
      m.product.name.toLowerCase().includes(lowerSearch) ||
      m.product.sku.toLowerCase().includes(lowerSearch) ||
      m.warehouse.name.toLowerCase().includes(lowerSearch) ||
      m.reference.toLowerCase().includes(lowerSearch)
    );
  }, [movements, search]);

  // 📊 Métricas
  const totalMovements = movements.length;
  const totalIn = movements
    .filter(m => m.type === "IN")
    .reduce((acc, m) => acc + m.quantity, 0);

  const totalOut = movements
    .filter(m => m.type === "OUT")
    .reduce((acc, m) => acc + m.quantity, 0);

  return (
    <PageContainer>
      <PageHeader backString={AppRoutes.inventoryListOption.route()}>
        <PageTitle>Movimientos de inventario</PageTitle>
      </PageHeader>

      <PageContent>
        <div className="space-y-8">

          {/* 📊 MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard
              title="Total movimientos"
              value={totalMovements}
              color="text-blue-600"
            />
            <MetricCard
              title="Ingresos"
              value={totalIn}
              color="text-green-600"
            />
            <MetricCard
              title="Egresos"
              value={totalOut}
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
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Depósito</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Referencia</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map(m => {

                  const isIn = m.type === "IN";
                  const isOut = m.type === "OUT";
                  const isTransfer = m.type === "TRANSFER";

                  return (
                    <tr
                      key={m.id}
                      className="border-b last:border-none hover:bg-orange-50 transition-colors"
                    >
                      <td className="p-3 text-gray-500">
                        {new Date(m.createdAt).toLocaleString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>

                      <td className="p-3 font-medium">
                        {m.product.name}
                      </td>

                      <td className="p-3 text-gray-600">
                        {m.product.sku}
                      </td>

                      <td className="p-3">
                        {m.warehouse.name}
                      </td>

                      <td className={`p-3 font-bold ${
                        isIn
                          ? "text-green-600"
                          : isOut
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}>
                        {isIn && "+"}
                        {isOut && "-"}
                        {m.quantity}
                      </td>

                      <td className="p-3">
                        {isIn && (
                          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                            Ingreso
                          </span>
                        )}
                        {isOut && (
                          <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                            Egreso
                          </span>
                        )}
                        {isTransfer && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
                            Transferencia
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-gray-500">
                        {m.reference}
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