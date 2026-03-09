import type { Customer } from "../../entities/Customer.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";

export interface CreateCustomerInput{
    newCustomer : Omit<Customer, "id" | "isActive">
}

export interface CreateCustomerOutput{
    createdCustomer: Customer
}

export class CreateCustomerUseCase{
    constructor(private db: IDatabaseService){}

    async execute(input: CreateCustomerInput): Promise<CreateCustomerOutput>{
        
        const createdCustomer = await this.db.createCustomer(input.newCustomer);
        return { createdCustomer }
    }
}