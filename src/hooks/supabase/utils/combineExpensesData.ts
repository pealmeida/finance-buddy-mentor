
import { MonthlyAmount } from '@/types/finance';

/**
 * Combine detailed expenses data into monthly totals
 */
export const combineExpensesData = (detailedExpenses: any[], year: number = new Date().getFullYear()): MonthlyAmount[] => {
  // Initialize 12 months with zero amounts
  const monthlyTotals: MonthlyAmount[] = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    year: year,
    amount: 0,
    items: []
  }));

  // Group expenses by month and calculate totals
  detailedExpenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    const month = expenseDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
    
    if (month >= 1 && month <= 12) {
      const monthIndex = month - 1;
      monthlyTotals[monthIndex].amount += expense.amount;
      monthlyTotals[monthIndex].items?.push(expense);
    }
  });

  return monthlyTotals;
};
