import { AppDataSource, InitializeDatabase } from "../database/data-source.js";
import { DatabaseService } from "./DatabaseService.js";
import { GeminiAIService } from "./GeminiAIService.js";
import { QueryHandler } from "../../domain/use-cases/QueryHandler.js";


export class ServiceContainer {
  private static instance: ServiceContainer | null = null;
  private databaseService!: DatabaseService; 
  private aiService!: GeminiAIService;
  private queryHandler!: QueryHandler;
  private initialized: boolean = false;

  private constructor() {
    
  }


  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return; // Already initialized
    }

    try {
      // Initialize database connection
      await InitializeDatabase();

      // Create database service instance
      this.databaseService = new DatabaseService(AppDataSource);

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "GEMINI_API_KEY environment variable is required. Please set it in your .env file."
        );
      }

     
      this.aiService = new GeminiAIService(
        apiKey,
        QueryHandler.getSystemPrompt()
      );

      this.queryHandler = new QueryHandler(
        this.aiService,
        this.databaseService
      );

      this.initialized = true;
      console.log("✅ Service container initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing services:", error);
      throw new Error(
        `Failed to initialize services: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }


  public getDatabaseService(): DatabaseService {
    this.ensureInitialized();
    return this.databaseService;
  }


  public getAIService(): GeminiAIService {
    this.ensureInitialized();
    return this.aiService;
  }

  public getQueryHandler(): QueryHandler {
    this.ensureInitialized();
    return this.queryHandler;
  }


  public isInitialized(): boolean {
    return this.initialized;
  }


  public async close(): Promise<void> {
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log("✅ Database connection closed successfully");
      }
      this.initialized = false;
    } catch (error) {
      console.error("❌ Error closing services:", error);
      throw new Error(
        `Failed to close services: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        "ServiceContainer has not been initialized. Call initialize() first."
      );
    }
  }
}


export async function getServices() {
  const container = ServiceContainer.getInstance();
  await container.initialize();
  return {
    databaseService: container.getDatabaseService(),
    aiService: container.getAIService(),
    queryHandler: container.getQueryHandler(),
  };
}

export async function closeServices(): Promise<void> {
  const container = ServiceContainer.getInstance();
  await container.close();
}
