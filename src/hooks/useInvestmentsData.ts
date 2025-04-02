
import { useState, useEffect } from 'react';
import { Investment } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useInvestmentsData = (userId: string | undefined) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch investments data
  const fetchInvestments = async () => {
    if (!userId) {
      setInvestments([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId);
      
      if (fetchError) throw new Error(fetchError.message);
      
      if (data) {
        const mappedInvestments = data.map(item => ({
          id: item.id,
          type: item.type as 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other',
          name: item.name,
          value: item.value,
          annualReturn: item.annual_return || undefined
        }));
        setInvestments(mappedInvestments);
      }
    } catch (err) {
      console.error('Error fetching investments data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load investments data');
      
      toast({
        title: 'Data Loading Error',
        description: 'Could not load your investments data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new investment
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

  // Update an investment
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

  // Delete an investment
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
