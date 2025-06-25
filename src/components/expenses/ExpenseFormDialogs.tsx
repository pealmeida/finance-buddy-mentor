import React from "react";
import { ExpenseItem } from "@/types/finance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ExpenseItemForm from "./ExpenseItemForm";
import { useTranslatedMonths } from "@/constants/months";
import { useTranslation } from "react-i18next";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils";

interface ExpenseFormDialogsProps {
  isAddDialogOpen: boolean;
  onCloseAddDialog: () => void;
  editingExpense: ExpenseItem | null;
  onCloseEditDialog: () => void;
  onAddExpense: (expense: Omit<ExpenseItem, "id">) => void;
  onUpdateExpense: (updatedExpense: ExpenseItem) => void;
  monthNumber: number;
}

const ExpenseFormDialogs: React.FC<ExpenseFormDialogsProps> = ({
  isAddDialogOpen,
  onCloseAddDialog,
  editingExpense,
  onCloseEditDialog,
  onAddExpense,
  onUpdateExpense,
  monthNumber,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonths } = useTranslatedMonths();
  const { isMobile } = useResponsive();
  const translatedMonths = getTranslatedMonths();
  const monthName = translatedMonths[monthNumber - 1];

  const addExpenseTitle = t("expenses.addNewExpense", "Add New Expense");
  const addExpenseDescription =
    t("expenses.addDetailedExpenseFor", "Add a detailed expense item for") +
    " " +
    monthName +
    ".";

  const editExpenseTitle = t("expenses.editExpense", "Edit Expense");
  const editExpenseDescription = t(
    "expenses.updateExpenseDetails",
    "Update expense details"
  );

  if (isMobile) {
    return (
      <>
        {/* Add Expense Sheet (Mobile) */}
        <Sheet open={isAddDialogOpen} onOpenChange={onCloseAddDialog}>
          <SheetContent
            side='bottom'
            className={cn(
              "h-[85vh] w-full rounded-t-lg",
              "flex flex-col overflow-hidden"
            )}>
            <SheetHeader className='sticky top-0 bg-background border-b px-6 py-4'>
              <SheetTitle className='text-lg font-semibold'>
                {addExpenseTitle}
              </SheetTitle>
              <SheetDescription className='text-sm text-muted-foreground'>
                {addExpenseDescription}
              </SheetDescription>
            </SheetHeader>
            <div className='flex-1 overflow-y-auto px-6 pb-6'>
              <ExpenseItemForm
                onSubmit={onAddExpense}
                defaultMonth={monthNumber}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Expense Sheet (Mobile) */}
        <Sheet
          open={!!editingExpense}
          onOpenChange={(open) => !open && onCloseEditDialog()}>
          <SheetContent
            side='bottom'
            className={cn(
              "h-[85vh] w-full rounded-t-lg",
              "flex flex-col overflow-hidden"
            )}>
            <SheetHeader className='sticky top-0 bg-background border-b px-6 py-4'>
              <SheetTitle className='text-lg font-semibold'>
                {editExpenseTitle}
              </SheetTitle>
              <SheetDescription className='text-sm text-muted-foreground'>
                {editExpenseDescription}
              </SheetDescription>
            </SheetHeader>
            <div className='flex-1 overflow-y-auto px-6 pb-6'>
              {editingExpense && (
                <ExpenseItemForm
                  onSubmit={onUpdateExpense}
                  defaultMonth={monthNumber}
                  expense={editingExpense}
                  isEditing
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      {/* Add Expense Dialog (Desktop) */}
      <Dialog open={isAddDialogOpen} onOpenChange={onCloseAddDialog}>
        <DialogContent aria-describedby='add-expense-description'>
          <DialogHeader>
            <DialogTitle>{addExpenseTitle}</DialogTitle>
            <DialogDescription>{addExpenseDescription}</DialogDescription>
          </DialogHeader>
          <p id='add-expense-description'>
            {t(
              "expenses.addExpenseDescription",
              "Fill out the form to add a new expense."
            )}
          </p>
          <ExpenseItemForm onSubmit={onAddExpense} defaultMonth={monthNumber} />
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog (Desktop) */}
      <Dialog
        open={!!editingExpense}
        onOpenChange={(open) => !open && onCloseEditDialog()}>
        <DialogContent aria-describedby='edit-expense-description'>
          <DialogHeader>
            <DialogTitle>{editExpenseTitle}</DialogTitle>
            <DialogDescription>{editExpenseDescription}</DialogDescription>
          </DialogHeader>
          <p id='edit-expense-description'>
            {t(
              "expenses.editExpenseDescription",
              "Update the expense details below."
            )}
          </p>
          {editingExpense && (
            <ExpenseItemForm
              onSubmit={onUpdateExpense}
              defaultMonth={monthNumber}
              expense={editingExpense}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseFormDialogs;
