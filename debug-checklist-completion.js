#!/usr/bin/env node

console.log("🔍 DEBUGGING ONBOARDING CHECKLIST COMPLETION");
console.log("==============================================");

console.log(`
📋 CHECKLIST COMPLETION DEBUG SCRIPT

This script will help debug why "Set monthly expenses" and "Set monthly savings" 
aren't being marked as completed in your onboarding checklist.

🔧 BROWSER CONSOLE TEST:

Copy and paste this into your browser console while logged in:

\`\`\`javascript
// Debug onboarding checklist completion
async function debugChecklistCompletion() {
  console.log('🔍 DEBUGGING CHECKLIST COMPLETION');
  console.log('================================');
  
  // Get current user
  const { data: { user }, error: userError } = await window.supabase.auth.getUser();
  if (userError || !user) {
    console.error('❌ User not authenticated:', userError);
    return;
  }
  console.log('✅ User ID:', user.id);
  
  // Check profile data structure
  console.log('\\n📊 CHECKING PROFILE DATA...');
  
  // Get the current profile from the app state (if available)
  if (window.userProfile) {
    console.log('✅ Profile found in window.userProfile');
    const profile = window.userProfile;
    
    console.log('\\n💰 MONTHLY EXPENSES CHECK:');
    console.log('- monthlyExpenses exists:', !!profile.monthlyExpenses);
    console.log('- monthlyExpenses.data exists:', !!profile.monthlyExpenses?.data);
    console.log('- monthlyExpenses.data length:', profile.monthlyExpenses?.data?.length || 0);
    console.log('- monthlyExpenses.data:', profile.monthlyExpenses?.data);
    
    if (profile.monthlyExpenses?.data) {
      const hasExpensesData = profile.monthlyExpenses.data.some(item => item.amount > 0);
      console.log('- Has expenses > 0:', hasExpensesData);
      
      profile.monthlyExpenses.data.forEach((item, index) => {
        console.log(\`  Month \${item.month}: $\${item.amount}\`);
      });
    }
    
    console.log('\\n💵 MONTHLY SAVINGS CHECK:');
    console.log('- monthlySavings exists:', !!profile.monthlySavings);
    console.log('- monthlySavings.data exists:', !!profile.monthlySavings?.data);
    console.log('- monthlySavings.data length:', profile.monthlySavings?.data?.length || 0);
    console.log('- monthlySavings.data:', profile.monthlySavings?.data);
    
    if (profile.monthlySavings?.data) {
      const hasSavingsData = profile.monthlySavings.data.some(item => item.amount > 0);
      console.log('- Has savings > 0:', hasSavingsData);
      
      profile.monthlySavings.data.forEach((item, index) => {
        console.log(\`  Month \${item.month}: $\${item.amount}\`);
      });
    }
    
  } else {
    console.log('⚠️ No profile found in window.userProfile');
  }
  
  // Check database directly
  console.log('\\n🗄️ CHECKING DATABASE DIRECTLY...');
  
  // Check monthly expenses in database
  const { data: expensesData, error: expensesError } = await window.supabase
    .from('monthly_expenses')
    .select('*')
    .eq('user_id', user.id);
  
  console.log('\\n💰 DATABASE EXPENSES:');
  console.log('- Query error:', expensesError);
  console.log('- Expenses data:', expensesData);
  console.log('- Expenses count:', expensesData?.length || 0);
  
  if (expensesData && expensesData.length > 0) {
    expensesData.forEach(expense => {
      console.log(\`  Year \${expense.year}: \${expense.data?.length || 0} months\`);
      if (expense.data) {
        expense.data.forEach(month => {
          console.log(\`    Month \${month.month}: $\${month.amount}\`);
        });
      }
    });
  }
  
  // Check monthly savings in database
  const { data: savingsData, error: savingsError } = await window.supabase
    .from('monthly_savings')
    .select('*')
    .eq('user_id', user.id);
  
  console.log('\\n💵 DATABASE SAVINGS:');
  console.log('- Query error:', savingsError);
  console.log('- Savings data:', savingsData);
  console.log('- Savings count:', savingsData?.length || 0);
  
  if (savingsData && savingsData.length > 0) {
    savingsData.forEach(saving => {
      console.log(\`  Year \${saving.year}: \${saving.data?.length || 0} months\`);
      if (saving.data) {
        saving.data.forEach(month => {
          console.log(\`    Month \${month.month}: $\${month.amount}\`);
        });
      }
    });
  }
  
  // Test the completion logic manually
  console.log('\\n🧪 TESTING COMPLETION LOGIC...');
  
  // Simulate the hasMonthlyExpensesData function
  function testExpensesCompletion(profile) {
    if (
      !profile.monthlyExpenses ||
      !profile.monthlyExpenses.data ||
      profile.monthlyExpenses.data.length === 0
    ) {
      return false;
    }
    return profile.monthlyExpenses.data.some((item) => item.amount > 0);
  }
  
  // Simulate the hasMonthlySavingsData function
  function testSavingsCompletion(profile) {
    if (
      !profile.monthlySavings ||
      !profile.monthlySavings.data ||
      profile.monthlySavings.data.length === 0
    ) {
      return false;
    }
    return profile.monthlySavings.data.some((item) => item.amount > 0);
  }
  
  if (window.userProfile) {
    const expensesComplete = testExpensesCompletion(window.userProfile);
    const savingsComplete = testSavingsCompletion(window.userProfile);
    
    console.log('\\n📋 COMPLETION TEST RESULTS:');
    console.log('- Monthly Expenses Complete:', expensesComplete);
    console.log('- Monthly Savings Complete:', savingsComplete);
  }
  
  console.log('\\n🎯 RECOMMENDATIONS:');
  console.log('1. Check if you have entered any monthly expenses/savings data');
  console.log('2. Verify the data structure matches what the checklist expects');
  console.log('3. Look for any data synchronization issues between UI and profile');
}

// Run the debug
debugChecklistCompletion();
\`\`\`

📝 WHAT TO LOOK FOR:

1. **Profile Data Structure**: Check if monthlyExpenses/monthlySavings exist
2. **Data Array**: Verify the data array has entries
3. **Amount Values**: Ensure at least one month has amount > 0
4. **Database vs Profile**: Compare database data with profile data

🔧 POSSIBLE ISSUES:

1. **Empty Data**: No expenses/savings entered yet
2. **Zero Amounts**: All months have $0 amounts
3. **Data Structure**: Profile structure doesn't match expected format
4. **Sync Issue**: Database has data but profile doesn't reflect it

Run the browser test and share the results!
`);

console.log("\n✅ Debug script ready - use the browser console test above.");
