import { EntitySchema } from "typeorm";
import type { Product } from "../../../domain/entities/Product.js";

export const ProductSchema = new EntitySchema<Product>({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      type: "varchar",
      primary: true,
      generated: "uuid",
    },
    sku: {
      type: "varchar",
      unique: true,
    },
    name: {
      type: "varchar",
    },
    category: {
      type: "varchar",
    },
    price: {
      type: "float",
    },
    description: {
      type: "text",
    },
  },
});
