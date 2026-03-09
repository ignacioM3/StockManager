import { Router } from "express"
import type { Request, Response } from 'express';
import { ServiceContainer } from "../services/ServicesContainer.js";

const router = Router();

router.post("/query", async (req: Request, res: Response) => {
    try {
        //validate request body
        const { query } = req.body;
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Query parameter is required and must be a non-empty string'
            })
        }

        console.log(`[API] Processing query: "${query}"`);
        // obtener QueryHandler de servicies container
        const serviceContainer = ServiceContainer.getInstance()
        const queryHandler = serviceContainer.getQueryHandler();

        const result = await queryHandler.handleQuery(query);

        console.log(`[API] Query processed successfully`);
        return res.json(result);

    } catch (error) {
        console.error("[API] Error processing query:", error);

        // Return error response
        return res.status(500).json({
            error: "Internal Server Error",
            message:
                error instanceof Error ? error.message : "Failed to process query",
        });
    }
})

export default router;