import type { Customer } from "../../entities/Customer.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";


export interface GetAllCustomersInput {
  page: number;
  limit: number;
  isActive: boolean;
}

export interface GetAllCustomersOutput {
  customers: Customer[];
  total: number;
}

export class GetAllCustomersUseCase {
  constructor(private db: IDatabaseService) {}

  async execute(input: GetAllCustomersInput): Promise<GetAllCustomersOutput> {
    const skip = (input.page - 1) * input.limit;

    return this.db.getCustomerPaginated(
      skip,
      input.limit,
      input.isActive
    );
  }
}
