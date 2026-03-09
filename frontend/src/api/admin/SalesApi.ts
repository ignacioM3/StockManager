import { isAxiosError } from "axios";
import type { SaleWithRelations } from "../../types/Sales";
import api from "../../lib/axios";

interface SalesResponse {
    total: number;
    sales: SaleWithRelations[];
    totalAmount: number;
    totalQuantity: number;
    averageAmount: number;
}

export async function getTodaySales(): Promise<SalesResponse> {
    try {
        const url = `/admin/sales/today`;
        const { data } = await api.get<SalesResponse>(url);
        console.log(data);

        const { total, sales, totalAmount, totalQuantity, averageAmount } = data
        return { total, sales, totalAmount, totalQuantity, averageAmount };
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error)
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Unexpected error occurred");
        }
    }
}

export async function getWeekendSales(): Promise<SalesResponse> {
    try {
        const url = `/admin/sales/weekend`;
        const { data } = await api.get<SalesResponse>(url);
        console.log(data);

        const { total, sales, totalAmount, totalQuantity, averageAmount } = data
        return { total, sales, totalAmount, totalQuantity, averageAmount };
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error)
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Unexpected error occurred");
        }
    }
}

export async function getMonthlySales(): Promise<SalesResponse> {
    try {
        const url = `/admin/sales/monthly`;
        const { data } = await api.get<SalesResponse>(url);
        console.log(data);

        const { total, sales, totalAmount, totalQuantity, averageAmount } = data
        return { total, sales, totalAmount, totalQuantity, averageAmount };
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error)
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Unexpected error occurred");
        }
    }
}