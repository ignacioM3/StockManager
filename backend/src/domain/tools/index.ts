import type { Tool, ToolRegistry } from "./base.js";
import { queryCustomerDeliveriesTool } from "./QueryCustomerDeliveriesTool.js";
import { queryLongestStockedProductsTool } from "./QueryLongestStockedProductsTool.js";
import { queryMonthlyProfitabilityTool } from "./QueryMonthlyProfitabilityToo.js";
import { queryProductStockTool } from "./QueryProductStockTool.js";
import { querySalesByCustomerTool } from "./QuerySalesByCustomerNameTool.js";
import { queryTodaysSalesTool } from "./QueryTodaysSalesTool.js";

export const ALL_TOOLS: Tool[] = [
    queryTodaysSalesTool,
    queryProductStockTool,
    queryMonthlyProfitabilityTool,
    queryCustomerDeliveriesTool,
    queryLongestStockedProductsTool,
    querySalesByCustomerTool
]

export function createToolRegistry(): ToolRegistry{
    const registry = new Map<string, Tool>();
    for(const tool of ALL_TOOLS){
        registry.set(tool.name, tool)
    }

    return registry
}

export function getGeminiToolDeclarations(){
    return ALL_TOOLS.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
    }))
}
export * from './base.js';
export * from './QueryTodaysSalesTool.js';