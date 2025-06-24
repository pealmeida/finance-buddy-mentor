import express from "express";
import { supabase } from "./src/integrations/supabase/client.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Helper function to validate market data
const validateMarketData = (data) => {
  const requiredFields = [
    "symbol",
    "price",
    "change",
    "changePercent",
    "timestamp",
  ];
  // const validTypes = ['index', 'stock', 'cryptocurrency', 'commodity']; // This variable is not used.

  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid data format" };
  }

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      return { isValid: false, error: `Missing required field: ${field}` };
    }
  }

  if (typeof data.price !== "number" || data.price < 0) {
    return { isValid: false, error: "Price must be a positive number" };
  }

  if (typeof data.change !== "number") {
    return { isValid: false, error: "Change must be a number" };
  }

  if (typeof data.changePercent !== "number") {
    return { isValid: false, error: "Change percent must be a number" };
  }

  return { isValid: true };
};

// Routes
app.get("/signup", (req, res) => {
  res.send("Signup form would be served here");
});

app.post("/api/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. Create auth user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Stores name in auth.user_metadata
      },
    });

    if (authError) throw authError;

    // 2. Create profile in public.profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email,
      name,
      created_at: new Date().toISOString(),
    });

    if (profileError) throw profileError;

    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Signup failed",
    });
  }
});

// Webhook endpoint for receiving market data updates
app.post("/api/webhook/market-data", async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const update of updates) {
      const validation = validateMarketData(update);
      if (!validation.isValid) {
        console.error("Invalid market data:", validation.error, update);
        results.push({
          symbol: update.symbol || "unknown",
          success: false,
          error: validation.error,
        });
        continue;
      }

      try {
        // Update market data in Supabase
        const { data, error } = await supabase
          .from("market_data")
          .update({
            price: update.price,
            change_amount: update.change,
            change_percent: update.changePercent,
            last_updated: new Date(update.timestamp).toISOString(),
          })
          .eq("symbol", update.symbol)
          .select();

        if (error) {
          console.error("Supabase update error:", error);
          results.push({
            symbol: update.symbol,
            success: false,
            error: error.message,
          });
        } else if (data && data.length === 0) {
          // Symbol not found in database
          results.push({
            symbol: update.symbol,
            success: false,
            error: "Symbol not found",
          });
        } else {
          results.push({
            symbol: update.symbol,
            success: true,
            data: data[0],
          });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        results.push({
          symbol: update.symbol,
          success: false,
          error: dbError.message,
        });
      }
    }

    // Return results
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      success: failureCount === 0,
      message: `Processed ${results.length} updates: ${successCount} successful, ${failureCount} failed`,
      results: results,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process market data webhook",
    });
  }
});

// Health check endpoint for the webhook
app.get("/api/webhook/market-data/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Market Data Webhook",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(
    `Market data webhook available at http://localhost:${PORT}/api/webhook/market-data`
  );
});
