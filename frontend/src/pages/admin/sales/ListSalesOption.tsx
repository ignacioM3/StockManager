import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { useNavigate } from "react-router-dom";
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { AppRoutes } from "../../../routes";

export function ListSalesOption() {

  const navigate = useNavigate();

  const filters = [
    {
      title: "Ventas del día",
      description: "Consulta las ventas realizadas hoy",
      icon: <FaCalendarDay />,
      route: AppRoutes.todaySales.route()
    },
    {
      title: "Ventas semanales",
      description: "Resumen de ventas por semana",
      icon: <FaCalendarWeek />,
      route: AppRoutes.weekendSales.route()
    },
    {
      title: "Ventas mensuales",
      description: "Consulta ventas del mes actual",
      icon: <FaCalendarAlt />,
      route: AppRoutes.monthlySales.route()
    },
    {
      title: "Reporte general",
      description: "Historial completo de ventas",
      icon: <FaChartLine />,
      route: "AppRoutes.salesReport.route()"
    }
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Opciones de filtrado de ventas</PageTitle>
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