
import { MonthlyAmount } from "@/types/finance";
import { ExpensesDataEnhancementService } from "./services/ExpensesDataEnhancementService";
import { ExpenseAdjustmentUtils } from "./utils/expenseAdjustmentUtils";
import { SampleExpensesData } from "./data/sampleExpensesData";

/**
 * Main data enhancer class that orchestrates expense data enhancement
 * @deprecated - This class is maintained for backward compatibility.
 * Use ExpensesDataEnhancementService directly for new implementations.
 */
export class MonthlyExpensesDataEnhancer {
  
  // Re-export the main enhancement function for backward compatibility
  static enhanceDataWithSampleExpenses = ExpensesDataEnhancementService.enhanceDataWithSampleExpenses;
  
  // Re-export utility functions for backward compatibility
  static adjustExpenseItemsToTotal = ExpenseAdjustmentUtils.adjustExpenseItemsToTotal;
  static getSampleExpensesForMonth = SampleExpensesData.getSampleExpensesForMonth;
}
