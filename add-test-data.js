// Script to add test data for investments and goals
// Run this in the browser console while on your app

const addTestData = async () => {
  console.log("=== ADDING TEST DATA ===");

  try {
    // Import the supabase client
    const { supabase } = await import("./src/integrations/supabase/client.js");

    // Get current user
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error("❌ Not authenticated");
      return;
    }

    const userId = sessionData.session.user.id;
    console.log("✅ User ID:", userId);

    // Add test investments
    console.log("Adding test investments...");
    const testInvestments = [
      {
        user_id: userId,
        type: "stocks",
        name: "S&P 500 ETF (SPY)",
        value: 15000,
        annual_return: 8.5,
      },
      {
        user_id: userId,
        type: "cash",
        name: "Emergency Fund",
        value: 5000,
        annual_return: 2.1,
      },
      {
        user_id: userId,
        type: "crypto",
        name: "Bitcoin",
        value: 3000,
        annual_return: null,
      },
      {
        user_id: userId,
        type: "bonds",
        name: "Government Bonds",
        value: 7500,
        annual_return: 4.2,
      },
    ];

    const { data: investmentData, error: investmentError } = await supabase
      .from("investments")
      .insert(testInvestments)
      .select();

    if (investmentError) {
      console.error("❌ Investment error:", investmentError);
    } else {
      console.log("✅ Investments added:", investmentData.length);
      console.log("📊 Investment data:", investmentData);
    }

    // Add test goals
    console.log("Adding test goals...");
    const testGoals = [
      {
        user_id: userId,
        name: "House Down Payment",
        target_amount: 50000,
        current_amount: 12000,
        target_date: "2025-12-31",
        priority: "high",
      },
      {
        user_id: userId,
        name: "Emergency Fund Boost",
        target_amount: 15000,
        current_amount: 5000,
        target_date: "2024-08-15",
        priority: "high",
      },
      {
        user_id: userId,
        name: "Vacation Fund",
        target_amount: 8000,
        current_amount: 2500,
        target_date: "2024-07-15",
        priority: "medium",
      },
      {
        user_id: userId,
        name: "New Car",
        target_amount: 25000,
        current_amount: 5000,
        target_date: "2025-06-30",
        priority: "low",
      },
    ];

    const { data: goalsData, error: goalsError } = await supabase
      .from("financial_goals")
      .insert(testGoals)
      .select();

    if (goalsError) {
      console.error("❌ Goals error:", goalsError);
    } else {
      console.log("✅ Goals added:", goalsData.length);
      console.log("🎯 Goals data:", goalsData);
    }

    console.log("=== TEST DATA ADDED SUCCESSFULLY ===");
    console.log("🔄 REFRESH THE PAGE to see your data!");
    console.log("📱 Navigate to Investments and Goals pages");

    // Clear localStorage to force fresh data load
    localStorage.removeItem("userProfile");
    console.log("🧹 Cleared localStorage to force fresh data load");
  } catch (error) {
    console.error("❌ Error adding test data:", error);
  }
};

// Run the function
addTestData();

console.log("=== INSTRUCTIONS ===");
console.log("1. Check the console output above");
console.log("2. If successful, REFRESH your page");
console.log("3. Navigate to Investments and Goals pages");
console.log("4. You should now see test data displayed!");
