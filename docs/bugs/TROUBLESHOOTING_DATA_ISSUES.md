# Troubleshooting Data Loading Issues - Investments & Goals Pages

## Summary of Changes Made

I've added debugging console logs to help identify the root cause of why data isn't displaying on the Investments and Goals pages. The debug logs will help us understand:

1. **Authentication Status** - Whether the user is properly logged in
2. **Data Fetching** - Whether API calls to Supabase are working
3. **Component State** - Whether data is being passed correctly between components

## Step-by-Step Troubleshooting

### Step 1: Run the Application and Check Console

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the Investments or Goals pages

3. Open Developer Tools (F12) and check the Console tab

4. Look for the debug messages that will now appear:
   - `"Investments component - Profile:"` 
   - `"fetchInvestments called with userId:"`
   - `"GoalsManagement component - Current goals from hook:"`
   - `"fetchUserGoals called - checking session..."`

### Step 2: Use the Debug Script

I've created a debug script (`debug-data-issues.js`) that you can run in the browser console to check:

1. Copy the contents of `debug-data-issues.js`
2. Open browser console on your app
3. Paste and run the script
4. Review the output for any errors

### Step 3: Common Issues & Solutions

#### Issue 1: Authentication Problems
**Symptoms:** Console shows "No authenticated session found" or "No valid profile or profile ID"

**Solutions:**
- Ensure user is logged in properly
- Check if authentication tokens are valid
- Try logging out and back in
- Clear browser storage and try again

#### Issue 2: Database Connection Issues
**Symptoms:** Supabase errors in console, API calls failing

**Solutions:**
- Verify Supabase credentials in `src/integrations/supabase/client.ts`
- Check Supabase dashboard for table permissions
- Ensure RLS (Row Level Security) policies are properly configured

#### Issue 3: Empty Data Tables
**Symptoms:** API calls succeed but return empty arrays

**Solutions:**
- Check if data actually exists in Supabase tables
- Verify user_id foreign key relationships
- Test adding new data through the UI

#### Issue 4: Component State Issues
**Symptoms:** Data loads but doesn't display, components show loading forever

**Solutions:**
- Check React component state updates
- Verify props are being passed correctly
- Look for infinite re-render loops

### Step 4: Database Verification

Check your Supabase tables directly:

1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. Check `investments` and `financial_goals` tables
4. Verify:
   - Tables exist and have data
   - `user_id` columns match authenticated user
   - RLS policies allow reading for authenticated users

### Step 5: Expected Debug Output

When working correctly, you should see:
```
Investments component - Profile: {id: "user-id", ...}
fetchInvestments called with userId: user-id
Supabase response: {data: [...], error: null}
Mapped investments: [...]
```

### Step 6: Quick Fixes to Try

1. **Clear Browser Cache and Storage:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Force Refresh Data:**
   - Navigate away from the page and back
   - Use the refresh buttons in the UI
   - Hard refresh (Ctrl+Shift+R)

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for failed API requests
   - Check if Supabase calls return 200 status

## Supabase Table Structure Verification

Ensure your tables match this structure:

### `investments` table:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `type` (text)
- `name` (text)
- `value` (numeric)
- `annual_return` (numeric, nullable)

### `financial_goals` table:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `name` (text)
- `target_amount` (numeric)
- `current_amount` (numeric)
- `target_date` (date)
- `priority` (text)

## Next Steps

After running through these steps, the debug logs should reveal the exact issue. Common outcomes:

1. **Authentication issue** → Fix login/session management
2. **Database permission issue** → Update RLS policies
3. **Empty tables** → Add test data or fix data creation flow
4. **Component rendering issue** → Fix React state management

Let me know what the debug output shows and I can provide more specific guidance! 