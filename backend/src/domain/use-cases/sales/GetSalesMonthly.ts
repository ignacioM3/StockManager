import type { SaleWithRelations } from "../../entities/Sale.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";

export interface GetMonthlySalesCaseOutput {
    total: number;
    sales: SaleWithRelations[];
    totalAmount: number;
    totalQuantity: number;
    averageAmount: number;
}

export class GetMonthlySalesUseCase {
    constructor(private db: IDatabaseService){}
    async execute(): Promise<GetMonthlySalesCaseOutput> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const sales = await this.db.getSalesByDateRange(firstDayOfMonth, lastDayOfMonth);
        
    const metrics = sales.reduce((acc, sale) => {
        acc.totalAmount += sale.amount;
        acc.totalQuantity += sale.quantity;
        return acc;
    }, { totalAmount: 0, totalQuantity: 0 });
    
    const averageAmount = sales.length > 0
        ? metrics.totalAmount / sales.length
        : 0;

    return {
        total: sales.length,
        sales,
        totalAmount: metrics.totalAmount,
        totalQuantity: metrics.totalQuantity,
        averageAmount
    };
}}
