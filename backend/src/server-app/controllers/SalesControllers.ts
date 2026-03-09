import { CreateSaleUseCase } from "../../domain/use-cases/sales/CreateSaleCase.js";
import { GetWeekendSalesUseCase } from "../../domain/use-cases/sales/GeSalesWeekendCase.js";
import { GetSaleByIdUseCase } from "../../domain/use-cases/sales/GetSaleByIdCase.js";
import { GetSalesByCustomerIdUseCase } from "../../domain/use-cases/sales/GetSalesByCustomerIdCase.js";
import { GetMonthlySalesUseCase } from "../../domain/use-cases/sales/GetSalesMonthly.js";
import { GetTodaySalesUseCase } from "../../domain/use-cases/sales/GetTodaySalesCase.js";
import type { DatabaseService } from "../services/DatabaseService.js";
import type { Request, Response } from "express";


export class SalesControllers{
    constructor(private db: DatabaseService) { }

    getTodaySalesCase = async (req: Request, res: Response) => {
        const useCase = new GetTodaySalesUseCase(this.db)

        const {total, sales, totalAmount, totalQuantity, averageAmount} = await useCase.execute();
        return res.status(200).json({total, sales, totalAmount, totalQuantity, averageAmount})
    }

    getWeekendSalesCase = async (req: Request, res: Response) => {
        const useCase = new GetWeekendSalesUseCase(this.db)

        const {total, sales, totalAmount, totalQuantity, averageAmount} = await useCase.execute();
        return res.status(200).json({total, sales, totalAmount, totalQuantity, averageAmount})
    }

    getMonthlySalesCase = async (req: Request, res: Response) => {
        const useCase = new GetMonthlySalesUseCase(this.db)
        const result = await useCase.execute();
        return res.status(200).json(result);
    }

    createSale = async (req: Request, res: Response) => {
    try {
      const { productId, customerId, quantity } = req.body;

      const useCase = new CreateSaleUseCase(this.db);

      const { createdSale } = await useCase.execute({
        productId,
        customerId,
        quantity,
      });

      return res.status(201).json({ sale: createdSale });
    } catch (error) {
      console.error("Error creating sale:", error);
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  };

  getSaleById = async (req: Request<{ saleId: string }>, res: Response) => {

    try {
      const { saleId } = req.params;
      const useCase = new GetSaleByIdUseCase(this.db);
      const sale = await useCase.execute({saleId});
      return res.status(200).json(sale );
    } catch (error) {
      console.error("Error fetching sale by ID:", error);
      return res.status(404).json({
        message: error instanceof Error ? error.message : "Sale not found",
      });
    }
  }

  getSalesByCustomerId = async (req: Request<{ customerId: string }>, res: Response) => {
    try {
      const { customerId } = req.params;
      const useCase = new GetSalesByCustomerIdUseCase(this.db);
      const sales = await useCase.execute({customerId});
      return res.status(200).json(sales);
    } catch (error) {
      console.error("Error fetching sales by customer ID:", error);
      return res.status(404).json({
        message: error instanceof Error ? error.message : "Sales not found",
      });
    }
  }
  
}