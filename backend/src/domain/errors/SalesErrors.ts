export class RequiredQuantityError extends Error {
  constructor(){
    super("La cantidad debe ser mayor a 0");
  }
}

export class SaleNotFoundError extends Error {
  constructor(){
    super("Venta no encontrada");
  }
}