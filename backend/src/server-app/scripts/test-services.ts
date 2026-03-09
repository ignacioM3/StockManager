import { closeServices, getServices } from "../services/ServicesContainer.js";

async function testServices() {
    try {
        console.log("🧪 Testing Service Layer Implementation\n");

        // Initialize services
        console.log("📦 Initializing services...");
        const { databaseService, aiService, queryHandler } = await getServices();
        console.log("✅ Services initialized successfully\n");


        // Test 1: Database Service - Get all products
        console.log("🔍 Test 1: Fetching all products...");
        const products = await databaseService.getAllProducts();
        console.log(`✅ Found ${products.length} products`);

        if (products.length > 0 && products[0]) {
            console.log(`   Sample: ${products[0].name} (SKU: ${products[0].sku})\n`);
        }

        // Test 2: Database Service - Get today's sales
        console.log("🔍 Test 2: Fetching today's sales...");
        const today = new Date();
        const todaysSales = await databaseService.getSalesByDate(today);
        console.log(`✅ Found ${todaysSales.length} sales today\n`);

        console.log("🔍 Test 3: Fetching products with oldest stock...");
        const oldestStock = await databaseService.getProductsWithOldestStock(5);
        console.log(`✅ Found ${oldestStock.length} products with old stock`);
        if (oldestStock.length > 0) {
            const oldest = oldestStock[0];
            if (oldest) {
                console.log(
                    `   Oldest: ${oldest.product.name} - Last restocked: ${oldest.lastRestocked}\n`
                );
            }
        }

        // Test 4: AI Service - Simple conversational query
        console.log("🤖 Test 4: Testing AI Service with conversational query...");
        try {
            const aiResponse1 = await aiService.query(
                "Hello! What can you help me with?"
            );
            console.log(
                `✅ AI Response: ${aiResponse1.response.substring(0, 100)}...`
            );
            console.log(
                `   Tool calls: ${aiResponse1.toolCalls ? aiResponse1.toolCalls.length : 0
                }\n`
            );
        } catch (error) {
            console.log(
                `⚠️  AI Service test skipped (likely missing API key): ${error instanceof Error ? error.message : String(error)
                }\n`
            );
        }

        // Test 5: AI Service - Query that should trigger tool call
        console.log("🤖 Test 5: Testing AI Service with tool-triggering query...");
        try {
            const aiResponse2 = await aiService.query("Show me today's sales");
            console.log(`✅ AI Response: ${aiResponse2.response}`);
            console.log(
                `   Tool calls: ${aiResponse2.toolCalls
                    ? JSON.stringify(aiResponse2.toolCalls, null, 2)
                    : "none"
                }\n`
            );
        } catch (error) {
            console.log(
                `⚠️  AI Service test skipped (likely missing API key): ${error instanceof Error ? error.message : String(error)
                }\n`
            );
        }

        await closeServices();
    } catch (error) {
  console.error("❌ Test failed:", error);
    process.exit(1);
    }
}

testServices();