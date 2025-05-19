
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for deleting an investment
 */
export const useDeleteInvestment = (
  userId: string | undefined,
  onSuccess?: () => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      
      // Refresh the investments list if callback provided
      if (onSuccess) {
        await onSuccess();
      }
      
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
    deleteInvestment
  };
};
