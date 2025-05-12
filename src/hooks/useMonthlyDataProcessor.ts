
import { useMemo } from 'react';
import { MonthlyAmount } from '@/types/finance';
import { safeMonthlyDataParse, ensureCompleteMonthlyData, calculateMonthlyAverage, calculateMonthlyTotal } from '@/utils/dataUtils';

/**
 * Hook to process monthly data consistently across different components
 * @param data Raw monthly data
 * @param skipEmptyMonths Whether to exclude months with zero amounts from calculations
 */
export function useMonthlyDataProcessor(data: any[], skipEmptyMonths: boolean = false) {
  // Convert to properly typed data
  const processedData = useMemo(() => {
    return safeMonthlyDataParse(data);
  }, [data]);
  
  // Ensure all 12 months are represented
  const completeData = useMemo(() => {
    return ensureCompleteMonthlyData(processedData);
  }, [processedData]);
  
  // Calculate statistics
  const total = useMemo(() => {
    return calculateMonthlyTotal(completeData);
  }, [completeData]);
  
  const average = useMemo(() => {
    return calculateMonthlyAverage(completeData, skipEmptyMonths);
  }, [completeData, skipEmptyMonths]);
  
  return {
    rawData: data,
    processedData,
    completeData,
    total,
    average
  };
}
