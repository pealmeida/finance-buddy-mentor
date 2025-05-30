
import { useState, useCallback } from 'react';
import { MonthlyAmount } from '@/types/finance';
import { initializeEmptyExpensesData } from './utils/expensesDataUtils';

/**
 * Hook for managing expenses data state
 */
export const useExpensesDataState = () => {
  const [expensesData, setExpensesData] = useState<MonthlyAmount[]>(initializeEmptyExpensesData());
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataFetchFailed, setDataFetchFailed] = useState<boolean>(false);

  const initializeEmptyData = useCallback(() => {
    const emptyData = initializeEmptyExpensesData();
    console.log("Initializing empty expenses data for all months:", emptyData);
    setExpensesData(emptyData);
  }, []);

  return {
    expensesData,
    setExpensesData,
    loadingData,
    setLoadingData,
    error,
    setError,
    dataFetchFailed,
    setDataFetchFailed,
    initializeEmptyData
  };
};
