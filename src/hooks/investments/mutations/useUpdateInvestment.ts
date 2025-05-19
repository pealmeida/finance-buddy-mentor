
import { useState } from 'react';
import { Investment } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for updating an existing investment
 */
export const useUpdateInvestment = (
  userId: string | undefined,
  onSuccess?: () => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      
      // Refresh the investments list if callback provided
      if (onSuccess) {
        await onSuccess();
      }
      
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

  return {
    isLoading,
    error,
    updateInvestment
  };
};
