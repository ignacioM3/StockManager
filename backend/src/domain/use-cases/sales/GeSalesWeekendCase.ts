import type { SaleWithRelations } from "../../entities/Sale.js";
import type { IDatabaseService } from "../../services/IDatabaseService.js";

export interface GetWeekendSalesCaseOutput {
    total: number;
    sales: SaleWithRelations[];
    totalAmount: number;
    totalQuantity: number;
    averageAmount: number;
}


export class GetWeekendSalesUseCase {
    constructor(private db: IDatabaseService){}

    async execute(): Promise<GetWeekendSalesCaseOutput> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = today.getDay(); 

    const monday = new Date(today);
    const diffToMonday = day === 0 ? -6 : 1 - day;
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const sales = await this.db.getSalesByDateRange(monday, sunday);

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
        totalAmount: metrics.totalAmount,
        totalQuantity: metrics.totalQuantity,
        averageAmount,
        sales
    };
}
}