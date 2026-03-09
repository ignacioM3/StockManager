import type { SaleWithRelations } from "../entities/Sale.js";
import type { Tool } from "./base.js";

export interface QuerySalesByCustomerParams {
  customerId?: string;
  email?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface QuerySalesByCustomerResult {
  customer?: {
    id: string;
    name: string;
    email: string;
  };

  sales?: SaleWithRelations[];

  summary?: {
    totalTransactions: number;
    totalRevenue: number;
    totalUnits: number;
  };

  // Para manejo de errores estructurados
  error?: string;

  // Para ambigüedad de nombres
  matches?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export const querySalesByCustomerTool: Tool<
  QuerySalesByCustomerParams,
  QuerySalesByCustomerResult
> = {
  name: "query_sales_by_customer",

  description:
    "Retrieve sales history and revenue summary for a specific customer. " +
    "Use when the user asks how much a customer bought, their total spending, " +
    "number of transactions, or purchase history. " +
    "Customer can be identified by name, email, or customerId.",

  parameters: {
    type: "object",
    properties: {
      customerId: {
        type: "string",
        description: "Unique customer identifier"
      },
      email: {
        type: "string",
        description: "Customer email address"
      },
      name: {
        type: "string",
        description: "Full or partial customer name"
      },
      startDate: {
        type: "string",
        description: "Start date (ISO format: YYYY-MM-DD)"
      },
      endDate: {
        type: "string",
        description: "End date (ISO format: YYYY-MM-DD)"
      }
    }
  },

  async execute(
    params: QuerySalesByCustomerParams,
    databaseService
  ): Promise<QuerySalesByCustomerResult> {

    console.log("👤 [query_sales_by_customer] Starting execution");
    console.log("📥 Params:", JSON.stringify(params));

    let customerId = params.customerId;

    if (!customerId && params.name) {
      const matches = await databaseService.getCustomersByName(params.name);

      if (matches.length === 0) {
        throw new Error(`No customer found with name "${params.name}".`)
      }

      if (matches.length > 1) {
        return {
          error: "Multiple customers found with that name.",
          matches: matches.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email
          }))
        };
      }

      const [customer] = matches;

      if (!customer) {
        throw new Error(`No customer found with name "${params.name}".`);
      }

      customerId = customer.id;
    }

    if (!customerId && params.email) {
      const matches = await databaseService.getCustomersByEmail(params.email);

      if (matches.length === 0) {
        return {
          error: `No customer found with email "${params.email}".`
        };
      }
      const [customer] = matches;
      if (!customer) {
        return {
          error: `No customer found with email "${params.email}".`
        };
      }
      customerId = customer.id;
    }

    if (!customerId) {
      return {
        error: "You must provide customerId, email, or name."
      };
    }

    const startDate = params.startDate
      ? new Date(params.startDate)
      : undefined;

    const endDate = params.endDate
      ? new Date(params.endDate)
      : undefined;

    console.log("📅 Date filters:", startDate, endDate);

    const [sales, summary] = await Promise.all([
      databaseService.getSalesByCustomerId(
        customerId,
        startDate,
        endDate
      ),
      databaseService.getSalesSummaryByCustomerId(
        customerId,
        startDate,
        endDate
      )
    ]);

    if (sales.length === 0) {
      return {
        error: "Customer found but no sales in the specified period."
      };
    }

      const [customer] = sales;
      if (!customer) {
        return {
          error: `No customer found with email "${params.email}".`
        };
      }
      customerId = customer.id;

    console.log(
      `✅ Found ${summary.totalTransactions} transactions, revenue: ${summary.totalRevenue}`
    );

    return {
      customer: {
        id: customer.customer.id,
        name: customer.customer.name,
        email: customer.customer.email
      },
      sales,
      summary
    };
  }
};