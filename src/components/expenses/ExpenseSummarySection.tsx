
import React from "react";
import { ExpenseItem } from "@/types/finance";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "react-i18next";

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
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex justify-between items-center text-lg font-semibold">
        <span>{t('expenses.totalCalculated', 'Total Calculated:')}</span>
        <span className={hasDiscrepancy ? "text-orange-600" : "text-green-600"}>
          {formatCurrency(calculatedTotal)}
        </span>
      </div>
      {hasDiscrepancy && (
        <div className="text-sm text-orange-600 mt-1">
          {t('expenses.discrepancyNote', 'Note: There\'s a discrepancy between the stored total')} ({formatCurrency(monthAmount)}) 
          {t('expenses.discrepancyNote2', 'and calculated total. The calculated total will be saved.')}
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
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span>{t('expenses.total', 'Total')}: {formatCurrency(monthAmount)}</span>
        {items.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4" />
            <span>{t('expenses.calculated', 'Calculated')}: {formatCurrency(calculatedTotal)}</span>
            {hasDiscrepancy && (
              <Badge variant="destructive" className="text-xs">
                {t('expenses.discrepancy', 'Discrepancy')}
              </Badge>
            )}
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div className="text-sm text-gray-600">
          {items.length} {t('expenses.expenseItem', 'expense')} {items.length === 1 ? t('expenses.item', 'item') : t('expenses.items', 'items')} {t('expenses.recorded', 'recorded')}
        </div>
      )}
    </div>
  );
};

export default ExpenseSummarySection;
