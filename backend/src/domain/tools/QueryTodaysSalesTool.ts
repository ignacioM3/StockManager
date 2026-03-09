import type { SaleWithRelations } from "../entities/Sale.js";
import type { Tool } from "./base.js";

export interface QueryTodaysSalesParams {

}

export interface QueryTodaysSalesResult {
    sales: SaleWithRelations[];
    summary: {
        totalTransactions: number;
        totalRevenue: number;
        date: string;
    }
}

export const queryTodaysSalesTool: Tool<
    QueryTodaysSalesParams,
    QueryTodaysSalesResult
> = {
    name: "query_todays_sales",
    description: "Get all sales transactions that occurred today, including revenue totals. Use this when the user asks about today's sales, revenue, or transactions.",
    parameters: {
        type: "object",
        properties: {},
        required: []
    },

    async execute(params, dataBaseService) {
        console.log(`📅 [query_todays_sales] Querying today's sales...`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log(
            `📅 [query_todays_sales] Target date: ${today.toISOString()}`
        );

        const sales = await dataBaseService.getSalesByDate(today);

        console.log(`📅 [query_todays_sales] Found ${sales.length} sales`);

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0)

        console.log(
            `📅 [query_todays_sales] Total revenue: $${totalRevenue.toFixed(2)}`
        );

        return {
            sales,
            summary: {
                totalTransactions: sales.length,
                totalRevenue,
                date: today.toISOString()
            }
        }
    }
}