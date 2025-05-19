
import { useState } from 'react';
import { Investment } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for adding a new investment
 */
export const useAddInvestment = (
  userId: string | undefined,
  onSuccess?: () => Promise<void>
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
      
      // Refresh the investments list if callback provided
      if (onSuccess) {
        await onSuccess();
      }
      
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

  return {
    isLoading,
    error,
    addInvestment
  };
};
