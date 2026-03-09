import type { SaleWithRelations } from "../../entities/Sale.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";

export interface GetSalesByCustomerIdInput{
    customerId: string;
}

export interface GetSalesByCustomerIdOutput{
    sales: SaleWithRelations[];
}

 export class GetSalesByCustomerIdUseCase {
    constructor(private db: IDatabaseService){}
    async execute(input: GetSalesByCustomerIdInput): Promise<GetSalesByCustomerIdOutput>{
        const sales = await this.db.getSalesByCustomerId(input.customerId);
        return { sales };
    }

 }