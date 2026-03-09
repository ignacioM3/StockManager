import { EntitySchema } from "typeorm";
import type { Customer } from "../../../domain/index.js";

export const CustomerSchema = new EntitySchema<Customer>({
    name: 'Customer',
    tableName: "customers",
    columns: {
        id: {
            type: 'varchar',
            primary: true,
            generated: 'uuid'
        },
        name: {
            type: 'varchar'
        },
        email: {
            type: 'varchar'
        },
        location: {
            type: 'varchar'
        },
        isActive: {
            type: 'boolean',
            default: true
        }
    }
})