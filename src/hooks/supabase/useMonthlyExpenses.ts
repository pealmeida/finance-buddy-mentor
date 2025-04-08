
import { useState } from 'react';
import { useGetMonthlyExpenses } from './useGetMonthlyExpenses';
import { useSaveMonthlyExpenses } from './useSaveMonthlyExpenses';
import { MonthlyAmount } from '@/types/finance';

export function useMonthlyExpenses() {
  const { fetchMonthlyExpenses, calculateAverageExpenses, loading: fetchLoading } = useGetMonthlyExpenses();
  const { saveMonthlyExpenses, loading: saveLoading } = useSaveMonthlyExpenses();
  
  // Combine the loading states from both hooks
  const expensesLoading = fetchLoading || saveLoading;
  
  return {
    expensesLoading,
    fetchMonthlyExpenses,
    saveMonthlyExpenses,
    calculateAverageExpenses
  };
}
