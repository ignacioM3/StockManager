import type { Customer } from "../../entities/Customer.js";

export interface GetCustomerByIdInput {
    customerId?: string;
}

export interface GetCustomerByIdOutput{
    customer: Customer
}

export class GetCustomerByIdUseCase {
    constructor(private readonly db: any) {}

    async execute(input: GetCustomerByIdInput): Promise<GetCustomerByIdOutput> {
        const { customerId } = input;

        if (!customerId) {
            throw new Error("Customer ID is required");
        }

        const customer = await this.db.getCustomerById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        return { customer };
    }
}