/* 
 Product entity representa un producto en el sistema de gestión
*/

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    price: number;
    description: string;
}