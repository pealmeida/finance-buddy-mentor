#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log("Please check your .env file for:");
  console.log("- NEXT_PUBLIC_SUPABASE_URL");
  console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("🔍 DEBUGGING INVESTMENTS CRUD OPERATIONS");
console.log("==========================================");

async function testCRUDOperations() {
  try {
    // Check connection
    console.log("\n1. Testing Supabase connection...");
    const { data: connectionTest, error: connectionError } = await supabase
      .from("investments")
      .select("count", { count: "exact", head: true });

    if (connectionError) {
      console.error("❌ Connection failed:", connectionError);
      return;
    }
    console.log("✅ Connected to Supabase");

    // Test user authentication status
    console.log("\n2. Checking authentication...");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("⚠️  No authenticated user found");
      console.log(
        "   This script needs to run in browser context with an authenticated user"
      );
      console.log("   Run this in your browser console instead:");
      console.log(`
// Copy and paste this in your browser console while logged in:
async function testInvestmentsCRUD() {
  console.log('🔍 Testing Investments CRUD...');
  
  // Get current user
  const { data: { user } } = await window.supabase.auth.getUser();
  if (!user) {
    console.error('❌ No authenticated user');
    return;
  }
  console.log('✅ User ID:', user.id);
  
  // Test CREATE
  console.log('\\n1. Testing CREATE...');
  const testInvestment = {
    id: 'test-' + Date.now(),
    user_id: user.id,
    type: 'stocks',
    name: 'Test Investment ' + Date.now(),
    value: 1000,
    annual_return: 7.5
  };
  
  const { data: createData, error: createError } = await window.supabase
    .from('investments')
    .insert(testInvestment)
    .select();
  
  if (createError) {
    console.error('❌ CREATE failed:', createError);
    return;
  }
  console.log('✅ CREATE successful:', createData[0]);
  
  // Test READ
  console.log('\\n2. Testing READ...');
  const { data: readData, error: readError } = await window.supabase
    .from('investments')
    .select('*')
    .eq('user_id', user.id);
  
  if (readError) {
    console.error('❌ READ failed:', readError);
    return;
  }
  console.log('✅ READ successful:', readData.length, 'investments found');
  
  // Test UPDATE
  console.log('\\n3. Testing UPDATE...');
  const updatedValue = 1500;
  const { data: updateData, error: updateError } = await window.supabase
    .from('investments')
    .update({ value: updatedValue })
    .eq('id', testInvestment.id)
    .eq('user_id', user.id)
    .select();
  
  if (updateError) {
    console.error('❌ UPDATE failed:', updateError);
    return;
  }
  console.log('✅ UPDATE successful:', updateData[0]);
  
  // Test DELETE
  console.log('\\n4. Testing DELETE...');
  const { error: deleteError } = await window.supabase
    .from('investments')
    .delete()
    .eq('id', testInvestment.id)
    .eq('user_id', user.id);
  
  if (deleteError) {
    console.error('❌ DELETE failed:', deleteError);
    return;
  }
  console.log('✅ DELETE successful');
  
  console.log('\\n✅ All CRUD operations working correctly!');
}

// Run the test
testInvestmentsCRUD();
      `);
      return;
    }

    console.log("✅ Authenticated user:", user.id);

    // Test basic table access
    console.log("\n3. Testing table access...");
    const { data: tableData, error: tableError } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", user.id)
      .limit(5);

    if (tableError) {
      console.error("❌ Table access failed:", tableError);
      return;
    }

    console.log("✅ Table access successful");
    console.log(`📊 Found ${tableData.length} existing investments`);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

testCRUDOperations();
