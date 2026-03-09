import type { Customer } from "../../domain/entities/Customer.js";
import { CreateCustomerUseCase } from "../../domain/use-cases/customer/CreateCustomerCase.js";
import { DisableCustomerUseCase } from "../../domain/use-cases/customer/disableCustomerCase.js";
import { GetAllCustomersUseCase } from "../../domain/use-cases/customer/getAllCustomerCase.js";
import { GetCustomerByIdUseCase } from "../../domain/use-cases/customer/getCustomerByIdCase.js";
import { UpdateCustomerUseCase } from "../../domain/use-cases/customer/updateCustomerCase.js";
import type { DatabaseService } from "../services/DatabaseService.js";
import type { Request, Response } from "express";



export class CustomerController {
    constructor(private db: DatabaseService) { }
    getAllCustomerEnabled = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 6

        const isActive = true

        const useCases = new GetAllCustomersUseCase(this.db);
        const { customers, total } = await useCases.execute({ page, limit, isActive });

        res.status(200).json({
            customers,
            total
        })
    }


    disableCustomer = async (req: Request<{ customerId: string }>, res: Response) => {
        const { customerId } = req.params;

        const useCase = new DisableCustomerUseCase(this.db);

        await useCase.execute({ customerId });

        res.send("Cliente deshabilitado con exito")
    }

    getCustomerById = async (req: Request<{ customerId: string }>, res: Response) => {
        const { customerId } = req.params
        const useCase = new GetCustomerByIdUseCase(this.db);

        const findCustomer = await useCase.execute({customerId})

        res.status(200).json(findCustomer)

    }

    updateCustomer = async (req: Request<{ customerId: string }, any, Partial<Customer>>, res: Response) => {
        const { customerId } = req.params
        const useCase = new UpdateCustomerUseCase(this.db);

        const customerUpdated = await useCase.execute(customerId, { updateData: req.body })
        res.status(200).json(customerUpdated)
    }

    createCustomer = async (req: Request<any, any, Omit<Customer, "id" | "isActive">>, res: Response) => {

        const useCase = new CreateCustomerUseCase(this.db);
        const newCustomer = await useCase.execute({ newCustomer: req.body });

        return res.status(201).json(newCustomer)
    }
}