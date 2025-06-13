import React from "react";
import { ExpenseItem } from "@/types/finance";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "react-i18next";

interface ExpenseSummarySectionProps {
  items: ExpenseItem[];
  monthAmount: number;
  hasDiscrepancy: boolean;
}

const ExpenseSummarySection: React.FC<ExpenseSummarySectionProps> = ({
  items,
  monthAmount,
  hasDiscrepancy,
}) => {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  const calculatedTotal = items.reduce((sum, item) => sum + item.amount, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className='mt-6 pt-4 border-t'>
      <div className='flex justify-between items-center text-lg font-semibold'>
        <span>{t("expenses.totalCalculated", "Total Calculated:")}</span>
        <span className={hasDiscrepancy ? "text-orange-600" : "text-green-600"}>
          {formatCurrency(calculatedTotal)}
        </span>
      </div>
      {hasDiscrepancy && (
        <div className='text-sm text-orange-600'>
          {t(
            "expenses.discrepancyWarning",
            "Warning: Calculated total differs from month amount"
          )}
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
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <span>
          {t("expenses.total", "Total")}: {formatCurrency(monthAmount)}
        </span>
      </div>
      {items.length > 0 && (
        <div className='text-sm text-gray-600'>
          {items.length} {t("expenses.expenseItem", "expense")}{" "}
          {items.length === 1
            ? t("expenses.item", "item")
            : t("expenses.items", "items")}{" "}
          {t("expenses.recorded", "recorded")}
        </div>
      )}
    </div>
  );
};

export default ExpenseSummarySection;
