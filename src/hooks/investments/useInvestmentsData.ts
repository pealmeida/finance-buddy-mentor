
import { useState, useEffect } from 'react';
import { Investment } from '@/types/finance';
import { useInvestmentsQuery } from './useInvestmentsQuery';
import { useInvestmentMutations } from './useInvestmentMutations';

/**
 * Main hook for managing investments data
 */
export const useInvestmentsData = (userId: string | undefined) => {
  const {
    investments,
    isLoading: isQueryLoading,
    error: queryError,
    fetchInvestments
  } = useInvestmentsQuery(userId);

  const {
    isLoading: isMutationLoading,
    error: mutationError,
    addInvestment,
    updateInvestment,
    deleteInvestment
  } = useInvestmentMutations(userId, fetchInvestments);

  // Combined loading and error states
  const isLoading = isQueryLoading || isMutationLoading;
  const error = queryError || mutationError;

  // Load data when component mounts or userId changes
  useEffect(() => {
    fetchInvestments();
  }, [userId]);

  return {
    investments,
    isLoading,
    error,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    fetchInvestments
  };
};

// Export the original hook for backward compatibility
export * from './useInvestmentsQuery';
export * from './useInvestmentMutations';
