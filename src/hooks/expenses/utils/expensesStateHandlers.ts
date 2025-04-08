
import { useState, useCallback } from 'react';
import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { toast } from "@/components/ui/use-toast";

/**
 * Hook to handle expenses state changes
 */
export const useExpensesStateHandlers = (
  expensesData: MonthlyAmount[],
  setExpensesData: (data: MonthlyAmount[]) => void
) => {
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  
  // Handle saving an updated amount for a specific month
  const handleSaveAmount = useCallback((month: number, amount: number) => {
    // Create a new array rather than mutating the existing one
    const updatedData = expensesData.map(item => 
      item.month === month ? { ...item, amount } : item
    );
    
    setExpensesData(updatedData);
    setEditingMonth(null);
    
    // Show a toast notification of the update
    toast({
      title: "Expenses Updated",
      description: `Your expenses for ${MONTHS[month - 1]} have been updated.`
    });
  }, [expensesData, setExpensesData]);

  // Handle setting the month to edit
  const handleEditMonth = useCallback((month: number) => {
    setEditingMonth(month);
  }, []);
  
  return {
    editingMonth,
    setEditingMonth,
    handleSaveAmount,
    handleEditMonth
  };
};
