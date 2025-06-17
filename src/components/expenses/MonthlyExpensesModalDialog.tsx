import React from "react";
import { MonthlyAmount, ExpenseItem } from "@/types/finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DetailedExpensesList from "./DetailedExpensesList";
import { useTranslatedMonths } from "@/constants/months";
import { useTranslation } from "react-i18next";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils";

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
  const { isMobile } = useResponsive();
  const translatedMonths = getTranslatedMonths();

  const getModalTitle = () => {
    if (!selectedMonthData) return t("expenses.monthlyExpenses");
    const monthName = translatedMonths[selectedMonthData.month - 1];
    return t("expenses.monthlyExpensesFor", { month: monthName });
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
          <SheetHeader className='sticky top-0 z-10 bg-background border-b px-6 py-4'>
            <div className='flex justify-between items-center'>
              <SheetTitle className='text-lg font-semibold text-center'>
                {getModalTitle()}
              </SheetTitle>
              <button
                onClick={() => {
                  onClose?.();
                  window.location.reload();
                }}
                className='rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
                <span className='sr-only'>Fechar</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
            </div>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6 pb-6'>
            {selectedMonthData && (
              <DetailedExpensesList
                monthData={selectedMonthData}
                onUpdateMonthData={onUpdateMonthData}
                onAddItem={(item) => onAddItem(selectedMonthData.month, item)}
                onUpdateItem={(item) =>
                  onUpdateItem(selectedMonthData.month, item)
                }
                onDeleteItem={(itemId) =>
                  onDeleteItem(selectedMonthData.month, itemId)
                }
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
