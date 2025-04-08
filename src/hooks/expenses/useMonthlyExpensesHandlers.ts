
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useExpensesStateHandlers } from './utils/expensesStateHandlers';
import { useExpensesSaveHandler } from './utils/expensesSaveHandler';

/**
 * Hook to provide handlers for monthly expenses UI interactions
 */
export const useMonthlyExpensesHandlers = (
  profile: UserProfile,
  selectedYear: number,
  expensesData: MonthlyAmount[],
  setExpensesData: (data: MonthlyAmount[]) => void,
  checkAndRefreshAuth: () => Promise<boolean>,
  onSave: (updatedProfile: UserProfile) => void,
) => {
  // State management handlers
  const {
    editingMonth,
    setEditingMonth,
    handleSaveAmount,
    handleEditMonth
  } = useExpensesStateHandlers(expensesData, setExpensesData);
  
  // Save operation handlers
  const { handleSaveAll } = useExpensesSaveHandler(
    profile,
    selectedYear,
    expensesData,
    checkAndRefreshAuth,
    onSave
  );

  return {
    editingMonth,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    setEditingMonth
  };
};
