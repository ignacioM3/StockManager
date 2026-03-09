import { EntitySchema } from "typeorm";
import type { SaleWithRelations } from "../../../domain/entities/Sale.js";

export const SaleSchema = new EntitySchema<SaleWithRelations>({
  name: "Sale",
  tableName: "sales",
  columns: {
    id: {
      type: "varchar",
      primary: true,
      generated: "uuid",
    },
    productId: {
      type: "varchar",
    },
    customerId: {
      type: "varchar",
    },
    quantity: {
      type: "integer",
    },
    amount: {
      type: "float",
    },
    soldAt: {
      type: "datetime",
    },
  },
  relations: {
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: {
        name: "productId",
      },
    },
    customer: {
      type: "many-to-one",
      target: "Customer",
      joinColumn: {
        name: "customerId",
      },
    },
  },
  indices: [
    {
      name: "IDX_SALE_PRODUCT",
      columns: ["productId"],
    },
    {
      name: "IDX_SALE_CUSTOMER",
      columns: ["customerId"],
    },
    {
      name: "IDX_SALE_SOLD_AT",
      columns: ["soldAt"],
    },
  ],
});
