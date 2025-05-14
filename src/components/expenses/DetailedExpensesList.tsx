import React, { useState } from "react";
import { ExpenseItem, MonthlyAmount } from "@/types/finance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Edit, Trash2, XCircle } from "lucide-react";
import ExpenseItemForm from "./ExpenseItemForm";
import { v4 as uuidv4 } from "uuid";
import { MONTHS } from "@/constants/months";

interface DetailedExpensesListProps {
  monthData: MonthlyAmount;
  onUpdateMonthData: (updatedData: MonthlyAmount) => void;
}

const DetailedExpensesList: React.FC<DetailedExpensesListProps> = ({
  monthData,
  onUpdateMonthData,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleAddExpense = (expense: Omit<ExpenseItem, "id">) => {
    const newExpense: ExpenseItem = {
      ...expense,
      id: uuidv4(),
    };

    const items = [...(monthData.items || []), newExpense];
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    onUpdateMonthData({
      ...monthData,
      amount: totalAmount,
      items,
    });

    setIsAddDialogOpen(false);
  };

  const handleUpdateExpense = (updatedExpense: ExpenseItem) => {
    if (!monthData.items) return;

    const updatedItems = monthData.items.map((item) =>
      item.id === updatedExpense.id ? updatedExpense : item
    );

    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    onUpdateMonthData({
      ...monthData,
      amount: totalAmount,
      items: updatedItems,
    });

    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!expenseToDelete || !monthData.items) return;

    const updatedItems = monthData.items.filter(
      (item) => item.id !== expenseToDelete
    );
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    onUpdateMonthData({
      ...monthData,
      amount: totalAmount,
      items: updatedItems,
    });

    setIsDeleteConfirmOpen(false);
    setExpenseToDelete(null);
  };

  const getCategoryBadgeColor = (category: ExpenseItem["category"]) => {
    const colors: Record<ExpenseItem["category"], string> = {
      housing: "bg-blue-100 text-blue-800",
      food: "bg-green-100 text-green-800",
      transportation: "bg-yellow-100 text-yellow-800",
      utilities: "bg-purple-100 text-purple-800",
      entertainment: "bg-pink-100 text-pink-800",
      healthcare: "bg-cyan-100 text-cyan-800",
      other: "bg-gray-100 text-gray-800",
    };

    return colors[category];
  };

  const items = monthData.items || [];
  const monthName = MONTHS[monthData.month - 1];

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
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
          Total: ${monthData.amount.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <XCircle className='mx-auto h-10 w-10 mb-2 text-gray-400' />
            <p>No detailed expenses recorded for this month.</p>
            <p className='text-sm mt-1'>Click "Add Expense" to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {format(new Date(expense.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryBadgeColor(expense.category)}>
                      {expense.category.charAt(0).toUpperCase() +
                        expense.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right font-medium'>
                    ${expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setEditingExpense(expense)}>
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-500 hover:text-red-700 hover:bg-red-50'
                        onClick={() => handleDeleteExpense(expense.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Add a detailed expense item for {monthName}.
            </DialogDescription>
          </DialogHeader>
          <ExpenseItemForm
            onSubmit={handleAddExpense}
            defaultMonth={monthData.month}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the expense details.</DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <ExpenseItemForm
              onSubmit={handleUpdateExpense}
              defaultMonth={monthData.month}
              expense={editingExpense}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DetailedExpensesList;
