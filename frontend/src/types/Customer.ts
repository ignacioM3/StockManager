import z from "zod";

export const customerSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    location: z.string(),
    isActive: z.boolean()
})


export type Customer = z.infer<typeof customerSchema>;
export type GetAllCustomer = Customer
export type CustomerListType = Customer
export type CreateCustomerData = Omit<Customer, "id" | "isActive">
export type UpdateCustomerData = Omit<Customer, "isActive" | "id">