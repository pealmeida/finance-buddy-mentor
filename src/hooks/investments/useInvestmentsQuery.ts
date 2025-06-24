import { useState } from 'react';
import { Investment } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for fetching investments data from Supabase
 */
export const useInvestmentsQuery = (userId: string | undefined) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Fetch investments data from Supabase
   */
  const fetchInvestments = async () => {
    if (!userId) {
      console.log("No userId provided, setting empty investments");
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
      } else {
        console.log("No data returned from Supabase");
        setInvestments([]);
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

  return {
    investments,
    setInvestments,
    isLoading,
    setIsLoading,
    error,
    setError,
    fetchInvestments
  };
};
