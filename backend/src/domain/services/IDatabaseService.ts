import type { Customer } from "../entities/Customer.js";
import type { InventoryWithProduct, InventoryWithWarehouse } from "../entities/Inventory.js";
import type { Product } from "../entities/Product.js";
import type { Sale, SaleWithRelations } from "../entities/Sale.js";
import type { UserRole } from "../entities/User-Role.js";
import type { User } from "../entities/User.js";

export interface IDatabaseService {
    getProductById(id: string): Promise<Product | null>;
    getProductByIdOrSku(idOrSku: string): Promise<Product | null>;
    getAllProducts(): Promise<Product[]>;
    getProductsWithOldestStock(limit: number): Promise<InventoryWithProduct[]>;

    getInventoryByProductId(productId: string): Promise<InventoryWithWarehouse[]>;

    getUserById(id: string): Promise<User | null>;
    deleteUserById(id: string): Promise<void>;
    getAllUser(): Promise<User[]>;
    getUserByEmail(email: string): Promise<User | null>
    getUserForAuth(id: string): Promise<Pick<User, "id" | "name" | "email" | "role" | "blocked"> | null>
    getAllUsersByRole(role: UserRole): Promise<User[]>;
    getUsersByRolePaginated(role: UserRole, skip: number, limit: number): Promise<{ users: User[]; total: number }>

    getTodaySales(): Promise<SaleWithRelations[]>;
    getSalesByDate(date: Date): Promise<SaleWithRelations[]>;
    getSalesByDateRange(startDate: Date, endDate: Date): Promise<SaleWithRelations[]>;
    createSale(data: Omit<Sale, "id">): Promise<SaleWithRelations>;
    getSaleById(id: string): Promise<SaleWithRelations | null>;
    getSalesByCustomerId(customerId: string, startDate?: Date, endDate?: Date): Promise<SaleWithRelations[]>;
    getSalesSummaryByCustomerId(customerId: string, startDate?: Date, endDate?: Date): Promise<{ totalTransactions: number; totalRevenue: number; totalUnits: number }>;
    getCustomersByEmail(email: string): Promise<Customer[]>;

    getCustomerById(id: string): Promise<Customer | null>;
    getCustomerDeliveriesByDate(date: Date): Promise<Array<{ customer: Customer; sales: Sale[] }>>;
    getAllCustomer(): Promise<Customer[]>;
    getCustomerPaginated(skip: number, limit: number, isActive: boolean): Promise<{ customers: Customer[]; total: number }>
    updateCustomer(id: string, data: Partial<Customer>): Promise<Customer>;
    deleteCustomerById(id: string): Promise<void>;
    disableCustomerById(id: string): Promise<void>;
    createCustomer(data: Omit<Customer, "id" | "isActive">): Promise<Customer>;
    getCustomersByName(name: string): Promise<Customer[]>;


    getMonthlyRevenue(year: number, month: number): Promise<number>;
}