
import { MonthlyAmount } from "@/types/finance";

/**
 * Utility functions for adjusting expense items to match target totals
 */
export class ExpenseAdjustmentUtils {
  
  /**
   * Adjusts expense items to match the monthly total
   * Uses proportional scaling with precise rounding for the last item
   */
  static adjustExpenseItemsToTotal = (items: any[], targetTotal: number) => {
    if (!items || items.length === 0) return items;
    
    const currentTotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    if (currentTotal === 0 || currentTotal === targetTotal) return items;
    
    const adjustmentFactor = targetTotal / currentTotal;
    
    return items.map((item, index) => {
      if (index === items.length - 1) {
        // For the last item, calculate the exact amount to reach the target total
        const adjustedTotal = items.slice(0, -1).reduce((sum, adjustedItem, i) => 
          sum + Math.round(items[i].amount * adjustmentFactor * 100) / 100, 0);
        return {
          ...item,
          amount: Math.round((targetTotal - adjustedTotal) * 100) / 100
        };
      } else {
        return {
          ...item,
          amount: Math.round(item.amount * adjustmentFactor * 100) / 100
        };
      }
    });
  };
}
