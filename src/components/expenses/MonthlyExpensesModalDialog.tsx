import React, { useState, useCallback } from "react";
import { MonthlyAmount, ExpenseItem } from "../../types/finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import DetailedExpensesList from "./DetailedExpensesList";
import { useTranslatedMonths } from "../../constants/months";
import { useTranslation } from "react-i18next";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface MonthlyExpensesModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonthData: MonthlyAmount | null;
  onAddItem: (month: number, item: Omit<ExpenseItem, "id">) => Promise<void>;
  onUpdateItem: (month: number, item: ExpenseItem) => Promise<void>;
  onDeleteItem: (month: number, itemId: string) => Promise<void>;
}

const MonthlyExpensesModalDialog: React.FC<MonthlyExpensesModalDialogProps> = ({
  isOpen,
  onClose,
  selectedMonthData,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonths } = useTranslatedMonths();
  const { isMobile } = useResponsive();
  const translatedMonths = getTranslatedMonths();

  // Track if any data has been modified during this session
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Wrapped CRUD operations that track data changes
  const handleAddItem = useCallback(
    async (month: number, item: Omit<ExpenseItem, "id">) => {
      await onAddItem(month, item);
      setHasDataChanged(true);
    },
    [onAddItem]
  );

  const handleUpdateItem = useCallback(
    async (month: number, item: ExpenseItem) => {
      await onUpdateItem(month, item);
      setHasDataChanged(true);
    },
    [onUpdateItem]
  );

  const handleDeleteItem = useCallback(
    async (month: number, itemId: string) => {
      await onDeleteItem(month, itemId);
      setHasDataChanged(true);
    },
    [onDeleteItem]
  );

  // Handle closing with conditional refresh
  const handleClose = useCallback(() => {
    if (hasDataChanged) {
      setIsRefreshing(true);
      onClose();
      // Small delay to ensure the dialog closes before refresh
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      onClose();
    }
  }, [onClose, hasDataChanged]);

  // Reset hasDataChanged when dialog is opened
  React.useEffect(() => {
    if (isOpen) {
      setHasDataChanged(false);
    }
  }, [isOpen]);

  const getModalTitle = () => {
    if (!selectedMonthData) return t("expenses.monthlyExpenses");
    const monthName = translatedMonths[selectedMonthData.month - 1];
    return t("expenses.monthlyExpensesFor", { month: monthName });
  };

  // Render mobile sheet for mobile devices
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={handleClose}>
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
                  onClick={handleClose}
                  className='rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
                  <span className='sr-only'>{t("common.close", "Close")}</span>
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
                  onAddItem={(item) =>
                    handleAddItem(selectedMonthData.month, item)
                  }
                  onUpdateItem={(item) =>
                    handleUpdateItem(selectedMonthData.month, item)
                  }
                  onDeleteItem={(itemId) =>
                    handleDeleteItem(selectedMonthData.month, itemId)
                  }
                  isMobile={true}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Refreshing overlay for mobile */}
        {isRefreshing && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]'>
            <div className='bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-lg mx-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <p className='text-sm font-medium text-gray-700 text-center'>
                {t("common.savingChanges", "Saving changes...")}
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Render desktop dialog for desktop devices
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='w-full h-full sm:max-w-4xl sm:max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{getModalTitle()}</DialogTitle>
            <DialogDescription>
              {t(
                "expenses.editExpensesDescription",
                "Manage and edit your monthly expenses for the selected month."
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedMonthData && (
            <DetailedExpensesList
              monthData={selectedMonthData}
              onAddItem={(item) => handleAddItem(selectedMonthData.month, item)}
              onUpdateItem={(item) =>
                handleUpdateItem(selectedMonthData.month, item)
              }
              onDeleteItem={(itemId) =>
                handleDeleteItem(selectedMonthData.month, itemId)
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Refreshing overlay */}
      {isRefreshing && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]'>
          <div className='bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-lg'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <p className='text-sm font-medium text-gray-700'>
              {t("common.savingChanges", "Saving changes...")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MonthlyExpensesModalDialog;
