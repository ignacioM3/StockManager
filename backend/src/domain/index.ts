//Domain Entities
export type { Product } from "./entities/Product.js";
export type { Inventory } from "./entities/Inventory.js";
export type { Sale } from "./entities/Sale.js";
export type { Customer } from "./entities/Customer.js";
export type { Warehouse } from "./entities/Warehouse.js";

//services interface
export type { IDatabaseService } from "./services/IDatabaseService.js";
export type { IAIService, AIQueryResult } from "./services/IAIService.js";

//use-cases type
export type { Tool, ToolRegistry } from "./tools/base.js";
export { createToolRegistry, ALL_TOOLS } from "./tools/index.js";
export { queryTodaysSalesTool } from "./tools/QueryTodaysSalesTool.js";

export type { IQueryHandler, QueryResult } from "./use-cases/QueryHandler.js";
export { QueryHandler } from "./use-cases/QueryHandler.js";