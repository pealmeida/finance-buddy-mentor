
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
export const convertToTypedExpensesData = (data: Json[] | MonthlyAmount[] | null): MonthlyAmount[] => {
  if (!data || !Array.isArray(data)) {
    return initializeEmptyExpensesData();
  }
  
  return data.map(item => {
    // Handle case where item might already be properly typed
    if (typeof item === 'object' && item !== null) {
      const month = typeof item.month === 'number' 
        ? item.month 
        : typeof item.month === 'string' 
          ? parseInt(item.month) 
          : 0;
      
      const amount = typeof item.amount === 'number' 
        ? item.amount 
        : typeof item.amount === 'string' 
          ? parseFloat(item.amount) 
          : 0;
      
      return { month, amount };
    }
    
    // Fallback for unexpected data format
    return { month: 0, amount: 0 };
  });
};
