
import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';

/**
 * Initialize empty data for all months
 */
export const initializeEmptySavingsData = (): MonthlyAmount[] => {
  console.log("Initializing empty savings data");
  return MONTHS.map((_, index) => ({
    month: index + 1,
    amount: 0
  }));
};

/**
 * Process fetched savings data, ensuring it's complete and valid
 */
export const processFetchedData = (
  fetchedData: MonthlyAmount[] | undefined | null
): MonthlyAmount[] => {
  if (!fetchedData || !Array.isArray(fetchedData) || fetchedData.length === 0) {
    console.log("No valid savings data found, initializing empty data");
    return initializeEmptySavingsData();
  }
  
  console.log("Processing fetched savings data:", fetchedData);
  
  // If we don't have exactly 12 months, fill in the missing ones
  if (fetchedData.length !== 12) {
    console.log("Data doesn't have 12 months, filling missing months");
    const completeData = initializeEmptySavingsData();
    
    // Update with any valid months we have
    fetchedData.forEach(item => {
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
  const validatedData = fetchedData.map(item => ({
    month: item.month,
    amount: typeof item.amount === 'number' ? item.amount : 0
  }));
  
  // Sort by month number to ensure consistent order
  return [...validatedData].sort((a, b) => a.month - b.month);
};
