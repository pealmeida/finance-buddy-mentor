
import { useState, useMemo } from 'react';
import { useAddInvestment } from './mutations/useAddInvestment';
import { useUpdateInvestment } from './mutations/useUpdateInvestment';
import { useDeleteInvestment } from './mutations/useDeleteInvestment';

/**
 * Hook for investment mutation operations (add, update, delete)
 * Combines all investment mutation hooks into a single interface
 */
export const useInvestmentMutations = (
  userId: string | undefined,
  fetchInvestments: () => Promise<void>
) => {
  // Initialize individual mutation hooks
  const { 
    isLoading: isAddLoading, 
    error: addError, 
    addInvestment 
  } = useAddInvestment(userId, fetchInvestments);

  const { 
    isLoading: isUpdateLoading,
    error: updateError,
    updateInvestment
  } = useUpdateInvestment(userId, fetchInvestments);

  const { 
    isLoading: isDeleteLoading,
    error: deleteError,
    deleteInvestment
  } = useDeleteInvestment(userId, fetchInvestments);

  // Combine loading states and errors
  const isLoading = isAddLoading || isUpdateLoading || isDeleteLoading;
  const error = addError || updateError || deleteError;

  return {
    isLoading,
    error,
    addInvestment,
    updateInvestment,
    deleteInvestment
  };
};
