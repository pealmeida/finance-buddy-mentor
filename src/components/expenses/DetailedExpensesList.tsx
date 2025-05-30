
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
import { v4 as uuidv4 } from "uuid";
import { MONTHS } from "@/constants/months";
import { useDetailedExpensesCalculation } from "@/hooks/expenses/useDetailedExpensesCalculation";
import ExpenseItemsTable from "./ExpenseItemsTable";
import ExpenseDeleteConfirmDialog from "./ExpenseDeleteConfirmDialog";
import ExpenseFormDialogs from "./ExpenseFormDialogs";
import ExpenseSummarySection, { ExpenseHeaderInfo } from "./ExpenseSummarySection";

interface DetailedExpensesListProps {
  monthData: MonthlyAmount;
  onUpdateMonthData: (updatedData: MonthlyAmount) => void;
}

const DetailedExpensesList: React.FC<DetailedExpensesListProps> = ({
  monthData,
  onUpdateMonthData,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const {
    addExpenseItem,
    updateExpenseItem,
    removeExpenseItem,
    calculateTotalFromItems
  } = useDetailedExpensesCalculation();

  const handleAddExpense = (expense: Omit<ExpenseItem, "id">) => {
    const newExpense: ExpenseItem = {
      ...expense,
      id: uuidv4(),
    };

    const updatedMonthData = addExpenseItem(monthData, newExpense);
    onUpdateMonthData(updatedMonthData);
    setIsAddDialogOpen(false);
  };

  const handleUpdateExpense = (updatedExpense: ExpenseItem) => {
    const updatedMonthData = updateExpenseItem(monthData, updatedExpense);
    onUpdateMonthData(updatedMonthData);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!expenseToDelete) return;

    const updatedMonthData = removeExpenseItem(monthData, expenseToDelete);
    onUpdateMonthData(updatedMonthData);

    setIsDeleteConfirmOpen(false);
    setExpenseToDelete(null);
  };

  const items = monthData.items || [];
  const monthName = MONTHS[monthData.month - 1];
  const calculatedTotal = calculateTotalFromItems(items);
  const hasDiscrepancy = Math.abs(calculatedTotal - monthData.amount) > 0.01;

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <span>Detailed Expenses for {monthName}</span>
          <Button
            size='sm'
            onClick={() => setIsAddDialogOpen(true)}
            className='flex items-center gap-1'>
            <Plus className='h-4 w-4' />
            Add Expense
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
          calculatedTotal={calculatedTotal}
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
