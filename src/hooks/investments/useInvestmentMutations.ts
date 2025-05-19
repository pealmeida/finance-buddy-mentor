
import { useState } from 'react';
import { Investment } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for investment mutation operations (add, update, delete)
 */
export const useInvestmentMutations = (
  userId: string | undefined,
  fetchInvestments: () => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Add a new investment
   */
  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    if (!userId) {
      toast({
        title: 'Cannot Save',
        description: 'You need to be logged in to save data',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const newInvestment = {
        id: uuidv4(),
        user_id: userId,
        type: investment.type,
        name: investment.name,
        value: investment.value,
        annual_return: investment.annualReturn
      };
      
      const { error: saveError } = await supabase
        .from('investments')
        .insert(newInvestment);
      
      if (saveError) throw new Error(saveError.message);
      
      toast({
        title: 'Investment Added',
        description: `${investment.name} has been added to your portfolio`,
      });
      
      // Refresh the investments list
      await fetchInvestments();
      
      return true;
    } catch (err) {
      console.error('Error adding investment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add investment');
      
      toast({
        title: 'Save Error',
        description: 'Could not save your investment. Please try again.',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing investment
   */
  const updateInvestment = async (investment: Investment) => {
    if (!userId) {
      toast({
        title: 'Cannot Update',
        description: 'You need to be logged in to update data',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: updateError } = await supabase
        .from('investments')
        .update({
          type: investment.type,
          name: investment.name,
          value: investment.value,
          annual_return: investment.annualReturn
        })
        .eq('id', investment.id)
        .eq('user_id', userId);
      
      if (updateError) throw new Error(updateError.message);
      
      toast({
        title: 'Investment Updated',
        description: `${investment.name} has been updated`,
      });
      
      // Refresh the investments list
      await fetchInvestments();
      
      return true;
    } catch (err) {
      console.error('Error updating investment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update investment');
      
      toast({
        title: 'Update Error',
        description: 'Could not update your investment. Please try again.',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an investment
   */
  const deleteInvestment = async (investmentId: string) => {
    if (!userId) {
      toast({
        title: 'Cannot Delete',
        description: 'You need to be logged in to delete data',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('investments')
        .delete()
        .eq('id', investmentId)
        .eq('user_id', userId);
      
      if (deleteError) throw new Error(deleteError.message);
      
      toast({
        title: 'Investment Deleted',
        description: 'The investment has been removed from your portfolio',
      });
      
      // Refresh the investments list
      await fetchInvestments();
      
      return true;
    } catch (err) {
      console.error('Error deleting investment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete investment');
      
      toast({
        title: 'Delete Error',
        description: 'Could not delete your investment. Please try again.',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    addInvestment,
    updateInvestment,
    deleteInvestment
  };
};
