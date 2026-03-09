import { SalesMonthlyChart } from "../../../component/charts/SalesMonthlyChart";

export function SalesDashboard() {

    // Datos mock (después vienen del backend)
    const monthlyData = [
        { month: "Ene", total: 12000 },
        { month: "Feb", total: 18000 },
        { month: "Mar", total: 15000 },
        { month: "Abr", total: 22000 },
        { month: "May", total: 19000 },
        { month: "Jun", total: 25000 },
        { month: "Julio", total: 12000 },
        { month: "Agosto", total: 18000 },
        { month: "Septiembre", total: 15000 },
        { month: "Octubre", total: 22000 },
        { month: "Noviembre", total: 19000 },
        { month: "Diciembre", total: 25000 },
    ];

    return (
        <div className="space-y-8">
            <SalesMonthlyChart data={monthlyData} />
        </div>
    );
}