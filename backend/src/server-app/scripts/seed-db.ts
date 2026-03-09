import { randomInt } from "crypto";
import type { Customer, Inventory, Product, Sale, Warehouse } from "../../domain/index.js";
import { AppDataSource, InitializeDatabase } from "../database/data-source.js";
import { generateRandomDate, randomChoice, randomFloat } from "../database/seed-helper.js";
import type { User } from "../../domain/entities/User.js";
import { UserRole } from "../../domain/entities/User-Role.js";

async function seedDatabase(): Promise<void> {
    try {
        //asegurarnos que este inicializada la base de datos
        await InitializeDatabase();
        // Chequear si existen datos
        const productRepo = AppDataSource.getRepository("Product");
        const existingProducts = await productRepo.count();

        if (existingProducts > 0) {
            console.log("⚠️  Database already contains data. Skipping seed.");
            return;
        }

        console.log("🌱 Starting database seed...");
        // Obteniendo repositorios

        const warehouseRepo = AppDataSource.getRepository("Warehouse")
        const customerRepo = AppDataSource.getRepository("Customer");
        const inventoryRepo = AppDataSource.getRepository("Inventory");
        const saleRepo = AppDataSource.getRepository("Sale");
        const userRepo = AppDataSource.getRepository('User')

        console.log("📦 Seeding warehouses...");

        const adminUsers: User[] = [
            {
                id: crypto.randomUUID(),
                name: "Admin Master",
                email: "admin1@example.com",
                password: "admin123", 
                role: UserRole.ADMIN,
                confirmed: true
            },
            {
                id: crypto.randomUUID(),
                name: "Admin Secondary",
                email: "admin2@example.com",
                password: "admin123",
                role: UserRole.ADMIN,
                confirmed: true
            },
            {
                id: crypto.randomUUID(),
                name: "Admin Support",
                email: "admin3@example.com",
                password: "admin123",
                role: UserRole.ADMIN,
                confirmed: true
            },
        ];



        const savedUsersAdmin = await userRepo.save(adminUsers);
        console.log(`✅ Seeded ${savedUsersAdmin.length} users`);

        const clientUsers: User[] = [
            {
                id: crypto.randomUUID(),
                name: "Juan Pérez",
                email: "juan.perez@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "María Gómez",
                email: "maria.gomez@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Carlos López",
                email: "carlos.lopez@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Lucía Fernández",
                email: "lucia.fernandez@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Pedro Ramírez",
                email: "pedro.ramirez@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Ana Torres",
                email: "ana.torres@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Diego Morales",
                email: "diego.morales@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Sofía Castillo",
                email: "sofia.castillo@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Fernando Rojas",
                email: "fernando.rojas@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
            {
                id: crypto.randomUUID(),
                name: "Valentina Núñez",
                email: "valentina.nunez@example.com",
                password: "client123",
                role: UserRole.Client,
                confirmed: true,
            },
        ];


        const savedUsersClient = await userRepo.save(clientUsers);
        console.log(`✅ Seeded ${savedUsersClient.length} users clients`);


        const warehouses: Warehouse[] = [
            {
                id: crypto.randomUUID(),
                name: "North Distribution Center",
                location: "New York",
            },
            {
                id: crypto.randomUUID(),
                name: "West Coast Hub",
                location: "Los Angeles",
            },
            {
                id: crypto.randomUUID(),
                name: "Central Logistics Center",
                location: "Chicago",
            },
            {
                id: crypto.randomUUID(),
                name: "Southern Distribution Hub",
                location: "Dallas",
            },
        ];
        const savedWarehouses = await warehouseRepo.save(warehouses);
        console.log(`✅ Seeded ${savedWarehouses.length} warehouses`);

        console.log("📦 Seeding products...");
        const productData: Product[] = [
            // Electronics
            {
                id: crypto.randomUUID(),
                sku: "ELEC-001",
                name: "Wireless Mouse",
                category: "Electronics",
                price: 29.99,
                description: "Ergonomic wireless mouse with USB receiver",
            },
            {
                id: crypto.randomUUID(),
                sku: "ELEC-002",
                name: "Mechanical Keyboard",
                category: "Electronics",
                price: 89.99,
                description: "RGB mechanical gaming keyboard",
            },
            {
                id: crypto.randomUUID(),
                sku: "ELEC-003",
                name: '27" Monitor',
                category: "Electronics",
                price: 299.99,
                description: "4K UHD display with HDR support",
            },
            {
                id: crypto.randomUUID(),
                sku: "ELEC-004",
                name: "USB-C Hub",
                category: "Electronics",
                price: 49.99,
                description: "7-in-1 USB-C hub with HDMI and ethernet",
            },
            {
                id: crypto.randomUUID(),
                sku: "ELEC-005",
                name: "Wireless Headphones",
                category: "Electronics",
                price: 149.99,
                description: "Noise-cancelling Bluetooth headphones",
            },
            {
                id: crypto.randomUUID(),
                sku: "ELEC-006",
                name: "Webcam HD",
                category: "Electronics",
                price: 79.99,
                description: "1080p HD webcam with auto-focus",
            },

            // Furniture
            {
                id: crypto.randomUUID(),
                sku: "FURN-001",
                name: "Office Chair",
                category: "Furniture",
                price: 249.99,
                description: "Ergonomic office chair with lumbar support",
            },
            {
                id: crypto.randomUUID(),
                sku: "FURN-002",
                name: "Standing Desk",
                category: "Furniture",
                price: 599.99,
                description: "Electric adjustable standing desk",
            },
            {
                id: crypto.randomUUID(),
                sku: "FURN-003",
                name: "Bookshelf",
                category: "Furniture",
                price: 129.99,
                description: "5-tier wooden bookshelf",
            },
            {
                id: crypto.randomUUID(),
                sku: "FURN-004",
                name: "File Cabinet",
                category: "Furniture",
                price: 179.99,
                description: "3-drawer locking file cabinet",
            },
            {
                id: crypto.randomUUID(),
                sku: "FURN-005",
                name: "Conference Table",
                category: "Furniture",
                price: 899.99,
                description: "Large conference table seats 8-10",
            },

            // Office Supplies
            {
                id: crypto.randomUUID(),
                sku: "OFFC-001",
                name: "Paper Ream A4",
                category: "Office Supplies",
                price: 12.99,
                description: "500 sheets premium white paper",
            },
            {
                id: crypto.randomUUID(),
                sku: "OFFC-002",
                name: "Pen Set",
                category: "Office Supplies",
                price: 19.99,
                description: "Professional ballpoint pen set of 12",
            },
            {
                id: crypto.randomUUID(),
                sku: "OFFC-003",
                name: "Notebook Pack",
                category: "Office Supplies",
                price: 24.99,
                description: "Pack of 5 spiral notebooks",
            },
            {
                id: crypto.randomUUID(),
                sku: "OFFC-004",
                name: "Stapler Heavy Duty",
                category: "Office Supplies",
                price: 34.99,
                description: "Heavy duty stapler for up to 50 sheets",
            },
            {
                id: crypto.randomUUID(),
                sku: "OFFC-005",
                name: "Desk Organizer",
                category: "Office Supplies",
                price: 29.99,
                description: "Multi-compartment desk organizer",
            },
            {
                id: crypto.randomUUID(),
                sku: "OFFC-006",
                name: "Whiteboard Markers",
                category: "Office Supplies",
                price: 15.99,
                description: "Set of 8 dry-erase markers",
            },

            // Tools
            {
                id: crypto.randomUUID(),
                sku: "TOOL-001",
                name: "Cordless Drill",
                category: "Tools",
                price: 129.99,
                description: "20V cordless drill with battery",
            },
            {
                id: crypto.randomUUID(),
                sku: "TOOL-002",
                name: "Tool Set 100pc",
                category: "Tools",
                price: 199.99,
                description: "Complete 100-piece tool set with case",
            },
            {
                id: crypto.randomUUID(),
                sku: "TOOL-003",
                name: "Ladder 6ft",
                category: "Tools",
                price: 89.99,
                description: "Aluminum folding ladder",
            },
            {
                id: crypto.randomUUID(),
                sku: "TOOL-004",
                name: "Measuring Tape",
                category: "Tools",
                price: 19.99,
                description: "25ft locking measuring tape",
            },

            // Clothing
            {
                id: crypto.randomUUID(),
                sku: "CLTH-001",
                name: "Safety Vest",
                category: "Clothing",
                price: 24.99,
                description: "High-visibility safety vest",
            },
            {
                id: crypto.randomUUID(),
                sku: "CLTH-002",
                name: "Work Gloves",
                category: "Clothing",
                price: 14.99,
                description: "Durable work gloves pack of 3",
            },
            {
                id: crypto.randomUUID(),
                sku: "CLTH-003",
                name: "Steel Toe Boots",
                category: "Clothing",
                price: 119.99,
                description: "Safety steel toe work boots",
            },
            {
                id: crypto.randomUUID(),
                sku: "CLTH-004",
                name: "Uniform Shirt",
                category: "Clothing",
                price: 29.99,
                description: "Professional uniform polo shirt",
            },
            {
                id: crypto.randomUUID(),
                sku: "CLTH-005",
                name: "Hard Hat",
                category: "Clothing",
                price: 39.99,
                description: "OSHA approved safety hard hat",
            },
        ];
        const products: Product[] = await productRepo.save(productData);
        console.log(`✅ Seeded ${products.length} products`);


        console.log("📦 Seeding customers...");
        const customerData: Customer[] = [
            {
                id: crypto.randomUUID(),
                name: "Tech Solutions Inc",
                email: "contact@techsolutions.com",
                location: "New York",
                isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Retail Innovations LLC",
                email: "info@retailinnovations.com",
                location: "Los Angeles",
                isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Global Logistics Corp",
                email: "sales@globallogistics.com",
                location: "Chicago",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Office Depot Solutions",
                email: "orders@officedepot.com",
                location: "Dallas",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Construction Pro Services",
                email: "procurement@constructionpro.com",
                location: "New York",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Metro Supply Chain",
                email: "contact@metrosupply.com",
                location: "Los Angeles",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Enterprise Wholesale",
                email: "orders@enterprisewholesale.com",
                location: "Chicago",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "John Anderson",
                email: "john.anderson@email.com",
                location: "New York",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Sarah Martinez",
                email: "sarah.martinez@email.com",
                location: "Los Angeles",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Michael Chen",
                email: "michael.chen@email.com",
                location: "Chicago",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Emily Johnson",
                email: "emily.johnson@email.com",
                location: "Dallas",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "David Williams",
                email: "david.williams@email.com",
                location: "New York",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Lisa Brown",
                email: "lisa.brown@email.com",
                location: "Los Angeles",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Robert Taylor",
                email: "robert.taylor@email.com",
                location: "Chicago",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Jennifer Davis",
                email: "jennifer.davis@email.com",
                location: "Dallas",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Smart Retail Group",
                email: "purchasing@smartretail.com",
                location: "New York",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Industrial Partners LLC",
                email: "orders@industrialpartners.com",
                location: "Los Angeles",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Regional Distributors",
                email: "sales@regionaldist.com",
                location: "Chicago",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Premium Office Supplies",
                email: "contact@premiumoffice.com",
                location: "Dallas",
                  isActive: true
            },
            {
                id: crypto.randomUUID(),
                name: "Manufacturing Solutions",
                email: "procurement@mfgsolutions.com",
                location: "New York",
                  isActive: true
            },
        ];
        const customers: Customer[] = await customerRepo.save(customerData);
        console.log(`✅ Seeded ${customers.length} customers`);

        console.log("📦 Seeding inventory...");
        const inventoryData: Omit<Inventory, "id">[] = [];

        for (const product of products) {
            // Each product appears in 1-3 warehouses
            const numWarehouses = randomInt(1, 3);
            const selectedWarehouses = new Set<Warehouse>();

            while (selectedWarehouses.size < numWarehouses) {
                selectedWarehouses.add(randomChoice(savedWarehouses));
            }

            for (const warehouse of selectedWarehouses) {
                // Vary quantities: some low stock (1-10), some medium (11-50), some high (51-200)
                const stockType = Math.random();
                let quantity: number;
                if (stockType < 0.2) {
                    quantity = randomInt(1, 10); // Low stock (20%)
                } else if (stockType < 0.6) {
                    quantity = randomInt(11, 50); // Medium stock (40%)
                } else {
                    quantity = randomInt(51, 200); // High stock (40%)
                }

                // Generate lastRestocked dates with some very old ones (for "longest stocked" query)
                let daysAgo: number;
                if (Math.random() < 0.15) {
                    daysAgo = randomInt(60, 90); // Very old stock (15%)
                } else {
                    daysAgo = randomInt(1, 60); // Normal stock
                }

                inventoryData.push({
                    productId: product.id,
                    warehouseId: warehouse.id,
                    quantity,
                    lastRestocked: generateRandomDate(daysAgo),
                });
            }


        }
        const inventory = await inventoryRepo.save(inventoryData);
        console.log(`✅ Seeded ${inventory.length} inventory records`);


        console.log("📦 Seeding sales...");
        const salesData: Omit<Sale, "id">[] = [];
        const numSales = randomInt(150, 200);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get first day of current month for "monthly profitability"
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        for (let i = 0; i < numSales; i++) {
            const product = randomChoice(products);
            const customer = randomChoice(customers);

            // Determine sale timing:
            // - 10% today
            // - 50% this month
            // - 40% within last 30 days
            let soldAt: Date;
            const timeType = Math.random();

            if (timeType < 0.1) {
                // Today's sales
                soldAt = new Date(today);
                soldAt.setHours(randomInt(8, 18), randomInt(0, 59), randomInt(0, 59));
            } else if (timeType < 0.6) {
                // This month
                const daysSinceMonthStart = Math.floor(
                    (today.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24)
                );
                soldAt = generateRandomDate(daysSinceMonthStart);
            } else {
                // Last 30 days
                soldAt = generateRandomDate(30);
            }

            // Quantity: mostly small (1-5), some medium (6-20), rare large (21-100)
            let quantity: number;
            const qtyType = Math.random();
            if (qtyType < 0.7) {
                quantity = randomInt(1, 5); // Small orders (70%)
            } else if (qtyType < 0.95) {
                quantity = randomInt(6, 20); // Medium orders (25%)
            } else {
                quantity = randomInt(21, 100); // Large orders (5%)
            }

            const amount = randomFloat(
                product.price * quantity,
                product.price * quantity * 1.05
            ); // Add some variance

            salesData.push({
                productId: product.id,
                customerId: customer.id,
                quantity,
                amount,
                soldAt,
            });
        }

        const sales = await saleRepo.save(salesData);
        console.log(`✅ Seeded ${sales.length} sales records`);

        console.log("🎉 Database seeding completed successfully!");
        console.log("📊 Summary:");
        console.log(`   - Warehouses: ${savedWarehouses.length}`);
        console.log(`   - Products: ${products.length}`);
        console.log(`   - Customers: ${customers.length}`);
        console.log(`   - Inventory: ${inventory.length}`);
        console.log(`   - Sales: ${sales.length}`);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
}

seedDatabase()
    .then(() => {
        console.log("✅ Seed script completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Seed script failed:", error);
        process.exit(1);
    });
