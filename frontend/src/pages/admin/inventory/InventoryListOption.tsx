import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { useNavigate } from "react-router-dom";
import { FaBoxes, FaWarehouse, FaExclamationTriangle, FaHistory } from "react-icons/fa";
import { AppRoutes } from "../../../routes";

export function InventoryListOption() {

  const navigate = useNavigate();

  const filters = [
    {
      title: "Inventario general",
      description: "Vista completa del stock disponible",
      icon: <FaBoxes />,
      route: AppRoutes.inventoryList.route()
    },
    {
      title: "Por depósito",
      description: "Consulta inventario por ubicación física",
      icon: <FaWarehouse />,
      route: AppRoutes.inventoryByWarehouse.route()
    },
    {
      title: "Bajo stock",
      description: "Productos que requieren reposición",
      icon: <FaExclamationTriangle />,
      route: AppRoutes.lowStockInventory.route()
    },
    {
      title: "Movimientos",
      description: "Historial de reabastecimientos",
      icon: <FaHistory />,
      route: AppRoutes.inventoryMovements.route()
    }
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Opciones de inventario</PageTitle>
      </PageHeader>

      <PageContent>
        <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filters.map((filter, index) => (
              <div
                key={index}
                onClick={() => navigate(filter.route)}
                className="cursor-pointer p-6 rounded-xl border border-[#f3ead0] bg-gray-50 hover:bg-orange-50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-3xl text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                  {filter.icon}
                </div>

                <h3 className="font-bold text-[#5C4630] text-lg">
                  {filter.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {filter.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </PageContent>
    </PageContainer>
  );
}