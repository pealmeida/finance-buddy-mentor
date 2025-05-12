
import { MonthlyAmount } from '@/types/finance';

/**
 * Type-safe number parsing
 * @param value Any value that should be converted to a number
 * @param fallback Default value if parsing fails
 * @returns Parsed number or fallback value
 */
export const safeNumberParse = (value: unknown, fallback: number = 0): number => {
  if (typeof value === 'number') return isNaN(value) ? fallback : value;
  if (typeof value === 'string') return parseFloat(value) || fallback;
  return fallback;
};

/**
 * Safely transforms data to MonthlyAmount[] with proper types
 * @param data Data that should be converted to MonthlyAmount[]
 * @returns Properly typed MonthlyAmount array
 */
export const safeMonthlyDataParse = (data: any[]): MonthlyAmount[] => {
  if (!Array.isArray(data)) return [];
  
  return data.map(item => ({
    month: safeNumberParse(item.month),
    amount: safeNumberParse(item.amount)
  }));
};

/**
 * Ensures all months (1-12) are present in the data
 * @param data MonthlyAmount array
 * @returns Complete MonthlyAmount array with all months
 */
export const ensureCompleteMonthlyData = (data: MonthlyAmount[]): MonthlyAmount[] => {
  const result: MonthlyAmount[] = [];
  
  // Initialize array with all months and zero amounts
  for (let month = 1; month <= 12; month++) {
    result.push({ month, amount: 0 });
  }
  
  // Fill in actual data where available
  data.forEach(item => {
    const month = safeNumberParse(item.month);
    if (month >= 1 && month <= 12) {
      result[month - 1].amount = safeNumberParse(item.amount);
    }
  });
  
  return result;
};

/**
 * Calculate average of monthly amounts
 * @param data MonthlyAmount array
 * @param skipZeros Whether to exclude zero amounts from averaging
 * @returns Average amount
 */
export const calculateMonthlyAverage = (data: MonthlyAmount[], skipZeros: boolean = false): number => {
  if (!data || data.length === 0) return 0;
  
  const filteredData = skipZeros 
    ? data.filter(item => item.amount > 0) 
    : data;
  
  if (filteredData.length === 0) return 0;
  
  const sum = filteredData.reduce((total, item) => total + safeNumberParse(item.amount), 0);
  return sum / filteredData.length;
};

/**
 * Calculate total of monthly amounts
 * @param data MonthlyAmount array
 * @returns Total amount
 */
export const calculateMonthlyTotal = (data: MonthlyAmount[]): number => {
  if (!data || data.length === 0) return 0;
  return data.reduce((total, item) => total + safeNumberParse(item.amount), 0);
};
