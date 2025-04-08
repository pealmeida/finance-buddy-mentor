
import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { Json } from '@/integrations/supabase/types';

/**
 * Initialize empty monthly expense data for all months
 */
export const initializeEmptyExpensesData = (): MonthlyAmount[] => {
  return MONTHS.map((_, index) => ({
    month: index + 1,
    amount: 0
  }));
};

/**
 * Convert raw JSON data to typed MonthlyAmount array
 * This safely handles any format issues from the database
 */
export const convertToTypedExpensesData = (data: Json | null): MonthlyAmount[] => {
  // If we get null or non-array data, return empty data
  if (!data || !Array.isArray(data)) {
    console.log("Invalid expenses data format received, initializing empty data");
    return initializeEmptyExpensesData();
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
      
      console.warn("Unexpected data format in expense item:", item);
      return { month: 0, amount: 0 };
    });
    
    // Validate that we have data for all 12 months
    if (typedData.length !== 12) {
      console.log("Expenses data doesn't have 12 months, filling missing months");
      const completeData = initializeEmptyExpensesData();
      
      // Update the complete data with any valid months we received
      typedData.forEach(item => {
        if (item.month >= 1 && item.month <= 12) {
          completeData[item.month - 1] = item;
        }
      });
      
      return completeData;
    }
    
    // Sort by month number to ensure consistent order
    typedData.sort((a, b) => a.month - b.month);
    
    return typedData;
  } catch (error) {
    console.error("Error converting JSON to typed expenses data:", error);
    return initializeEmptyExpensesData();
  }
};

/**
 * Convert MonthlyAmount array to Json format for Supabase
 * Creates a clean array representation suitable for storage
 */
export const convertExpensesDataToJson = (data: MonthlyAmount[]): Json => {
  try {
    // Ensure we have valid data first
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Empty expenses data provided for conversion to JSON, using empty array");
      return [] as unknown as Json;
    }
    
    // Ensure we have data for all 12 months
    let completeData = [...data];
    if (completeData.length !== 12) {
      console.log("Expenses data doesn't have 12 months, filling missing months");
      const emptyData = initializeEmptyExpensesData();
      
      // Update the empty data with any valid months we have
      data.forEach(item => {
        if (item.month >= 1 && item.month <= 12) {
          emptyData[item.month - 1] = item;
        }
      });
      
      completeData = emptyData;
    }
    
    // Create a clean array with only the needed properties
    const sanitizedData = completeData.map(item => ({
      month: item.month,
      amount: item.amount
    }));
    
    // Return the sanitized data as Json
    return sanitizedData as unknown as Json;
  } catch (error) {
    console.error("Error converting expenses data to JSON:", error);
    return [] as unknown as Json;
  }
};

/**
 * Ensure data consistency and completeness for monthly expenses
 */
export const ensureCompleteExpensesData = (data: MonthlyAmount[]): MonthlyAmount[] => {
  // If empty or invalid, return completely empty data
  if (!Array.isArray(data) || data.length === 0) {
    return initializeEmptyExpensesData();
  }
  
  // If we don't have exactly 12 months, fill in the missing ones
  if (data.length !== 12) {
    const completeData = initializeEmptyExpensesData();
    
    // Update with any valid months we have
    data.forEach(item => {
      if (item.month >= 1 && item.month <= 12) {
        completeData[item.month - 1] = item;
      }
    });
    
    return completeData;
  }
  
  // Sort by month number to ensure consistent order
  return [...data].sort((a, b) => a.month - b.month);
};
