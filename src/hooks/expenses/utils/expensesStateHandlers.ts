
import { useState, useCallback } from 'react';
import { MonthlyAmount } from '@/types/finance';
import { useExpensesToasts } from './expensesToastUtils';

/**
 * Hook to handle expenses state changes
 */
export const useExpensesStateHandlers = (
  expensesData: MonthlyAmount[],
  setExpensesData: (data: MonthlyAmount[]) => void
) => {
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const { showAmountUpdatedToast } = useExpensesToasts();
  
  // Handle saving an updated amount for a specific month
  const handleSaveAmount = useCallback((month: number, amount: number) => {
    // Create a new array rather than mutating the existing one
    const updatedData = expensesData.map(item => 
      item.month === month ? { ...item, amount } : item
    );
    
    setExpensesData(updatedData);
    setEditingMonth(null);
    
    // Show a toast notification of the update
    showAmountUpdatedToast(month);
  }, [expensesData, setExpensesData, showAmountUpdatedToast]);

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
