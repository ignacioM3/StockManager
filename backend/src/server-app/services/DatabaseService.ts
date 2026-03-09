import { Between, type DataSource, type Repository } from "typeorm";
import type { Customer, IDatabaseService, Inventory, Product, Sale } from "../../domain/index.js";
import { ProductSchema } from "../database/schemas/ProductSchema.js";
import { CustomerSchema } from "../database/schemas/CustomerSchema.js";
import { InventorySchema } from "../database/schemas/InventorySchema.js";
import { SaleSchema } from "../database/schemas/SaleSchema.js";
import type { InventoryWithProduct, InventoryWithWarehouse } from "../../domain/entities/Inventory.js";
import type { SaleWithRelations } from "../../domain/entities/Sale.js";
import type { User } from "../../domain/entities/User.js";
import { UserSchema } from "../database/schemas/UserSchema.js";
import type { UserRole } from "../database/schemas/UserRole.js";
import { ProductNotFoundError } from "../../domain/errors/ProductErrors.js";
import { CustomerNotFoundError } from "../../domain/errors/CustomerErrors.js";

/* Implementación de IDatabaseService usando typeorm */
export class DatabaseService implements IDatabaseService {
    private productRepository: Repository<Product>;
    private inventoryRepository: Repository<Inventory>;
    private saleRepository: Repository<Sale>;
    private customerRepository: Repository<Customer>;
    private userRepository: Repository<User>


    constructor(dataSource: DataSource) {
        this.productRepository = dataSource.getRepository(ProductSchema);
        this.customerRepository = dataSource.getRepository(CustomerSchema);
        this.inventoryRepository = dataSource.getRepository(InventorySchema);
        this.saleRepository = dataSource.getRepository(SaleSchema);
        this.userRepository = dataSource.getRepository(UserSchema)
    }

    async getProductById(id: string): Promise<Product | null> {
        try {
            const product = await this.productRepository.findOne({
                where: { id }
            })
            return product
        } catch (error) {
            console.error(`Error fetching product by ID ${id}:`, error);
            throw new Error(
                `Failed to fetch product: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getProductByIdOrSku(idOrSku: string): Promise<Product | null> {
        try {
            const product = await this.productRepository.findOne({
                where: [
                    { id: idOrSku },
                    { sku: idOrSku }
                ]
            });

            return product;
        } catch (error) {
            console.error(`Error fetching product by ID or SKU ${idOrSku}:`, error);
            throw new Error(
                `Failed to fetch product: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async deleteUserById(id: string): Promise<void> {
        try {
            const user = await this.userRepository.findOne({
                where: { id }
            });

            if (!user) {
                throw new Error("User not found");
            }

            await this.userRepository.remove(user);

        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
            throw new Error(
                `Failed to delete user: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }


    async getAllProducts(): Promise<Product[]> {
        try {
            const products = await this.productRepository.find({
                order: { name: 'ASC' }
            });
            return products;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw new Error(
                `Failed to fetch products: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async getInventoryByProductId(productId: string): Promise<InventoryWithWarehouse[]> {
        try {
            const inventories = (await this.inventoryRepository.find({
                where: { productId },
                relations: ['warehouse']
            })) as InventoryWithWarehouse[];
            return inventories;
        } catch (error) {
            console.error(
                `Error fetching inventory for product ${productId}:`,
                error
            );
            throw new Error(
                `Failed to fetch inventory: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getSalesByDateRange(startDate: Date, endDate: Date): Promise<SaleWithRelations[]> {
        try {
            const sales = (await this.saleRepository.find({
                where: {
                    soldAt: Between(startDate, endDate)
                },
                relations: ['product', 'customer'],
                order: { soldAt: 'ASC' }
            })) as SaleWithRelations[];
            return sales;
        } catch (error) {
            console.error(
                `Error fetching sales for date range ${startDate} to ${endDate}:`,
                error
            );
            throw new Error(
                `Failed to fetch sales: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getSalesByDate(date: Date): Promise<SaleWithRelations[]> {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            return await this.getSalesByDateRange(startOfDay, endOfDay);
        } catch (error) {
            console.error(`Error fetching sales for date ${date}:`, error);
            throw new Error(
                `Failed to fetch sales for date: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getTodaySales(): Promise<SaleWithRelations[]> {
        try {
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);

            return await this.getSalesByDateRange(startOfDay, endOfDay);
        } catch (error) {
            console.error(`Error fetching today's sales:`, error);
            throw new Error(
                `Failed to fetch today's sales: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async createSale(data: Omit<Sale, "id">): Promise<SaleWithRelations> {
        try {

            return await this.saleRepository.manager.transaction(async (manager) => {

                const productRepo = manager.getRepository(ProductSchema);
                const inventoryRepo = manager.getRepository(InventorySchema);
                const saleRepo = manager.getRepository(SaleSchema);
                const customerRepo = manager.getRepository(CustomerSchema);

                const product = await productRepo.findOne({
                    where: { id: data.productId }
                });

                if (!product) {
                    throw new ProductNotFoundError()
                }

                const customer = await customerRepo.findOne({
                    where: { id: data.customerId }
                });

                if (!customer) {
                    throw new CustomerNotFoundError()
                }

                const inventories = await inventoryRepo.find({
                    where: { productId: data.productId }
                });

                const totalStock = inventories.reduce(
                    (acc, inv) => acc + inv.quantity,
                    0
                );

                if (totalStock < data.quantity) {
                    throw new Error("Insufficient stock");
                }

                let remaining = data.quantity;

                for (const inv of inventories) {
                    if (remaining <= 0) break;

                    const discount = Math.min(inv.quantity, remaining);
                    inv.quantity -= discount;
                    remaining -= discount;

                    await inventoryRepo.save(inv);
                }

                const sale = saleRepo.create({
                    ...data
                });

                const savedSale = await saleRepo.save(sale);

                return {
                    ...savedSale,
                    product,
                    customer
                } as SaleWithRelations;
            });

        } catch (error) {
            console.error(`Error creating sale:`, error);
            throw new Error(
                `Failed to create sale: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    getSaleById(id: string): Promise<SaleWithRelations | null> {
      try {
          return this.saleRepository.findOne({
            where: { id },
            relations: ['product', 'customer']
        }) as Promise<SaleWithRelations | null>;
      } catch (error) {
            console.error(`Error fetching sale by ID ${id}:`, error);
            throw new Error(
                `Failed to fetch sale: ${error instanceof Error ? error.message : String(error)
                }`
            );
      }
    }

    getSalesByCustomerId(customerId: string): Promise<SaleWithRelations[]> {
        try {
            const sales = this.saleRepository.find({
                where: { customerId },
                relations: ['product', 'customer'],
                order: { soldAt: 'ASC' }
             }) as Promise<SaleWithRelations[]>;
             return sales;
            
        } catch (error) {
             console.error(`Error fetching sales by customer ID ${customerId}:`, error);
            throw new Error(
                `Failed to fetch sale: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getCustomerById(id: string): Promise<Customer | null> {
        try {
            const customer = await this.customerRepository.findOne({
                where: { id },
            });
            return customer;
        } catch (error) {
            console.error(`Error fetching customer by ID ${id}:`, error);
            throw new Error(
                `Failed to fetch customer: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getCustomersByName(name: string): Promise<Customer[]> {
        try {
            const customers = await this.customerRepository.find({
                where: { name }
            });
            return customers;
        } catch (error) {
            console.error(`Error fetching customers by name ${name}:`, error);
            throw new Error(
                `Failed to fetch customers by name: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    async getCustomersByEmail(email: string): Promise<Customer[]> {
        try {
            const customers = await this.customerRepository.find({
                where: { email }
            });
            return customers;
        } catch (error) {
            console.error(`Error fetching customers by email ${email}:`, error);
            throw new Error(
                `Failed to fetch customers by email: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    async getSalesSummaryByCustomerId(customerId: string, startDate?: Date, endDate?: Date): Promise<{ totalTransactions: number; totalRevenue: number; totalUnits: number; }> {
        try {
            const query = this.saleRepository.createQueryBuilder("sale")
                .select([
                    "COUNT(sale.id) as totalTransactions",
                    "SUM(sale.amount) as totalRevenue",
                    "SUM(sale.quantity) as totalUnits"
                ])
                .where("sale.customerId = :customerId", { customerId });

            if (startDate) {
                query.andWhere("sale.soldAt >= :startDate", { startDate });
            }

            if (endDate) {
                query.andWhere("sale.soldAt <= :endDate", { endDate });
            }

            const result = await query.getRawOne();

            return {
                totalTransactions: result.totalTransactions || 0,
                totalRevenue: result.totalRevenue || 0,
                totalUnits: result.totalUnits || 0
            };
        } catch (error) {
            console.error(`Error fetching sales summary for customer ID ${customerId}:`, error);
            throw new Error(
                `Failed to fetch sales summary: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    async getProductsWithOldestStock(
        limit: number
    ): Promise<InventoryWithProduct[]> {
        try {
            const inventories = (await this.inventoryRepository.find({
                relations: ["product"],
                order: { lastRestocked: "ASC" },
                take: limit,
            })) as InventoryWithProduct[];

            return inventories.filter((inventory) => inventory.product !== undefined);
        } catch (error) {
            console.error("Error fetching products with oldest stock:", error);
            throw new Error(
                `Failed to fetch oldest stock products: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async getMonthlyRevenue(year: number, month: number): Promise<number> {
        try {
            const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);

            const sales = await this.getSalesByDateRange(startDate, endDate);

            const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);

            return totalRevenue;
        } catch (error) {
            console.error(
                `Error calculating monthly revenue for ${year}-${month}:`,
                error
            );
            throw new Error(
                `Failed to calculate monthly revenue: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getCustomerDeliveriesByDate(
        date: Date
    ): Promise<Array<{ customer: Customer; sales: Sale[] }>> {
        try {
            const sales = await this.getSalesByDate(date);

            // Group sales by customer
            const customerSalesMap = new Map<string, SaleWithRelations[]>();

            for (const sale of sales) {
                const customerId = sale.customerId;
                if (!customerSalesMap.has(customerId)) {
                    customerSalesMap.set(customerId, []);
                }
                customerSalesMap.get(customerId)!.push(sale);
            }

            // Build result array with customer objects
            const result: Array<{ customer: Customer; sales: Sale[] }> = [];

            for (const [customerId, customerSales] of customerSalesMap.entries()) {
                // Get customer object (it should be in relations from getSalesByDate)
                let customer: Customer | null = null;
                if (customerSales.length > 0 && customerSales[0]?.customer) {
                    customer = customerSales[0].customer;
                } else {
                    customer = await this.getCustomerById(customerId);
                }

                if (customer) {
                    result.push({
                        customer,
                        sales: customerSales,
                    });
                }
            }

            return result;
        } catch (error) {
            console.error(
                `Error fetching customer deliveries for date ${date}:`,
                error
            );
            throw new Error(
                `Failed to fetch customer deliveries: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getUserById(id: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { id }
            })
            return user
        } catch (error) {
            console.error(`Error fetching user by ID ${id}:`, error);
            throw new Error(
                `Failed to fetch user: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }

    }

    async getAllUser(): Promise<User[]> {
        try {
            const users = await this.userRepository.find({
                order: { name: 'ASC' }
            });
            return users;
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw new Error(
                `Failed to fetch users: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getAllUsersByRole(role: UserRole): Promise<User[]> {
        try {
            return await this.userRepository.find({
                where: { role }
            })
        } catch (error) {
            console.error("Error fetching all users by role:", error);
            throw new Error(
                `Failed to fetch users: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getAllCustomer(): Promise<Customer[]> {
        try {
            return await this.customerRepository.find({
                order: { name: 'ASC' }
            })
        } catch (error) {
            console.error("Error fetching all users by role:", error);
            throw new Error(
                `Failed to fetch users: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({
                where: { email }
            });
        } catch (error) {
            console.error(`Error fetching user by email ${email}:`, error);
            throw new Error("Failed to fetch user by email");
        }
    }

    async getUsersByRolePaginated(
        role: UserRole,
        skip: number,
        limit: number
    ): Promise<{ users: User[]; total: number }> {
        try {
            const [users, total] = await this.userRepository.findAndCount({
                where: { role },
                skip,
                take: limit,
                order: { name: "ASC" },
            });

            return { users, total };
        } catch (error) {
            console.error("Error fetching paginated users by role:", error);
            throw new Error("Failed to fetch users by role");
        }
    }



    async getUserForAuth(id: string): Promise<Pick<User, "id" | "name" | "email" | "role" | "blocked"> | null> {
        try {
            const user = await this.userRepository
                .createQueryBuilder("user")
                .select([
                    "user.id",
                    "user.name",
                    "user.email",
                    "user.role",
                    "user.blocked",
                ])
                .where("user.id = :id", { id })
                .getOne();

            return user ?? null;
        } catch (error) {
            console.error(`Error fetching auth user:`, error);
            throw new Error("Failed to fetch user for auth");
        }
    }

    async getCustomerPaginated(skip: number, limit: number, isActive: boolean): Promise<{ customers: Customer[]; total: number; }> {
        try {
            const [customers, total] = await this.customerRepository.findAndCount({
                where: { isActive },
                skip,
                take: limit,
                order: { name: "ASC" },
            });

            return { customers, total };
        } catch (error) {
            console.error("Error fetching paginated customers:", error);
            throw new Error("Failed to fetch customer");
        }
    }

    async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
        try {
            const customer = await this.customerRepository.findOne({
                where: { id }
            });

            if (!customer) {
                throw new Error("Customer not found");
            }

            const updatedCustomer = this.customerRepository.merge(customer, data);

            await this.customerRepository.save(updatedCustomer);

            return updatedCustomer;
        } catch (error) {
            console.error(`Error updating customer ${id}:`, error);
            throw new Error(
                `Failed to update customer: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async deleteCustomerById(id: string): Promise<void> {
        try {
            const customer = await this.customerRepository.findOne({
                where: { id }
            });

            if (!customer) {
                throw new Error("Customer not found");
            }

            await this.customerRepository.remove(customer);
        } catch (error) {
            console.error(`Error deleting customer ${id}:`, error);
            throw new Error(
                `Failed to delete customer: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async disableCustomerById(id: string): Promise<void> {
        try {
            const customer = await this.customerRepository.findOne({
                where: { id }
            });

            if (!customer) {
                throw new Error("Customer not found");
            }

            customer.isActive = false;
            await this.customerRepository.save(customer);

        } catch (error) {
            console.error(`Error soft-deleting customer ${id}:`, error);
            throw new Error(
                `Failed to delete customer: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    async createCustomer(data: Omit<Customer, "id" | "isActive">): Promise<Customer> {
        try {
            const customer = this.customerRepository.create({
                ...data,
                isActive: true
            });
            const savedCustomer = await this.customerRepository.save(customer);
            return savedCustomer
        } catch (error) {
            console.error(`Error creating  customer:`, error);
            throw new Error(
                `Failed to create customer: ${error instanceof Error ? error.message : String(error)}`
            );

        }
    }


}