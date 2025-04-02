
import { MonthlyAmount } from '@/types/finance';

/**
 * Calculate average monthly savings for a given year
 */
export const calculateAverageSavings = (monthlySavings: MonthlyAmount[] | undefined): number => {
  if (!monthlySavings || monthlySavings.length === 0) return 0;
  
  const totalSavings = monthlySavings.reduce((sum, month) => sum + month.amount, 0);
  return totalSavings / monthlySavings.length;
};
