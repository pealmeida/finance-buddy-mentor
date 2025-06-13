/**
 * Test script for the Market Data Webhook
 * This demonstrates how to send market data updates to the webhook endpoint
 */

import axios from "axios";

const WEBHOOK_URL = "http://localhost:3001/api/webhook/market-data";

// Sample market data updates
const marketDataUpdates = [
  {
    symbol: "SPY",
    price: 455.75,
    change: 8.33,
    changePercent: 1.86,
    timestamp: new Date().toISOString(),
  },
  {
    symbol: "BTC-USD",
    price: 67500.0,
    change: 2500.0,
    changePercent: 3.84,
    timestamp: new Date().toISOString(),
  },
  {
    symbol: "GLD",
    price: 187.2,
    change: 1.7,
    changePercent: 0.92,
    timestamp: new Date().toISOString(),
  },
  {
    symbol: "AAPL",
    price: 189.45,
    change: 3.5,
    changePercent: 1.88,
    timestamp: new Date().toISOString(),
  },
];

async function testWebhook() {
  try {
    console.log("Testing market data webhook...");
    console.log("Webhook URL:", WEBHOOK_URL);
    console.log("Sample data:", JSON.stringify(marketDataUpdates, null, 2));

    // Test health check first
    console.log("\n1. Testing health check...");
    const healthResponse = await axios.get(`${WEBHOOK_URL}/health`);
    console.log("Health check response:", healthResponse.data);

    // Send single update
    console.log("\n2. Testing single update...");
    const singleResponse = await axios.post(WEBHOOK_URL, marketDataUpdates[0]);
    console.log("Single update response:", singleResponse.data);

    // Send batch updates
    console.log("\n3. Testing batch updates...");
    const batchResponse = await axios.post(WEBHOOK_URL, marketDataUpdates);
    console.log("Batch update response:", batchResponse.data);

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log(
        "\n💡 Make sure the server is running on http://localhost:3001"
      );
      console.log("   Run: node server.js");
    }
  }
}

// Run the test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testWebhook();
}

export { testWebhook, marketDataUpdates };
