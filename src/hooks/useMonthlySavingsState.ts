
import { useState, useCallback } from 'react';
import { UserProfile } from '@/types/finance';
import { useAuthCheck } from './savings/useAuthCheck';
import { useMonthlySavingsData } from './savings/useMonthlySavingsData';
import { useMonthlySavingsHandlers } from './savings/useMonthlySavingsHandlers';
import { useMonthlySavings } from './supabase/useMonthlySavings';

/**
 * Main hook for managing monthly savings state, composed of smaller, focused hooks
 */
export const useMonthlySavingsState = (
  profile: UserProfile,
  onSave: (updatedProfile: UserProfile) => void,
  isSaving = false
) => {
  const { savingsLoading } = useMonthlySavings();
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
    savingsData,
    loadingData,
    error: dataError,
    refreshData,
    setSavingsData,
    setError: setDataError,
    initializeEmptyData
  } = useMonthlySavingsData(
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
  } = useMonthlySavingsHandlers(
    profile,
    selectedYear,
    savingsData,
    setSavingsData,
    checkAndRefreshAuth,
    onSave
  );

  // Year change handler
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
    // The data fetching will be triggered by the useEffect in useMonthlySavingsData
  }, [setEditingMonth]);
  
  // Combine errors from auth and data fetching
  const error = authError || dataError;

  return {
    selectedYear,
    savingsData,
    editingMonth,
    loadingData,
    savingsLoading,
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
