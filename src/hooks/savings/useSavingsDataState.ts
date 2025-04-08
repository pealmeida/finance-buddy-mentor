
import { useState } from 'react';
import { MonthlyAmount } from '@/types/finance';

/**
 * Hook to manage the state of savings data
 */
export const useSavingsDataState = () => {
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    savingsData,
    setSavingsData,
    loadingData,
    setLoadingData,
    error,
    setError
  };
};
