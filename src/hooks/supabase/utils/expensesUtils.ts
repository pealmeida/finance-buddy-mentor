
import { MonthlyAmount } from '@/types/finance';

/**
 * Calculate average monthly expenses for a given year
 */
export const calculateAverageExpenses = (monthlyExpenses: MonthlyAmount[] | undefined): number => {
  if (!monthlyExpenses || monthlyExpenses.length === 0) return 0;
  
  const totalExpenses = monthlyExpenses.reduce((sum, month) => sum + month.amount, 0);
  return totalExpenses / monthlyExpenses.length;
};
