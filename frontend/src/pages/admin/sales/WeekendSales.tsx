import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { MetricCard } from "../../../component/styles/MetricCard";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { getWeekendSales } from "../../../api/admin/SalesApi";
import LoadingSpinner from "../../../component/styles/LoadingSpinner";
import { AppRoutes } from "../../../routes";
import { SearchBar } from "../../../component/SearchBar";

export function WeekendSales() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['weekendSales'],
        queryFn: () => getWeekendSales(),
        retry: false
    });

    const [search, setSearch] = useState("");

    const sales = data?.sales ?? [];

    const filteredSales = useMemo(() => {
        if (!search.trim()) return sales;

        const lowerSearch = search.toLowerCase();

        return sales.filter(sale =>
            sale.product.name.toLowerCase().includes(lowerSearch) ||
            sale.customer.name.toLowerCase().includes(lowerSearch)
        );
    }, [sales, search]);

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <h1>Falta Implementar error</h1>;
    if (!data) return null;

    const { total, totalAmount, totalQuantity, averageAmount } = data;

    return (
        <PageContainer>
            <PageHeader backString={AppRoutes.salesListOption.route()}>
                <PageTitle>Ventas de la semana</PageTitle>
            </PageHeader>

            <PageContent>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <MetricCard
                            title="Total vendido"
                            value={`$${totalAmount.toFixed(2)}`}
                            color="text-green-600"
                        />

                        <MetricCard
                            title="Ventas realizadas"
                            value={total}
                            color="text-blue-600"
                        />

                        <MetricCard
                            title="Unidades vendidas"
                            value={totalQuantity}
                            color="text-orange-600"
                        />

                        <MetricCard
                            title="Ticket promedio"
                            value={`$${averageAmount.toFixed(2)}`}
                            color="text-purple-600"
                        />

                    </div>

      
                    <div className="flex justify-end mb-4">
                        <SearchBar
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                 
                    <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">
                        <div className="hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#f3ead0] text-[#5C4630]">
                                        <th className="p-3">Cliente</th>
                                        <th className="p-3">Producto</th>
                                        <th className="p-3">Cantidad</th>
                                        <th className="p-3">Monto</th>
                                        <th className="p-3">Hora</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredSales.length > 0 ? (
                                        filteredSales.map(sale => (
                                            <tr
                                                key={sale.id}
                                                className="border-b last:border-none border-[#f3ead0] hover:bg-orange-50 transition-colors"
                                            >

                                                <td className="p-3">
                                                    {sale.customer.name}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {sale.product.name}
                                                </td>

                                                <td className="p-3 font-semibold">
                                                    {sale.quantity}
                                                </td>

                                                <td className="p-3 font-bold text-green-600">
                                                    ${sale.amount.toFixed(2)}
                                                </td>

                                                <td className="p-3 text-gray-500">
                                                    {new Date(sale.soldAt).toLocaleString('es-AR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-3 text-center text-gray-500">
                                                {search
                                                    ? `No hay resultados para "${search}"`
                                                    : "No hay ventas registradas para hoy."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>

                </div>
            </PageContent>
        </PageContainer>
    );
}