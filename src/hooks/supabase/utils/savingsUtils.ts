import { MonthlyAmount } from '../../../types/finance';
import { MONTHS } from '../../../constants/months';
import { Json } from '../../../integrations/supabase/types';

/**
 * Calculate average monthly savings for a given year
 */
export const calculateAverageSavings = (monthlySavings: MonthlyAmount[] | undefined): number => {
  if (!monthlySavings || monthlySavings.length === 0) return 0;

  // Filter out months with zero savings
  const nonZeroMonths = monthlySavings.filter(month => month.amount > 0);
  if (nonZeroMonths.length === 0) return 0;

  const totalSavings = nonZeroMonths.reduce((sum, month) => sum + month.amount, 0);
  return totalSavings / nonZeroMonths.length;
};

/**
 * Convert raw JSON data to typed MonthlyAmount array
 * Safely handles any format issues from the database
 */
export const convertToTypedSavingsData = (data: Json | null): MonthlyAmount[] => {
  // If we get null or non-array data, return empty data
  if (!data || typeof data !== 'object' || !Array.isArray(data)) {
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

        const year = typeof itemObj.year === 'number' && itemObj.year > 0
          ? itemObj.year
          : new Date().getFullYear();

        // Return a clean MonthlyAmount object
        return { month, year, amount };
      }

      return { month: 0, year: new Date().getFullYear(), amount: 0 };
    }).filter(item => item.month >= 1 && item.month <= 12);

    // Ensure complete data set for all 12 months
    if (typedData.length !== 12) {
      const completeData = initializeEmptySavingsData();

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
    console.error("Error converting JSON to typed savings data:", error);
    return initializeEmptySavingsData();
  }
};

/**
 * Initialize empty monthly savings data for all months
 */
export const initializeEmptySavingsData = (): MonthlyAmount[] => {
  const currentYear = new Date().getFullYear();
  return MONTHS.map((_, index) => ({
    month: index + 1,
    year: currentYear,
    amount: 0
  }));
};

/**
 * Ensure data consistency and completeness for monthly savings
 */
export const ensureCompleteSavingsData = (data: MonthlyAmount[]): MonthlyAmount[] => {
  // If empty or invalid, return completely empty data
  if (!Array.isArray(data) || data.length === 0) {
    return initializeEmptySavingsData();
  }

  // If we don't have exactly 12 months, fill in the missing ones
  if (data.length !== 12) {
    const completeData = initializeEmptySavingsData();

    // Update with any valid months we have
    data.forEach(item => {
      if (item.month >= 1 && item.month <= 12) {
        completeData[item.month - 1] = {
          month: item.month,
          year: item.year || new Date().getFullYear(),
          amount: typeof item.amount === 'number' ? item.amount : 0
        };
      }
    });

    return completeData;
  }

  // Ensure all items have proper numeric amounts
  const validatedData = data.map(item => ({
    month: item.month,
    year: item.year || new Date().getFullYear(),
    amount: typeof item.amount === 'number' ? item.amount : 0
  }));

  // Sort by month number to ensure consistent order
  return [...validatedData].sort((a, b) => a.month - b.month);
};
