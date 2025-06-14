import React, { useState } from "react";
import { ExpenseItem, MonthlyAmount } from "@/types/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslatedMonths } from "@/constants/months";
import { useTranslation } from "react-i18next";
import ExpenseItemsTable from "./ExpenseItemsTable";
import ExpenseDeleteConfirmDialog from "./ExpenseDeleteConfirmDialog";
import ExpenseFormDialogs from "./ExpenseFormDialogs";
import ExpenseSummarySection, {
  ExpenseHeaderInfo,
} from "./ExpenseSummarySection";

interface DetailedExpensesListProps {
  monthData: MonthlyAmount;
  onUpdateMonthData: (updatedData: MonthlyAmount) => void;
  onAddItem: (item: Omit<ExpenseItem, "id">) => Promise<void>;
  onUpdateItem: (item: ExpenseItem) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
}

const DetailedExpensesList: React.FC<DetailedExpensesListProps> = ({
  monthData,
  onUpdateMonthData,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
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
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <span>{t("expenses.editExpenses", "Edit Expenses")}</span>
          <Button
            size='sm'
            onClick={() => setIsAddDialogOpen(true)}
            className='flex items-center gap-1'>
            <Plus className='h-4 w-4' />
            {t("expenses.addExpense", "Add Expense")}
          </Button>
        </CardTitle>
        <CardDescription>
          <ExpenseHeaderInfo
            monthAmount={monthData.amount}
            items={items}
            calculatedTotal={calculatedTotal}
            hasDiscrepancy={hasDiscrepancy}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExpenseItemsTable
          items={items}
          onEdit={setEditingExpense}
          onDelete={handleDeleteExpense}
        />

        <ExpenseSummarySection
          items={items}
          monthAmount={monthData.amount}
          hasDiscrepancy={hasDiscrepancy}
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
