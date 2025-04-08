
import { useState, useCallback } from 'react';
import { useGetMonthlySavings } from './useGetMonthlySavings';
import { useSaveMonthlySavings } from './useSaveMonthlySavings';
import { MonthlySavings, MonthlyAmount } from '@/types/finance';

export function useMonthlySavings() {
  const { fetchMonthlySavings, loading: fetchLoading, error: fetchError, calculateAverageSavings } = useGetMonthlySavings();
  const { saveMonthlySavings, loading: saveLoading } = useSaveMonthlySavings();
  
  // Combine the loading and error states from both hooks
  const loading = fetchLoading || saveLoading;
  const error = fetchError;
  
  return {
    loading,
    error,
    fetchMonthlySavings,
    saveMonthlySavings,
    calculateAverageSavings
  };
}
