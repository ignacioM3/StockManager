import type { IAIService } from "../services/IAIService.js";
import type { IDatabaseService } from "../services/IDatabaseService.js";
import { createToolRegistry } from "../tools/index.js";

export interface ConversationMessage {
    role: 'user' | 'assistant' | 'tool'
    content: string;
}

export interface QueryResult {
    answer: string;
}

export interface IQueryHandler {
    handleQuery(userQuestion: string): Promise<QueryResult>
}

export class QueryHandler implements IQueryHandler {
    private readonly toolRegistry = createToolRegistry()

    static getSystemPrompt(): string {
        return `You are an intelligent assistant for a Stock Management System (SMS). 
You help users query and analyze warehouse data including products, inventory, sales, customers, and deliveries.

## Language Policy
- **Automatic language detection**: Always respond in the same language as the user's input
- If the user writes in Spanish, respond in Spanish
- If the user writes in English, respond in English  
- Maintain the same language for the entire conversation
- Use appropriate greetings and terminology for the detected language

## Your Capabilities
You have access to several specialized tools/functions that retrieve data from the system:
- Product stock and inventory queries
- Sales and profitability analysis
- Customer delivery tracking
- Warehouse stock management
- Time-based analytics (daily, monthly reports)

## Response Guidelines

### 1. Tool Usage
- **Analyze the question first**: Determine if you need to call tools or can answer directly
- **Use appropriate tools**: Select the tool(s) that best match the user's intent
- **Wait for tool results**: After calling tools, use the returned data to formulate your answer
- **Handle errors gracefully**: If a tool fails, explain what went wrong and suggest alternatives

### 2. Response Format
- **Always respond in Markdown format** with proper formatting
- **Use headers (##, ###)** to organize information when presenting complex data
- **Use tables** for structured data with multiple columns
- **Use bullet lists** for multiple items or summaries
- **Use bold** for emphasis on key numbers, names, or important points
- **Include units** when presenting numerical data (e.g., $1,000, 50 units, 30 days)

### 3. Answer Structure
When responding with data:
1. **Brief summary**: Start with a concise answer to the question
2. **Data presentation**: Show the relevant data in a clear, formatted way
3. **Insights**: Add context or notable observations if relevant
4. **Next steps**: Suggest related queries if appropriate

### 4. Data Presentation Examples
- For single values: "The total is **$1,234.56**"
- For lists: Use bullet points with **bold** for key values
- For comparisons: Use tables with aligned columns
- For time series: Mention the time period clearly

### 5. Tone and Style
- Be **helpful and professional**
- Keep responses **concise but complete**
- Use **clear, simple language**
- Avoid jargon unless necessary
- **Be accurate** - don't make up data or statistics

## 6. Tool Privacy Rules
- Never mention tool names, function names, or internal system methods in your responses.
- Never expose function calls like query_xxx().
- When referring to available capabilities, describe them naturally (e.g., "I can check today's sales").
- Tools are internal mechanisms and must remain invisible to the user.
- You can use the descriptions to give an answer, but never reveal the underlying implementation or that you are using tools to get the data. 

Remember: Your goal is to help users understand their warehouse operations through clear, well-formatted, data-driven responses.`
    }

    constructor(
        private readonly aiService: IAIService,
        private readonly databaseService: IDatabaseService
    ) { }

    async handleQuery(userQuestion: string): Promise<QueryResult> {
        try {
            console.log("\n" + "=".repeat(80));
            console.log("🤖 [QueryHandler] Iniciando proceso de consulta");
            console.log("📝 Pregunta del usuario:", userQuestion);
            console.log("=".repeat(80));
            const conversationHistory: ConversationMessage[] = []
            const maxIterations = 5;
            let iteration = 0;

            const today = new Date().toISOString().split('T')[0];
            conversationHistory.push({
                role: 'user',
                content: `Today's date is ${today}. ${userQuestion}`
            });

            while (iteration < maxIterations) {
                console.log(`\n${"─".repeat(80)}`);
                console.log(
                    `🔄 [QueryHandler] Iteraciones ${iteration + 1}/${maxIterations}`
                );
                console.log(`${"─".repeat(80)}`);
                //etapa 1: Enviar la pregunta del usuario y el historial de conversación al servicio de IA
                console.log("🧠 [QueryHandler] Enviando consulta al servicio de IA...");
                const aiResult = await this.aiService.query(
                    userQuestion,
                    conversationHistory
                )

                console.log("📤 [QueryHandler] AI respuesta recibida:");
                console.log(
                    "   Respuesta:",
                    aiResult.response.substring(0, 200) +
                    (aiResult.response.length > 200 ? "..." : "")
                );
                console.log("   Tool Calls:", aiResult.toolCalls?.length || 0);

                //etapa 2: Agregar la respuesta de la IA al historial de conversación
                conversationHistory.push({
                    role: 'assistant',
                    content: aiResult.response
                })

                //etapa 3: Chequear si la IA ha solicitado algun tools
                if (!aiResult.toolCalls || aiResult.toolCalls.length === 0) {
                    // no hay llamadas a herramientas, devolver la respuesta final
                    console.log(
                        "\n✅ [QueryHandler] No necesita llamar tools - Retornando respuesta final"
                    );
                    console.log("=".repeat(80) + "\n");
                    return {
                        answer: aiResult.response
                    }
                }
                console.log(
                    `🔧 [QueryHandler] AI Requiere ${aiResult.toolCalls.length} tool call(s):`
                );
                aiResult.toolCalls.forEach((tc, idx) => {
                    console.log(
                        `   ${idx + 1}. ${tc.name}(${JSON.stringify(tc.arguments)})`
                    );
                });

                //etapa 4: Ejecutar todos los tools solicidatos por la IA
                const toolResults = await this.executeAllTools(aiResult.toolCalls);
                console.log("📊 [QueryHandler] Tool ejecucción completada:");
                toolResults.forEach((tr, idx) => {
                    console.log(
                        `   ${idx + 1}. ${tr.toolName}: ${tr.result.error ? "❌ Error" : "✓ Success"
                        }`
                    );
                });
                //etapa 5: agregar los resultados de los tools al historial de conversación
                conversationHistory.push({
                    role: 'tool',
                    content: JSON.stringify(toolResults, null, 2)
                })
                iteration++
            }
            console.log("\n⚠️ [QueryHandler] Alcanzó el maximo de iteraciones");
            console.log("=".repeat(80) + "\n");

            return {
                answer: "I apologize, but I couldn't complete the request within the allowed number of steps. Please try rephrasing your question or breaking it into smaller parts.",
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            console.log("\n❌ [QueryHandler] Error occurred:", errorMessage);
            console.log("=".repeat(80) + "\n");
            return {
                answer: `I encountered an error while processing your question: ${errorMessage}`,
            };
        }
    }

    private async executeAllTools(toolCalls: Array<{ name: string; arguments: Record<string, any> }>): Promise<Array<{ toolName: string; result: any }>> {
        console.log(
            `\n🔧 [QueryHandler] Ejecutando ${toolCalls.length} tool(s) en paralelo...`
        );

        const toolPromises = toolCalls.map(async (toolCall) => {
            try {
                const result = await this.executeTool(
                    toolCall.name,
                    toolCall.arguments
                );
                return {
                    toolName: toolCall.name,
                    result,
                };
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                console.log(
                    `❌ [QueryHandler] Tool ${toolCall.name} failed:`,
                    errorMessage
                );
                return {
                    toolName: toolCall.name,
                    result: { error: errorMessage },
                };
            }
        });

        return Promise.all(toolPromises);
    }

    private async executeTool(toolName: string, args: Record<string, any>): Promise<any> {
        console.log(
            `   🔨 [Tool:${toolName}] Empezando ejecucion los siguiente argumentos:`,
            JSON.stringify(args)
        );

        const tool = this.toolRegistry.get(toolName);
        if (!tool) {
            console.log(`   ❌ [Tool:${toolName}] Tool not found in registry`);
            throw new Error(`Unknown tool: ${toolName}`);
        }

        const startTime = Date.now();
        const result = await tool.execute(args, this.databaseService);
        const duration = Date.now() - startTime;
        console.log(`   ✅ [Tool:${toolName}] Completada en ${duration}ms`);

        return result;

    }
}


