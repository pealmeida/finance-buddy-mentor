// Test script to verify data loading fix
// Run this in browser console

async function testDataFix() {
  console.log("=== TESTING DATA ARCHITECTURE FIX ===");

  try {
    // Check localStorage profile
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      console.log("📁 localStorage Profile:");
      console.log("  - ID:", profile.id);
      console.log("  - Investments:", profile.investments?.length || 0);
      console.log("  - Goals:", profile.financialGoals?.length || 0);

      if (
        profile.investments?.length > 0 ||
        profile.financialGoals?.length > 0
      ) {
        console.log("✅ Profile has data in localStorage");
        console.log("💡 Try refreshing the page - data should now display!");
        return;
      }
    }

    // If no data in profile, suggest adding test data
    console.log("❌ No data found in profile");
    console.log(
      "💡 Suggestion: Use the add-test-data.js script to add sample data"
    );
    console.log("📍 Or add data manually through the UI");
  } catch (error) {
    console.error("❌ Error testing data fix:", error);
  }
}

testDataFix();

console.log("=== INSTRUCTIONS ===");
console.log("1. If you see data in localStorage, refresh the page");
console.log("2. If no data, run the add-test-data.js script first");
console.log("3. Check Investments and Goals pages");
