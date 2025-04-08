
import { useState, useCallback } from 'react';
import { useGetMonthlySavings } from './useGetMonthlySavings';
import { useSaveMonthlySavings } from './useSaveMonthlySavings';
import { MonthlySavings } from '@/types/finance';
import { calculateAverageSavings } from './utils/savingsUtils';

export function useMonthlySavings() {
  const { fetchMonthlySavings, loading: fetchLoading, error: fetchError } = useGetMonthlySavings();
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
