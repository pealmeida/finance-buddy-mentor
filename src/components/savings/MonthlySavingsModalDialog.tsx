import React from "react";
import { MonthlyAmount } from "../../types/finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import DetailedSavingsList from "./DetailedSavingsList";
import { useTranslatedMonths } from "../../constants/months";
import { useTranslation } from "react-i18next";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface MonthlySavingsModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonthData: MonthlyAmount | null;
  onUpdateMonthData: (updatedData: MonthlyAmount) => void;
  onSaveAmount: (month: number, amount: number) => void;
  monthlyIncome?: number;
  monthlyExpenses?: MonthlyAmount[];
}

const MonthlySavingsModalDialog: React.FC<MonthlySavingsModalDialogProps> = ({
  isOpen,
  onClose,
  selectedMonthData,
  onUpdateMonthData,
  onSaveAmount,
  monthlyIncome,
  monthlyExpenses,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonths } = useTranslatedMonths();
  const { isMobile } = useResponsive();
  const translatedMonths = getTranslatedMonths();

  const getModalTitle = () => {
    if (!selectedMonthData) return t("savings.monthlySavings");
    const monthName = translatedMonths[selectedMonthData.month - 1];
    return t("savings.monthlySavingsFor", { month: monthName });
  };

  // Render mobile sheet for mobile devices
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side='bottom'
          className={cn(
            "h-[95vh] w-full rounded-t-lg border-t",
            "flex flex-col overflow-hidden",
            "p-0"
          )}>
          <div className='flex flex-col space-y-2 text-center sm:text-left sticky top-0 z-10 bg-background border-b px-6 py-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-foreground text-lg font-semibold text-center'>
                {getModalTitle()}
              </h2>
              <button
                onClick={onClose}
                className='text-muted-foreground hover:text-foreground'
                aria-label='Close'>
                ✕
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto px-6 pb-6'>
            {selectedMonthData && (
              <DetailedSavingsList
                monthData={selectedMonthData}
                onUpdateMonthData={onUpdateMonthData}
                onSaveAmount={onSaveAmount}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                isMobile={true}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Render desktop dialog for desktop devices
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full h-full sm:max-w-4xl sm:max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        {selectedMonthData && (
          <DetailedSavingsList
            monthData={selectedMonthData}
            onUpdateMonthData={onUpdateMonthData}
            onSaveAmount={onSaveAmount}
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpenses}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MonthlySavingsModalDialog;
