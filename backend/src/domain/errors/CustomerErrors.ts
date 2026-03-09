export class CustomerNotFoundError extends Error {
  constructor() {
    super("Cliente no encontrado");
  }
}

export class RequiredIDError extends Error {
  constructor(){
    super("El ID es obligatorio");
  }
}