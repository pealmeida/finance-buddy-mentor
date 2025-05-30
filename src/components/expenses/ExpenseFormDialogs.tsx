
import React from "react";
import { ExpenseItem } from "@/types/finance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExpenseItemForm from "./ExpenseItemForm";
import { MONTHS } from "@/constants/months";

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
  const monthName = MONTHS[monthNumber - 1];

  return (
    <>
      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onCloseAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Add a detailed expense item for {monthName}.
            </DialogDescription>
          </DialogHeader>
          <ExpenseItemForm
            onSubmit={onAddExpense}
            defaultMonth={monthNumber}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && onCloseEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the expense details.</DialogDescription>
          </DialogHeader>
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
