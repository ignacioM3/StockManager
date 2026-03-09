/* 
 Sale entity respresenta a una transacción de venta en el sistema.
*/

import type { Customer } from "./Customer.js";
import type { Product } from "./Product.js";

export interface Sale{
    id: string;
    productId: string;
    customerId: string;
    quantity: number;
    amount: number;
    soldAt:Date;
}

export interface SaleWithRelations extends Sale{
    product: Product;
    customer: Customer
}