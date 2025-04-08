
import { useGetMonthlyExpenses } from './useGetMonthlyExpenses';
import { useSaveMonthlyExpenses } from './useSaveMonthlyExpenses';

/**
 * Combined hook for monthly expenses operations
 */
export function useMonthlyExpenses() {
  const { fetchMonthlyExpenses, calculateAverageExpenses, loading: fetchLoading, error: fetchError } = useGetMonthlyExpenses();
  const { saveMonthlyExpenses, loading: saveLoading, error: saveError } = useSaveMonthlyExpenses();
  
  // Combine the loading states from both hooks
  const expensesLoading = fetchLoading || saveLoading;
  const error = fetchError || saveError;
  
  return {
    expensesLoading,
    error,
    fetchMonthlyExpenses,
    saveMonthlyExpenses,
    calculateAverageExpenses
  };
}
