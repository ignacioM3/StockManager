import type { Tool } from "./base.js";


export interface QueryMonthlyProfitabilityParams {
    year: number;
    month: number;
}

export interface QueryMonthlyProfitabilityResult {
    year: number;
    month: number;
    monthName: string;
    revenue: number;
    profit: number;
    profitMargin: number;
}

export const queryMonthlyProfitabilityTool: Tool<QueryMonthlyProfitabilityParams, QueryMonthlyProfitabilityResult> = {
    name: "query_monthly_query_monthly_profitability",
    description: "Calculate revenue and profitability for a specific month. Use this when the user asks about monthly revenue, sales totals, or profitability for a given month.",
    parameters: {
        type: "object",
        properties: {
            year: {
                type: "number",
                description: "Year (e.g., 2025)",
            },
            month: {
                type: "number",
                description: "Month number (1-12)",
            },
        },
        required: ["year", "month"],
    },
    async execute(params, databaseService) {
        const year = params.year;
        const month = params.month;

        console.log(
            `      💰 [query_monthly_profitability] Calculating profitability for ${year}-${month}`
        );


        if (!year || !month) {
            console.log(
                `      ❌ [query_monthly_profitability] Missing year or month parameter`
            );
            throw new Error(
                "Both year and month are required to query profitability"
            );
        }

        if (month < 1 || month > 12) {
            console.log(
                `      ❌ [query_monthly_profitability] Invalid month: ${month}`
            );
            throw new Error(
                `Invalid month: ${month}. Month must be between 1 and 12`
            );
        }

        const revenue = await databaseService.getMonthlyRevenue(year, month);

        console.log(
            `      💰 [query_monthly_profitability] Revenue: $${revenue.toFixed(2)}`
        );

        // Calculate profitability (assume 30% margin for demo)
        const profitMargin = 0.3;
        const profit = revenue * profitMargin;


        console.log(
            `      💰 [query_monthly_profitability] Profit (${profitMargin * 100
            }% margin): $${profit.toFixed(2)}`
        );

        // Month names
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const monthName = monthNames[month - 1] || "Unknown";

        // Return raw data
        return {
            year,
            month,
            monthName,
            revenue,
            profit,
            profitMargin,
        };
    }
}