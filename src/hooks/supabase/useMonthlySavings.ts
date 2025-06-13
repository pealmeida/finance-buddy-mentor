import { useGetMonthlySavings } from './useGetMonthlySavings';
import { useSaveMonthlySavings } from './useSaveMonthlySavings';
import { MonthlySavings, MonthlyAmount } from '@/types/finance';

export function useMonthlySavings(userId: string, year: number) {
  const { data: monthlySavingsData, isLoading: fetchLoading, error: fetchError, fetchMonthlySavings, calculateAverageSavings, refetch } = useGetMonthlySavings(userId, year);
  const { saveMonthlySavings, loading: saveLoading } = useSaveMonthlySavings();

  // Combine the loading and error states from both hooks
  const isLoading = fetchLoading || saveLoading;
  const error = fetchError;

  return {
    monthlySavingsData,
    isLoading,
    error,
    fetchMonthlySavings,
    saveMonthlySavings,
    calculateAverageSavings,
    refetch
  };
}
