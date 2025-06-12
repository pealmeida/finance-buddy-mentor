import { MonthlyAmount } from '@/types/finance';

/**
 * Calculate average monthly expenses for a given year
 */
export const calculateAverageExpenses = (monthlyExpenses: MonthlyAmount[] | undefined): number => {
  if (!monthlyExpenses || monthlyExpenses.length === 0) return 0;

  // Filter out months with zero expenses
  const nonZeroMonths = monthlyExpenses.filter(month => month.amount > 0);
  if (nonZeroMonths.length === 0) return 0;

  const totalExpenses = nonZeroMonths.reduce((sum, month) => sum + month.amount, 0);
  return totalExpenses / nonZeroMonths.length;
};
