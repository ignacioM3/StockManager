import type { Tool } from "./base.js";
import type { Product } from "../entities/Product.js";


export interface QueryLongestStockedProductsParams {
  limit?: number;
}

export interface LongestStockedProduct {
  product: Product;
  lastRestocked: Date;
  quantity: number;
  warehouseId: string;
}

export interface QueryLongestStockedProductsResult {
  products: LongestStockedProduct[];
  limit: number;
}

export const queryLongestStockedProductsTool: Tool<
  QueryLongestStockedProductsParams,
  QueryLongestStockedProductsResult
> = {
  name: "query_longest_stocked_products",
  description:
    "Get products that have been in stock the longest without being restocked. Use this when the user asks about old stock, stale inventory, or products that need attention.",

  parameters: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of products to return (default: 10)",
      },
    },
    required: [],
  },

  async execute(params, databaseService) {
    const limit = params.limit || 10;

    console.log(
      `      📊 [query_longest_stocked_products] Finding top ${limit} oldest stock items...`
    );

    const inventoryWithProduct =
      await databaseService.getProductsWithOldestStock(limit);

    if (inventoryWithProduct.length === 0) {
      console.log(
        `      ❌ [query_longest_stocked_products] No products with stock found`
      );
      throw new Error("No products found with stock information");
    }

    console.log(
      `      📊 [query_longest_stocked_products] Found ${inventoryWithProduct.length} product(s)`
    );
    if (inventoryWithProduct.length > 0) {
      const oldest = inventoryWithProduct[0];
      if (oldest) {
        console.log(
          `      📊 [query_longest_stocked_products] Oldest: ${
            oldest.product.name
          } (${oldest.lastRestocked.toISOString()})`
        );
      }
    }

    return {
      products: inventoryWithProduct.map((item) => ({
        product: item.product,
        lastRestocked: item.lastRestocked,
        quantity: item.quantity,
        warehouseId: item.warehouseId,
      })),
      limit,
    };
  },
};
