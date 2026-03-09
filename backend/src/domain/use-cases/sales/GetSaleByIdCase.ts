import type { SaleWithRelations } from "../../entities/Sale.js";
import { SaleNotFoundError } from "../../errors/SalesErrors.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";

export interface GetSaleByIdCaseInput {
    saleId: string;
}

export interface GetSaleByIdCaseOutput {
    sale: SaleWithRelations
}


export class GetSaleByIdUseCase {
  constructor(private db: IDatabaseService){}

  async execute(input: GetSaleByIdCaseInput): Promise<GetSaleByIdCaseOutput>{
    const sale = await this.db.getSaleById(input.saleId);

    if(!sale){
        throw new SaleNotFoundError()
    }
    return { sale };
  }
}