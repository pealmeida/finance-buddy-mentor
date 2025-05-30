
import React from 'react';
import { MonthlyAmount } from "@/types/finance";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DetailedExpensesList from "./DetailedExpensesList";
import { MONTHS } from "@/constants/months";

interface MonthlyExpensesModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonthData: MonthlyAmount | null;
  onUpdateMonthData: (updatedData: MonthlyAmount) => void;
}

const MonthlyExpensesModalDialog: React.FC<MonthlyExpensesModalDialogProps> = ({
  isOpen,
  onClose,
  selectedMonthData,
  onUpdateMonthData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedMonthData ? `${MONTHS[selectedMonthData.month - 1]} Expenses` : 'Monthly Expenses'}
          </DialogTitle>
        </DialogHeader>
        {selectedMonthData && (
          <DetailedExpensesList
            monthData={selectedMonthData}
            onUpdateMonthData={onUpdateMonthData}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyExpensesModalDialog;
