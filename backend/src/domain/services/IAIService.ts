/*
Resultado devuelto por un servicio de IA
Contiene la respuesta generada por la IA, llamadas a herramientas opcionales y los datos adicionales
*/

export interface AIQueryResult {
    response: string;
    toolCalls?: Array<{
        name: string;
        arguments: Record<string, any>
    }>

    data?:any;
}

export interface IAIService{
    query(
        userMessage: string,
        conversationHistory?: Array<{role: string, content: string}>
    ): Promise<AIQueryResult>;
}