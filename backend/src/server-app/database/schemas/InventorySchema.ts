import { EntitySchema } from "typeorm";
import type { InventoryWithProduct, InventoryWithWarehouse } from "../../../domain/entities/Inventory.js";

export const InventorySchema = new EntitySchema<InventoryWithProduct & InventoryWithWarehouse>({
    name: 'Inventory',
    tableName: 'inventory',
    columns: {
        id: {
            type: "varchar",
            primary: true,
            generated: "uuid",
        },
        productId: {
            type: "varchar",
        },
        warehouseId: {
            type: "varchar",
        },
        quantity: {
            type: "integer",
        },
        lastRestocked: {
            type: "datetime",
        },
    },
    relations: {
        product: {
            type: 'many-to-one',
            target: 'Product',
            joinColumn: {
                name: 'productId'
            }
        },
        warehouse: {
            type: "many-to-one",
            target: "Warehouse",
            joinColumn: {
                name: "warehouseId",
            },
        },
    },
    indices: [
        {
            name: "IDX_INVENTORY_PRODUCT",
            columns: ["productId"],
        },
        {
            name: "IDX_INVENTORY_WAREHOUSE",
            columns: ["warehouseId"],
        },
    ]
})