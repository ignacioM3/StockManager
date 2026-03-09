import type { InventoryWithWarehouse } from "../entities/Inventory.js";
import type { Product } from "../entities/Product.js";
import type { Tool } from "./base.js";

export interface QueryProductStockParams {
    productId?: string;
    sku?: string;
}

export interface QueryProductStockResult {
    product: Product;
    inventoryRecords: InventoryWithWarehouse[];
    totalQuantity: number;
}

export const queryProductStockTool: Tool<QueryProductStockParams, QueryProductStockResult> = {
    name: "query_product_stock",
    description:
        "Check the current stock/inventory level for a specific product across all warehouses. Use this when the user asks about stock levels, inventory, or product availability. Requires either productId or sku.",
    parameters: {
        type: 'object',
        properties: {
            productId: {
                type: "string",
                description: "The unique product identifier",
            },
            sku: {
                type: "string",
                description: "The Stock Keeping Unit (SKU) of the product",
            },
        },
        required: [],
    },

    async execute(params, databaseService) {
        console.log(params);
        const productId = params.productId || params.sku;
        console.log(
            `      📦 [query_product_stock] Checking stock for product: ${productId || "N/A"
            }`
        );

        if (!productId) {
            console.log(`      ❌ [query_product_stock] Missing product ID/SKU`);
            throw new Error("Product ID or SKU is required");
        }

        // Fetch product details
        const product = await databaseService.getProductByIdOrSku(productId);
        if (!product) {
            console.log(
                `      ❌ [query_product_stock] Product not found: ${productId}`
            );
            throw new Error(`Product with ID/SKU "${productId}" not found`);
        }
        console.log(
            `      📦 [query_product_stock] Product found: ${product.name} (ID: ${product.id})`
        );

        // Fetch inventory records for the product
        const inventoryRecords = await databaseService.getInventoryByProductId(
            product.id
        );

        console.log(
            `      📦 [query_product_stock] Found ${inventoryRecords.length} inventory record(s)`
        );

        // Aggregate total quantity across all warehouses
        const totalQuantity = inventoryRecords.reduce(
            (sum, inv) => sum + inv.quantity,
            0
        );

        console.log(
            `      📦 [query_product_stock] Total quantity: ${totalQuantity} units`
        );

        // Return raw data
        return {
            product,
            inventoryRecords,
            totalQuantity,
        };
    }
}