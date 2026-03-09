import { CustomerNotFoundError } from "../../errors/CustomerErrors.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";


export interface DisableCustomerInput {
  customerId?: string;
}

export class DisableCustomerUseCase {
  constructor(private readonly db: IDatabaseService) {}

  async execute(input: DisableCustomerInput): Promise<void> {
    const { customerId } = input;

    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    const customer = await this.db.getCustomerById(customerId);

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    await this.db.disableCustomerById(customerId);
  }
}
