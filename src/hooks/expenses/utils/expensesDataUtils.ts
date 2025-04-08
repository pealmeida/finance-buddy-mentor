
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
    return initializeEmptyExpensesData();
  }
  
  return data.map(item => {
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
    return { month: 0, amount: 0 };
  });
};

/**
 * Convert MonthlyAmount array to Json format for Supabase
 * This properly handles the type conversion needed for Supabase
 */
export const convertExpensesDataToJson = (data: MonthlyAmount[]): Json => {
  // Convert the data to a JSON string and then parse it back to ensure it's proper JSON
  // This ensures we're returning something that matches the Json type definition
  return JSON.parse(JSON.stringify(data)) as Json;
};
