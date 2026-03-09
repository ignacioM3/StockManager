import { DataSource } from "typeorm";
import { ProductSchema } from "./schemas/ProductSchema.js";
import { SaleSchema } from "./schemas/SaleSchema.js";
import { WarehouseSchema } from "./schemas/WarehouseSchema.js";
import { InventorySchema } from "./schemas/InventorySchema.js";
import { CustomerSchema } from "./schemas/CustomerSchema.js";
import { UserSchema } from "./schemas/UserSchema.js";


export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: process.env.DB_PATH || './stock-demo.db',
    synchronize: true,
    logging: false,
    entities: [
        ProductSchema,
        SaleSchema,
        WarehouseSchema,
        InventorySchema,
        CustomerSchema,
        UserSchema
    ]
})


export async function InitializeDatabase(): Promise<void> {
    try {
        if(!AppDataSource.isInitialized){
            await AppDataSource.initialize();
             console.log("✅ Database connection established successfully");
        }
    } catch (error) {
        console.error("❌ Error initializing database:", error);
        throw new Error(
            `Failed to initialize database: ${error instanceof Error ? error.message : String(error)
            }`
        );
    }
}