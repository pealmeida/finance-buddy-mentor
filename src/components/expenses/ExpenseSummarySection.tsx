
import React from "react";
import { ExpenseItem } from "@/types/finance";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";

interface ExpenseSummarySectionProps {
  items: ExpenseItem[];
  monthAmount: number;
  calculatedTotal: number;
  hasDiscrepancy: boolean;
}

const ExpenseSummarySection: React.FC<ExpenseSummarySectionProps> = ({
  items,
  monthAmount,
  calculatedTotal,
  hasDiscrepancy,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Total Calculated:</span>
        <span className={hasDiscrepancy ? "text-orange-600" : "text-green-600"}>
          ${calculatedTotal.toLocaleString()}
        </span>
      </div>
      {hasDiscrepancy && (
        <div className="text-sm text-orange-600 mt-1">
          Note: There's a discrepancy between the stored total (${monthAmount.toLocaleString()}) 
          and calculated total. The calculated total will be saved.
        </div>
      )}
    </div>
  );
};

export const ExpenseHeaderInfo: React.FC<{
  monthAmount: number;
  items: ExpenseItem[];
  calculatedTotal: number;
  hasDiscrepancy: boolean;
}> = ({ monthAmount, items, calculatedTotal, hasDiscrepancy }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span>Total: ${monthAmount.toLocaleString()}</span>
        {items.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4" />
            <span>Calculated: ${calculatedTotal.toLocaleString()}</span>
            {hasDiscrepancy && (
              <Badge variant="destructive" className="text-xs">
                Discrepancy
              </Badge>
            )}
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div className="text-sm text-gray-600">
          {items.length} expense {items.length === 1 ? 'item' : 'items'} recorded
        </div>
      )}
    </div>
  );
};

export default ExpenseSummarySection;
