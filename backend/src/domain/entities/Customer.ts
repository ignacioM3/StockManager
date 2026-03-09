/* 
Customer entity representa a un cliente en el sistema de gestion.
Contiene datos basicos del cliente.
*/

export interface Customer{
    id: string;
    name:string;
    email: string;
    location: string;
    isActive: boolean;
}