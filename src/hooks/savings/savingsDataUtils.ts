
import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';

/**
 * Initialize empty monthly savings data for all months
 */
export const initializeEmptySavingsData = (): MonthlyAmount[] => {
  return MONTHS.map((_, index) => ({
    month: index + 1,
    amount: 0
  }));
};

/**
 * Process fetched data to ensure it's in the right format
 */
export const processFetchedData = (data: MonthlyAmount[]): MonthlyAmount[] => {
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
    return completeData;
  }
  
  // Ensure all items have proper numeric amounts
  const validatedData = data.map(item => ({
    month: item.month,
    amount: typeof item.amount === 'number' ? item.amount : 0
  }));
  
  // Sort by month number to ensure consistent order
  const sortedData = [...validatedData].sort((a, b) => a.month - b.month);
  return sortedData;
};

/**
 * Calculate average monthly savings for a given year
 */
export const calculateAverageSavings = (monthlySavings: MonthlyAmount[]): number => {
  if (!monthlySavings || monthlySavings.length === 0) return 0;
  
  const totalSavings = monthlySavings.reduce((sum, month) => sum + month.amount, 0);
  return totalSavings / monthlySavings.length;
};
