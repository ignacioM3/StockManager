import { useEffect, useState } from "react";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomerEnabled } from "../../../api/admin/CustomerApi";
import LoadingSpinner from "../../../component/styles/LoadingSpinner";
import { AppRoutes } from "../../../routes";
import { ListAddButton } from "../../../component/styles/ListAddButton";
import { Pagination } from "../../../component/styles/Pagination";
import type { CustomerListType } from "../../../types/Customer";
import { MdOutlineEdit, MdOutlineVisibilityOff } from "react-icons/md";
import { DisableCustomerModal } from "../../../component/modal/admin/DisableCustomerModal";

export function ListCustomers() {

  const [currentPage, setCurrentPage] = useState(1);
  const userPerPage = 6;
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getAllCustomerEnabled', currentPage],
    queryFn: () => getAllCustomerEnabled(currentPage),
    retry: false
  });

  useEffect(() => {
    if (data) {
      setTotal(data.total);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error al cargar clientes</h1>;
  if (!data) return null;

  return (
    <PageContainer>

      <PageHeader>
        <PageTitle>Lista de Clientes</PageTitle>

        <ListAddButton
          onClick={() => navigate(AppRoutes.addCustomer.route())}
        >
          Agregar Cliente
        </ListAddButton>
      </PageHeader>

      <PageContent>

        {/* CONTENEDOR MODERNO */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b border-[#f3ead0] text-[#5C4630] uppercase text-xs">
                  <th className="p-3">Cliente</th>
                  <th className="p-3 hidden md:table-cell">Email</th>
                  <th className="p-3 hidden md:table-cell">Ubicación</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.total ? (
                  data.customers.map((row: CustomerListType) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-none border-[#f3ead0] hover:bg-orange-50 transition-colors"
                    >

                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                            {row.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-medium text-[#5C4630]">
                              {row.name}
                            </p>
                            {!row.isActive && (
                              <span className="text-xs text-red-500">
                                Cliente deshabilitado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 hidden md:table-cell text-gray-600">
                        {row.email}
                      </td>

                      <td className="p-3 hidden md:table-cell text-gray-600">
                        {row.location}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Editar"
                            onClick={() => navigate(AppRoutes.updateCustomer.route(row.id))}
                            className="w-9 h-9 flex cursor-pointer items-center justify-center rounded-lg  bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all duration-200"
                          >
                            <MdOutlineEdit size={18} />
                          </button>

                          <button
                            title="Deshabilitar"
                            onClick={() =>
                              navigate(location.pathname + `?disableCustomer=${row.id}`)
                            }
                            className={`w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200
                                ${row.isActive
                                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                : "bg-blue-600 text-white"}`}
                          >
                            <MdOutlineVisibilityOff size={18} />
                          </button>

                          {/* Ver */}
                          <button
                            className="h-9 px-3 rounded-lg cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all duration-200 text-sm font-medium"
                          >
                            Ver
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No hay clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>

        {/* PAGINACIÓN */}
        <div className="mt-6">
          <Pagination
            total={total}
            perPage={userPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        <DisableCustomerModal />

      </PageContent>
    </PageContainer>
  );
}