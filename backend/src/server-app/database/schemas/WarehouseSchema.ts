import { EntitySchema } from "typeorm";
import type { Warehouse } from "../../../domain/index.js";

export const WarehouseSchema = new EntitySchema<Warehouse>({
    name: 'Warehouse',
    tableName: 'warehouses',
    columns: {
        id: {
            type: "varchar",
            primary: true,
            generated: "uuid",
        },
        name: {
            type: "varchar",
        },
        location: {
            type: "varchar",
        }
    }
})