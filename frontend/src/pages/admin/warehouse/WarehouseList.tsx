import { useMemo, useState } from "react";
import { FaWarehouse } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { MetricCard } from "../../../component/styles/MetricCard";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { SearchBar } from "../../../component/SearchBar";
import { AppRoutes } from "../../../routes";

export function WarehouseList() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // 🔥 DATA HARDCODEADA (luego API)
  const warehouses = [
    {
      id: "w1",
      name: "Depósito Central",
      location: "Buenos Aires",
      totalProducts: 120,
      totalStock: 540,
      lowStockItems: 3
    },
    {
      id: "w2",
      name: "Depósito Norte",
      location: "Córdoba",
      totalProducts: 40,
      totalStock: 120,
      lowStockItems: 8
    },
    {
      id: "w3",
      name: "Sucursal Oeste",
      location: "Mendoza",
      totalProducts: 65,
      totalStock: 300,
      lowStockItems: 0
    }
  ];

  // 🔎 filtro
  const filteredWarehouses = useMemo(() => {
    if (!search.trim()) return warehouses;

    const normalizedSearch = normalizeText(search);

    return warehouses.filter(w =>
      normalizeText(w.name).includes(normalizedSearch) ||
      normalizeText(w.location).includes(normalizedSearch)
    );
  }, [search]);

  // 📊 métricas
  const totalWarehouses = warehouses.length;

  const totalStock = warehouses.reduce(
    (acc, w) => acc + w.totalStock,
    0
  );

  const warehousesWithAlert = warehouses.filter(
    w => w.lowStockItems > 0
  ).length;

  const healthyWarehouses = warehouses.filter(
    w => w.lowStockItems === 0
  ).length;

  return (
    <PageContainer>

      {/* HEADER */}
      <PageHeader>
        <PageTitle>Sucursales</PageTitle>
      </PageHeader>

      <PageContent>

        <div className="space-y-8">

          {/* 📊 MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <MetricCard
              title="Sucursales"
              value={totalWarehouses}
              color="text-blue-600"
            />

            <MetricCard
              title="Stock total"
              value={totalStock}
              color="text-green-600"
            />

            <MetricCard
              title="Con alerta"
              value={warehousesWithAlert}
              color="text-orange-600"
            />

            <MetricCard
              title="Saludables"
              value={healthyWarehouses}
              color="text-emerald-600"
            />

          </div>

          {/* SEARCH */}
          <div className="flex justify-end">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

          {/* 🏬 GRID SUCURSALES */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map(warehouse => {

                  const hasAlert = warehouse.lowStockItems > 0;

                  return (
                    <div
                      key={warehouse.id}
                      onClick={() => navigate(AppRoutes.warehouseDetails.route(warehouse.id))}
                      className="
                        cursor-pointer
                        p-6
                        rounded-xl
                        border border-[#f3ead0]
                        bg-gray-50
                        hover:bg-orange-50
                        hover:shadow-md
                        transition-all
                        duration-200
                        group
                      "
                    >

                      {/* ICON */}
                      <div className="text-3xl text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                        <FaWarehouse />
                      </div>

                      {/* NAME */}
                      <h3 className="font-bold text-[#5C4630] text-lg">
                        {warehouse.name}
                      </h3>

                      {/* LOCATION */}
                      <p className="text-sm text-gray-500">
                        {warehouse.location}
                      </p>

                      {/* STATS */}
                      <div className="mt-4 space-y-1 text-sm">

                        <p>
                          <span className="font-semibold">
                            Productos:
                          </span>{" "}
                          {warehouse.totalProducts}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Stock total:
                          </span>{" "}
                          {warehouse.totalStock} unidades
                        </p>

                      </div>

                      {/* STATUS */}
                      <div className="mt-4">

                        {hasAlert ? (
                          <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
                            Requiere atención
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">
                            Operativa
                          </span>
                        )}

                      </div>

                      {/* ACTION */}
                      <div className="mt-4 text-sm font-semibold text-orange-600">
                        Ver inventario →
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  {search
                    ? `No hay resultados para "${search}"`
                    : "No hay sucursales registradas"}
                </div>
              )}

            </div>

          </div>

        </div>

      </PageContent>
    </PageContainer>
  );
}