import { MonthlyAmount, ExpenseItem } from '@/types/finance';

/**
 * Combines monthly summary data with detailed expense items
 */
export function combineExpensesData(
    monthlyData: MonthlyAmount[] | undefined,
    detailedExpenses: ExpenseItem[],
    year: number
): MonthlyAmount[] {
    // Initialize with empty data for all 12 months if no monthly data
    const baseData: MonthlyAmount[] = monthlyData || Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        amount: 0,
        items: [],
    }));

    // Group detailed expenses by month
    const expensesByMonth: { [month: number]: ExpenseItem[] } = {};

    console.log(`combineExpensesData: Processing ${detailedExpenses.length} expenses for year ${year}`);

    detailedExpenses.forEach(expense => {
        const date = new Date(expense.date);
        const expenseYear = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-based month

        console.log(`combineExpensesData: Processing expense ${expense.id} - date: ${expense.date}, year: ${expenseYear}, target year: ${year}`);

        // Only include expenses from the selected year
        if (expenseYear === year) {
            if (!expensesByMonth[month]) {
                expensesByMonth[month] = [];
            }
            expensesByMonth[month].push(expense);
            console.log(`combineExpensesData: Added expense to month ${month}`);
        } else {
            console.log(`combineExpensesData: Skipped expense from year ${expenseYear} (target: ${year})`);
        }
    });

    // Combine the data
    return baseData.map(monthData => {
        const monthItems = expensesByMonth[monthData.month] || [];
        const calculatedAmount = monthItems.reduce((sum, item) => sum + item.amount, 0);

        return {
            ...monthData,
            items: monthItems,
            // Use calculated amount from items if monthly summary doesn't exist or is 0
            amount: monthData.amount > 0 ? monthData.amount : calculatedAmount,
        };
    });
} 