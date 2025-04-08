
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
 */
export const convertToTypedExpensesData = (data: Json | null): MonthlyAmount[] => {
  if (!data || !Array.isArray(data)) {
    console.log("Invalid data format received, initializing empty data");
    return initializeEmptyExpensesData();
  }
  
  try {
    const typedData = data.map(item => {
      // Handle case where item might already be properly typed
      if (typeof item === 'object' && item !== null) {
        const itemObj = item as Record<string, unknown>;
        
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
        
        return { month, amount };
      }
      
      // Fallback for unexpected data format
      console.warn("Unexpected data format in item:", item);
      return { month: 0, amount: 0 };
    });
    
    return typedData;
  } catch (error) {
    console.error("Error converting JSON to typed data:", error);
    return initializeEmptyExpensesData();
  }
};

/**
 * Convert MonthlyAmount array to Json format for Supabase
 * This properly handles the type conversion needed for Supabase
 */
export const convertExpensesDataToJson = (data: MonthlyAmount[]): Json => {
  try {
    // Create a clean array with only the needed properties
    const sanitizedData = data.map(item => ({
      month: item.month,
      amount: item.amount
    }));
    
    // Convert to standard JSON and then parse back to ensure JSON compatibility
    const jsonString = JSON.stringify(sanitizedData);
    const jsonData = JSON.parse(jsonString) as Json;
    
    return jsonData;
  } catch (error) {
    console.error("Error converting expenses data to JSON:", error);
    return [] as Json;
  }
};
