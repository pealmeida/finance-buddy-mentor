
import { useState } from 'react';
import { useGetMonthlyExpenses } from './useGetMonthlyExpenses';
import { useSaveMonthlyExpenses } from './useSaveMonthlyExpenses';
import { calculateAverageExpenses } from './utils/expensesUtils';
import { MonthlyAmount } from '@/types/finance';

export function useMonthlyExpenses() {
  const { fetchMonthlyExpenses, loading: fetchLoading } = useGetMonthlyExpenses();
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
