
import { useState } from 'react';
import { useGetMonthlySavings } from './useGetMonthlySavings';
import { useSaveMonthlySavings } from './useSaveMonthlySavings';
import { calculateAverageSavings } from './utils/savingsUtils';
import { MonthlyAmount } from '@/types/finance';

export function useMonthlySavings() {
  const { fetchMonthlySavings, loading: fetchLoading } = useGetMonthlySavings();
  const { saveMonthlySavings, loading: saveLoading } = useSaveMonthlySavings();
  
  // Combine the loading states from both hooks
  const savingsLoading = fetchLoading || saveLoading;
  
  return {
    savingsLoading,
    fetchMonthlySavings,
    saveMonthlySavings,
    calculateAverageSavings
  };
}
