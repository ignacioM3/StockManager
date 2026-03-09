import type { Customer } from "../../entities/Customer.js";
import { RequiredIDError } from "../../errors/CustomerErrors.js";

export interface UpdateCustomerInput {
    updateData: Partial<Customer>
}

export interface UpdateCustomerOutput {
    updatedCustomer: Customer

}

export class UpdateCustomerUseCase {
    constructor(private db: any) { }

    async execute(customerId: string, input: UpdateCustomerInput): Promise<UpdateCustomerOutput> {
        if (!customerId) {
            throw new RequiredIDError()
        }
        const updatedCustomer = await this.db.updateCustomer(customerId, input.updateData)

        return { updatedCustomer }
    }

}