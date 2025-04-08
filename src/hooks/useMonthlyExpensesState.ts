
import { useState, useCallback } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useAuthCheck } from './expenses/useAuthCheck';
import { useMonthlyExpensesData } from './expenses/useMonthlyExpensesData';
import { useMonthlyExpensesHandlers } from './expenses/useMonthlyExpensesHandlers';

/**
 * Main hook for the Monthly Expenses feature
 * This hook combines all the other hooks to provide a single interface
 */
export const useMonthlyExpensesState = (
  profile: UserProfile,
  onSave: (updatedProfile: UserProfile) => void,
  isSaving: boolean = false
) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [expensesLoading, setExpensesLoading] = useState(false);
  
  // Authentication check
  const {
    authChecked,
    error: authError,
    checkAndRefreshAuth,
    setError
  } = useAuthCheck(profile?.id);
  
  // Fetch and manage expenses data
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
  
  // Combine errors from auth and data fetching
  const error = authError || dataError;
  
  // UI handlers
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
  
  // Handle year change
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);
  
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
