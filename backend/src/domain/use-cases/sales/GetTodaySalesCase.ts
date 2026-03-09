import type { SaleWithRelations } from "../../entities/Sale.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";

export interface GetTodaySalesCaseOutput {
    total: number;
    sales: SaleWithRelations[];
    totalAmount: number;
    totalQuantity: number;
    averageAmount: number;
}


export class GetTodaySalesUseCase {
    constructor(private db: IDatabaseService){}

    async execute(): Promise<GetTodaySalesCaseOutput> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const sales = await this.db.getSalesByDateRange(today, tomorrow);
        const metrics = sales.reduce((acc, sale) =>{
            acc.totalAmount += sale.amount;
            acc.totalQuantity += sale.quantity;
            return acc;
        }, { totalAmount: 0, totalQuantity: 0 });
        const averageAmount = sales.length > 0 ? metrics.totalAmount / sales.length : 0;
        return {
            total: sales.length,
            totalAmount: metrics.totalAmount,
            totalQuantity: metrics.totalQuantity,
            averageAmount,
            sales
        };
    }
}