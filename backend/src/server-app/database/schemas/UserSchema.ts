import { EntitySchema } from "typeorm";
import type { User } from "../../../domain/entities/User.js";

export const UserSchema = new EntitySchema<User>({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: "uuid",
        },
        email: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "varchar",
        },
        name: {
            type: "varchar",
        },
        confirmed: {
            type: "boolean",
            default: false,
        },
        number: {
            type: "varchar",
            nullable: true,
        },
        blocked: {
            type: "boolean",
            default: false,
        },
        role: {
            type: "varchar",
        },
    },
});
