import React, { useState } from "react";
import { ExpenseItem, MonthlyAmount } from "../../types/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useTranslatedMonths } from "../../constants/months";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import ExpenseItemsTable from "./ExpenseItemsTable";
import ExpenseDeleteConfirmDialog from "./ExpenseDeleteConfirmDialog";
import ExpenseFormDialogs from "./ExpenseFormDialogs";
import ExpenseSummarySection, {
  ExpenseHeaderInfo,
} from "./ExpenseSummarySection";

interface DetailedExpensesListProps {
  monthData: MonthlyAmount;
  onAddItem: (item: Omit<ExpenseItem, "id">) => Promise<void>;
  onUpdateItem: (item: ExpenseItem) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  isMobile?: boolean;
}

const DetailedExpensesList: React.FC<DetailedExpensesListProps> = ({
  monthData,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonths } = useTranslatedMonths();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleAddExpense = async (expense: Omit<ExpenseItem, "id">) => {
    await onAddItem(expense);
    setIsAddDialogOpen(false);
  };

  const handleUpdateExpense = async (updatedExpense: ExpenseItem) => {
    await onUpdateItem(updatedExpense);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    await onDeleteItem(expenseToDelete);
    setIsDeleteConfirmOpen(false);
    setExpenseToDelete(null);
  };

  const items = monthData.items || [];
  const translatedMonths = getTranslatedMonths();
  const monthName = translatedMonths[monthData.month - 1];
  const calculatedTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const hasDiscrepancy = Math.abs(calculatedTotal - monthData.amount) > 0.01;

  return (
    <Card
      className={cn(
        "w-full",
        isMobile && "border-0 shadow-none bg-transparent"
      )}>
      <CardHeader className={cn(isMobile && "px-0 pt-4")}>
        <CardTitle
          className={cn(
            "flex justify-between items-center",
            isMobile ? "flex-col space-y-3 items-stretch" : "flex-row"
          )}>
          <span className={cn(isMobile ? "text-xl text-center" : "text-2xl")}>
            {t("expenses.editExpenses", "Edit Expenses")}
          </span>
          <Button
            size={isMobile ? "default" : "sm"}
            onClick={() => setIsAddDialogOpen(true)}
            className={cn(
              "flex items-center gap-2",
              isMobile && "w-full h-12 text-base font-medium"
            )}>
            <Plus className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
            {t("expenses.addExpense", "Add Expense")}
          </Button>
        </CardTitle>
        <div
          className={cn("text-sm text-muted-foreground", isMobile && "px-0")}>
          <ExpenseHeaderInfo
            monthAmount={monthData.amount}
            items={items}
            calculatedTotal={calculatedTotal}
            hasDiscrepancy={hasDiscrepancy}
          />
        </div>
      </CardHeader>
      <CardContent className={cn(isMobile && "px-0 space-y-6")}>
        <ExpenseItemsTable
          items={items}
          onEdit={setEditingExpense}
          onDelete={handleDeleteExpense}
        />
      </CardContent>

      <ExpenseFormDialogs
        isAddDialogOpen={isAddDialogOpen}
        onCloseAddDialog={() => setIsAddDialogOpen(false)}
        editingExpense={editingExpense}
        onCloseEditDialog={() => setEditingExpense(null)}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        monthNumber={monthData.month}
      />

      <ExpenseDeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Card>
  );
};

export default DetailedExpensesList;
