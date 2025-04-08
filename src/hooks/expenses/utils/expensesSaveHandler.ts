
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, MonthlyAmount, MonthlyExpenses } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useExpensesToasts } from './expensesToastUtils';

/**
 * Hook to handle saving expenses data
 */
export const useExpensesSaveHandler = (
  profile: UserProfile,
  selectedYear: number,
  expensesData: MonthlyAmount[],
  checkAndRefreshAuth: () => Promise<boolean>,
  onSave: (updatedProfile: UserProfile) => void
) => {
  const { saveMonthlyExpenses } = useMonthlyExpenses();
  const { 
    showAuthenticationErrorToast,
    showSessionExpiredToast,
    showSaveSuccessToast,
    showSaveErrorToast
  } = useExpensesToasts();

  // Handle saving all expenses data
  const handleSaveAll = useCallback(async () => {
    try {
      if (!profile || !profile.id) {
        showAuthenticationErrorToast();
        return;
      }
      
      // Refresh auth token before saving
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        showSessionExpiredToast();
        return;
      }
      
      console.log("Starting save process for monthly expenses");
      // Use existing ID or generate a new one
      const monthlyExpensesId = profile.monthlyExpenses?.id || uuidv4();
      
      const updatedExpenses: MonthlyExpenses = {
        id: monthlyExpensesId,
        userId: profile.id,
        year: selectedYear,
        data: expensesData
      };
      
      console.log("About to save monthly expenses:", updatedExpenses);
      
      // Save to Supabase
      const success = await saveMonthlyExpenses(updatedExpenses);
      
      if (success) {
        console.log("Monthly expenses saved successfully");
        
        // Update local state
        const updatedProfile = {
          ...profile,
          monthlyExpenses: updatedExpenses
        };
        
        onSave(updatedProfile);
        showSaveSuccessToast(selectedYear);
      } else {
        throw new Error("Failed to save data");
      }
    } catch (err) {
      console.error("Error saving expenses data:", err);
      showSaveErrorToast();
    }
  }, [
    checkAndRefreshAuth, 
    onSave, 
    profile, 
    saveMonthlyExpenses, 
    expensesData, 
    selectedYear, 
    showAuthenticationErrorToast,
    showSessionExpiredToast,
    showSaveSuccessToast,
    showSaveErrorToast
  ]);

  return {
    handleSaveAll
  };
};
