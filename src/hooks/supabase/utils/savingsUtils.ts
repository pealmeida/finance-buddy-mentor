
import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { Json } from '@/integrations/supabase/types';

/**
 * Calculate average monthly savings for a given year
 */
export const calculateAverageSavings = (monthlySavings: MonthlyAmount[] | undefined): number => {
  if (!monthlySavings || monthlySavings.length === 0) return 0;
  
  const totalSavings = monthlySavings.reduce((sum, month) => sum + month.amount, 0);
  return totalSavings / monthlySavings.length;
};

/**
 * Convert raw JSON data to typed MonthlyAmount array
 * Safely handles any format issues from the database
 */
export const convertToTypedSavingsData = (data: Json | null): MonthlyAmount[] => {
  console.log("Converting JSON to typed savings data:", data);
  
  // If we get null or non-array data, return empty data
  if (!data || typeof data !== 'object' || !Array.isArray(data)) {
    console.log("Invalid or empty savings data received, initializing empty data");
    return initializeEmptySavingsData();
  }
  
  try {
    // Map the JSON data to properly typed MonthlyAmount objects
    const typedData = data.map(item => {
      if (typeof item === 'object' && item !== null) {
        const itemObj = item as Record<string, unknown>;
        
        // Safely extract month and amount with proper type handling
        const month = typeof itemObj.month === 'number' 
          ? itemObj.month 
          : typeof itemObj.month === 'string' 
            ? parseInt(itemObj.month, 10) 
            : 0;
        
        const amount = typeof itemObj.amount === 'number' 
          ? itemObj.amount 
          : typeof itemObj.amount === 'string' 
            ? parseFloat(itemObj.amount) 
            : 0;
        
        // Return a clean MonthlyAmount object
        return { month, amount };
      }
      
      console.warn("Unexpected data format in savings item:", item);
      return { month: 0, amount: 0 };
    }).filter(item => item.month >= 1 && item.month <= 12);
    
    console.log("Converted typed data after filtering:", typedData);
    
    // Ensure complete data set for all 12 months
    if (typedData.length !== 12) {
      console.log("Savings data doesn't have 12 months, filling missing months");
      const completeData = initializeEmptySavingsData();
      
      // Update the complete data with any valid months we received
      typedData.forEach(item => {
        if (item.month >= 1 && item.month <= 12) {
          completeData[item.month - 1] = item;
        }
      });
      
      console.log("Filled complete data:", completeData);
      return completeData;
    }
    
    // Sort by month number to ensure consistent order
    typedData.sort((a, b) => a.month - b.month);
    
    return typedData;
  } catch (error) {
    console.error("Error converting JSON to typed savings data:", error);
    return initializeEmptySavingsData();
  }
};

/**
 * Initialize empty monthly savings data for all months
 */
export const initializeEmptySavingsData = (): MonthlyAmount[] => {
  console.log("Initializing empty savings data");
  return MONTHS.map((_, index) => ({
    month: index + 1,
    amount: 0
  }));
};

/**
 * Ensure data consistency and completeness for monthly savings
 */
export const ensureCompleteSavingsData = (data: MonthlyAmount[]): MonthlyAmount[] => {
  console.log("Ensuring complete savings data:", data);
  
  // If empty or invalid, return completely empty data
  if (!Array.isArray(data) || data.length === 0) {
    console.log("No data provided, initializing empty data");
    return initializeEmptySavingsData();
  }
  
  // If we don't have exactly 12 months, fill in the missing ones
  if (data.length !== 12) {
    console.log("Data doesn't have 12 months, filling missing months");
    const completeData = initializeEmptySavingsData();
    
    // Update with any valid months we have
    data.forEach(item => {
      if (item.month >= 1 && item.month <= 12) {
        completeData[item.month - 1] = {
          month: item.month,
          amount: typeof item.amount === 'number' ? item.amount : 0
        };
      }
    });
    
    console.log("Filled complete data:", completeData);
    return completeData;
  }
  
  // Ensure all items have proper numeric amounts
  const validatedData = data.map(item => ({
    month: item.month,
    amount: typeof item.amount === 'number' ? item.amount : 0
  }));
  
  // Sort by month number to ensure consistent order
  const sortedData = [...validatedData].sort((a, b) => a.month - b.month);
  console.log("Sorted savings data:", sortedData);
  
  return sortedData;
};
