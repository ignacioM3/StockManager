import { GoogleGenerativeAI, type FunctionDeclaration, type GenerativeModel } from "@google/generative-ai";
import type { AIQueryResult, IAIService } from "../../domain/index.js";
import { getGeminiToolDeclarations } from "../../domain/tools/index.js";

export class GeminiAIService implements IAIService {
    private genIA: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor(apiKey: string, systemInstruction: string) {
        if (!apiKey) {
            throw new Error("Gemini API key is required");
        }
        this.genIA = new GoogleGenerativeAI(apiKey);
        //configurar el modelo con systemInstruction
        this.model = this.genIA.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            },
        })
    }

    private getToolDeclarations(){
        return getGeminiToolDeclarations()
    }


    private transformConversationHistory(
    history: Array<{ role: string; content: string }>
  ): Array<{ role: "user" | "model"; parts: any[] }> {
    const result: Array<{ role: "user" | "model"; parts: any[] }> = [];

    for (const msg of history) {
      if (msg.role === "user") {
        result.push({
          role: "user",
          parts: [{ text: msg.content }],
        });
      } else if (msg.role === "assistant") {
        result.push({
          role: "model",
          parts: [{ text: msg.content }],
        });
      } else if (msg.role === "tool") {
        // Tool results should be sent as user messages with function response parts
        try {
          const toolResults = JSON.parse(msg.content);
          const functionResponseParts = toolResults.map((tr: any) => ({
            functionResponse: {
              name: tr.toolName,
              response: tr.result,
            },
          }));

          result.push({
            role: "user",
            parts: functionResponseParts,
          });
        } catch (error) {
          // If parsing fails, send as plain text
          result.push({
            role: "user",
            parts: [{ text: msg.content }],
          });
        }
      }
    }

    return result;
  }
  
  async query(
    userMessage: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<AIQueryResult> {
    try {
      // Transform conversation history to Gemini's expected format
      const contents = this.transformConversationHistory(
        conversationHistory || []
      );

      // Use generateContent with the full conversation history
      const result = await this.model.generateContent({
        contents: contents,
        tools: [
          {
            functionDeclarations:
              this.getToolDeclarations() as FunctionDeclaration[],
          },
        ],
      });

      const response = result.response;

      // Check if the model returned function calls
      const functionCalls = response.functionCalls();

      if (functionCalls && functionCalls.length > 0) {
        // Extract tool calls from the response
        const toolCalls = functionCalls.map((fc: any) => ({
          name: fc.name,
          arguments: fc.args || {},
        }));

        return {
          response:
            response.text() ||
            "I need to execute some queries to answer your question.",
          toolCalls: toolCalls,
          data: null,
        };
      }

      // No function calls - return the conversational response
      return {
        response: response.text(),
        data: null,
      };
    } catch (error) {
      console.error("Error processing AI query:", error);

      // Handle rate limiting or API errors gracefully
      if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("quota")) {
          throw new Error(
            "AI service rate limit exceeded. Please try again later."
          );
        }
        if (
          error.message.includes("401") ||
          error.message.includes("API key")
        ) {
          throw new Error("Invalid API key. Please check your configuration.");
        }
      }

      throw new Error(
        `Failed to process AI query: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

}