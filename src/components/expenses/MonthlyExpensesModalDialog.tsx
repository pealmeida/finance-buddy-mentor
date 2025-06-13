import React from "react";
import { MonthlyAmount, ExpenseItem } from "@/types/finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DetailedExpensesList from "./DetailedExpensesList";
import { useTranslatedMonths } from "@/constants/months";
import { useTranslation } from "react-i18next";

interface MonthlyExpensesModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonthData: MonthlyAmount | null;
  onUpdateMonthData: (updatedData: MonthlyAmount) => void;
  onAddItem: (month: number, item: Omit<ExpenseItem, "id">) => Promise<void>;
  onUpdateItem: (month: number, item: ExpenseItem) => Promise<void>;
  onDeleteItem: (month: number, itemId: string) => Promise<void>;
}

const MonthlyExpensesModalDialog: React.FC<MonthlyExpensesModalDialogProps> = ({
  isOpen,
  onClose,
  selectedMonthData,
  onUpdateMonthData,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonths } = useTranslatedMonths();
  const translatedMonths = getTranslatedMonths();

  const getModalTitle = () => {
    if (!selectedMonthData) return t("expenses.monthlyExpenses");
    const monthName = translatedMonths[selectedMonthData.month - 1];
    return t("expenses.monthlyExpensesFor", { month: monthName });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        {selectedMonthData && (
          <DetailedExpensesList
            monthData={selectedMonthData}
            onUpdateMonthData={onUpdateMonthData}
            onAddItem={(item) => onAddItem(selectedMonthData.month, item)}
            onUpdateItem={(item) => onUpdateItem(selectedMonthData.month, item)}
            onDeleteItem={(itemId) =>
              onDeleteItem(selectedMonthData.month, itemId)
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyExpensesModalDialog;
