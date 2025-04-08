
import { useState, useCallback } from 'react';
import { UserProfile } from '@/types/finance';
import { useAuthCheck } from './expenses/useAuthCheck';
import { useMonthlyExpensesData } from './expenses/useMonthlyExpensesData';
import { useMonthlyExpensesHandlers } from './expenses/useMonthlyExpensesHandlers';
import { useMonthlyExpenses } from './supabase/useMonthlyExpenses';

/**
 * Main hook for managing monthly expenses state, composed of smaller, focused hooks
 */
export const useMonthlyExpensesState = (
  profile: UserProfile,
  onSave: (updatedProfile: UserProfile) => void,
  isSaving = false
) => {
  const { expensesLoading } = useMonthlyExpenses();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Authentication checking
  const { 
    authChecked, 
    error: authError, 
    checkAndRefreshAuth,
    setError
  } = useAuthCheck(profile?.id);
  
  // Data management
  const {
    expensesData,
    loadingData,
    error: dataError,
    refreshData,
    setExpensesData,
    setError: setDataError,
    initializeEmptyData
  } = useMonthlyExpensesData(
    profile, 
    selectedYear,
    authChecked,
    checkAndRefreshAuth,
    onSave
  );
  
  // Event handlers
  const {
    editingMonth,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    setEditingMonth
  } = useMonthlyExpensesHandlers(
    profile,
    selectedYear,
    expensesData,
    setExpensesData,
    checkAndRefreshAuth,
    onSave
  );

  // Year change handler
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
    // The data fetching will be triggered by the useEffect in useMonthlyExpensesData
  }, [setEditingMonth]);
  
  // Combine errors from auth and data fetching
  const error = authError || dataError;

  return {
    selectedYear,
    expensesData,
    editingMonth,
    loadingData,
    expensesLoading,
    error,
    authChecked,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    refreshData,
    setEditingMonth
  };
};
