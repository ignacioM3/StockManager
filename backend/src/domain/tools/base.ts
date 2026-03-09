import type { IDatabaseService } from "../services/IDatabaseService.js";

export interface Tool<Tparams = any, TResult = any>{
    name: string;
    description: string;
    parameters: {
        type: "object";
        properties: Record<string, any>;
        required?: string[];
    }
    execute: (params: Tparams, databaseService: IDatabaseService) => Promise<TResult>;
}

export type ToolRegistry = Map<string, Tool>;