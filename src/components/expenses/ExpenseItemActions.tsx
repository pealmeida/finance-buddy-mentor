
import React from "react";
import { ExpenseItem } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ExpenseItemActionsProps {
  expense: ExpenseItem;
  onEdit: (expense: ExpenseItem) => void;
  onDelete: (id: string) => void;
}

const ExpenseItemActions: React.FC<ExpenseItemActionsProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  return (
    <div className='flex justify-end gap-2'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => onEdit(expense)}>
        <Edit className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='text-red-500 hover:text-red-700 hover:bg-red-50'
        onClick={() => onDelete(expense.id)}>
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default ExpenseItemActions;
