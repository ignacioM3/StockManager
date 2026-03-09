import type { Product } from "./Product.js";
import type { Warehouse } from "./Warehouse.js";

/* 
Inventory entity representa los niveles de existencia de los productos en el sistema
*/
export interface Inventory{
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    lastRestocked: Date;
}

export interface InventoryWithProduct extends Inventory{
    product: Product;
}

export interface InventoryWithWarehouse extends Inventory{
    warehouse: Warehouse;
}