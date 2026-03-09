import type { SaleWithRelations } from "../../entities/Sale.js";
import { CustomerNotFoundError } from "../../errors/CustomerErrors.js";
import { ProductNotFoundError } from "../../errors/ProductErrors.js";
import { RequiredQuantityError } from "../../errors/SalesErrors.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";

export interface CreateSaleInput {
  productId: string;
  customerId: string;
  quantity: number;
  date?: Date
}

export interface CreateSaleOutput {
  createdSale: SaleWithRelations;
}

export class CreateSaleUseCase {

  constructor(private db: IDatabaseService) {}

  async execute(input: CreateSaleInput): Promise<CreateSaleOutput> {

    if (input.quantity <= 0) {
      throw new RequiredQuantityError()
    }

    const product = await this.db.getProductById(input.productId);

    if (!product) {
      throw new ProductNotFoundError()
    }

    const customer = await this.db.getCustomerById(input.customerId);

    if (!customer) {
      throw new CustomerNotFoundError()
    }
    const amount = product.price * input.quantity;

    const sale = await this.db.createSale({
      productId: input.productId,
      customerId: input.customerId,
      quantity: input.quantity,
      amount,
      soldAt: input.date || new Date()
    });

    return {
      createdSale: {
        ...sale,
        product,
        customer
      }
    };
  }
}