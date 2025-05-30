
import { MonthlyAmount } from "@/types/finance";
import { ExpenseAdjustmentUtils } from "../utils/expenseAdjustmentUtils";
import { SampleExpensesData } from "../data/sampleExpensesData";

/**
 * Service for enhancing monthly expenses data with sample expenses
 */
export class ExpensesDataEnhancementService {
  
  /**
   * Enhances monthly amount data with sample expenses for specific months
   * Only adds sample data for months 1, 2, and 3 that have amounts but no items
   */
  static enhanceDataWithSampleExpenses = (data: MonthlyAmount[]) => {
    return data.map((item) => {
      // Only enhance months 1, 2, 3 that have amounts but no existing items
      if ([1, 2, 3].includes(item.month) && item.amount > 0 && (!item.items || item.items.length === 0)) {
        const sampleItems = SampleExpensesData.getSampleExpensesForMonth(item.month);
        
        return {
          ...item,
          items: ExpenseAdjustmentUtils.adjustExpenseItemsToTotal(sampleItems, item.amount)
        };
      }
      return item;
    });
  };
}
