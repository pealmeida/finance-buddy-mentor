// Debug script to test data loading issues
// This script can be run in the browser console to check authentication and data

async function debugDataIssues() {
  console.log("=== DEBUGGING DATA LOADING ISSUES ===");

  // Check if we're in the browser
  if (typeof window === "undefined") {
    console.error("This script must be run in the browser");
    return;
  }

  try {
    // Import supabase client
    const { supabase } = await import("./src/integrations/supabase/client");

    console.log("1. Checking Supabase connection...");

    // Check authentication
    console.log("2. Checking authentication...");
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return;
    }

    if (!sessionData.session) {
      console.warn("❌ No authenticated session found");
      console.log("User needs to log in first");
      return;
    }

    console.log("✅ User is authenticated");
    console.log("User ID:", sessionData.session.user.id);
    console.log("User email:", sessionData.session.user.email);

    const userId = sessionData.session.user.id;

    // Check investments table
    console.log("3. Checking investments data...");
    const { data: investmentsData, error: investmentsError } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", userId);

    if (investmentsError) {
      console.error("❌ Investments error:", investmentsError);
    } else {
      console.log("✅ Investments query successful");
      console.log("Investments count:", investmentsData?.length || 0);
      console.log("Investments data:", investmentsData);
    }

    // Check goals table
    console.log("4. Checking goals data...");
    const { data: goalsData, error: goalsError } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("user_id", userId);

    if (goalsError) {
      console.error("❌ Goals error:", goalsError);
    } else {
      console.log("✅ Goals query successful");
      console.log("Goals count:", goalsData?.length || 0);
      console.log("Goals data:", goalsData);
    }

    // Check localStorage for profile data
    console.log("5. Checking localStorage...");
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        console.log("✅ Profile found in localStorage");
        console.log("Profile ID:", parsedProfile.id);
        console.log("Profile investments:", parsedProfile.investments);
        console.log("Profile goals:", parsedProfile.financialGoals);
      } catch (e) {
        console.error("❌ Error parsing localStorage profile:", e);
      }
    } else {
      console.warn("❌ No profile found in localStorage");
    }
  } catch (error) {
    console.error("❌ Debug script error:", error);
  }
}

// Run the debug function
debugDataIssues();

console.log("=== TO RUN THIS MANUALLY ===");
console.log("1. Open browser dev tools");
console.log("2. Copy and paste this entire script");
console.log("3. Press Enter to execute");
console.log("4. Check the console output for issues");
