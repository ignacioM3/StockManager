import z from "zod";
import type { Customer } from "./Customer";

export const salesSchema = z.object({
    id: z.string(),
    productId: z.string(),
    customerId: z.string(),
    quantity: z.number().min(1),
    amount: z.number().min(0),
    soldAt: z.date()
})

export type Sale = z.infer<typeof salesSchema>;

export type SaleWithRelations = Sale & {
    product: {
        id: string;
        name: string;
        sku: string;
        category: string;
        price: number;
        description: string;
    };
    customer: Customer
}

export type CreateSaleData = Omit<Sale, "id" | "soldAt">;