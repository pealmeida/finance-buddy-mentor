
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
            ? parseInt(itemObj.month) 
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
    // Create a clean array with only the needed properties
    const sanitizedData = data.map(item => ({
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
