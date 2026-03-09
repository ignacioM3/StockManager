import type { Customer } from "../entities/Customer.js";
import type { Sale } from "../entities/Sale.js";
import type { Tool } from "./base.js";

export interface QueryCustomerDeliveriesParams {
    /** Date in ISO format (YYYY-MM-DD) */
    date: string;
}

export interface CustomerDelivery {
    customer: Customer;
    sales: Sale[];
    totalSales: number;
    totalRevenue: number;
}

export interface QueryCustomerDeliveriesResult {
    date: string;
    deliveries: CustomerDelivery[];
    summary: {
        totalCustomers: number;
        totalDeliveries: number;
    };
}

export const queryCustomerDeliveriesTool: Tool<QueryCustomerDeliveriesParams, QueryCustomerDeliveriesResult> = {
    name: "query_customer_deliveries",
    description:
        "Get all customer deliveries/sales for a specific date. Use this when the user asks about deliveries, shipments, or sales on a particular date.",
    parameters: {
        type: "object",
        properties: {
            date: {
                type: "string",
                description: "Date in ISO format (YYYY-MM-DD)",
            },
        },
        required: ["date"],
    },
    async execute(params, databaseService) {
        const dateStr = params.date;

        console.log(
            `      🚚 [query_customer_deliveries] Querying deliveries for date: ${dateStr}`
        );

        if (!dateStr) {
            console.log(
                `      ❌ [query_customer_deliveries] Missing date parameter`
            );
            throw new Error("Date is required to query customer deliveries");
        }

        const date = new Date(dateStr);

        if (isNaN(date.getTime())) {
            console.log(
                `      ❌ [query_customer_deliveries] Invalid date format: ${dateStr}`
            );
            throw new Error(
                `Invalid date format: ${dateStr}. Please use ISO format (YYYY-MM-DD)`
            );
        }

        const customerDeliveries =
            await databaseService.getCustomerDeliveriesByDate(date);

        if (customerDeliveries.length === 0) {
            console.log(
                `      ⚠️ [query_customer_deliveries] No deliveries found for ${date.toISOString()}`
            );
            throw new Error(`No deliveries found for ${date.toISOString()}`);
        }

        console.log(
            `      🚚 [query_customer_deliveries] Found ${customerDeliveries.length} customer(s) with deliveries`
        );

        const totalDeliveries = customerDeliveries.reduce(
            (sum, cd) => sum + cd.sales.length,
            0
        );
        console.log(
            `      🚚 [query_customer_deliveries] Total deliveries: ${totalDeliveries}`
        );

        const returnLog = {
            date: date.toISOString(),
            deliveries: customerDeliveries.map((cd) => ({
                customer: cd.customer,
                sales: cd.sales,
                totalSales: cd.sales.length,
                totalRevenue: cd.sales.reduce((sum, sale) => sale.amount, 0)
            })),
            summary: {
                totalCustomers: customerDeliveries.length,
                totalDeliveries,
            },
        }
        
        console.log(returnLog)

        return returnLog
    }
}