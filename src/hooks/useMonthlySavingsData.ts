
import { useState, useEffect } from 'react';
import { MonthlyAmount, MonthlySavings } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

export const useMonthlySavingsData = (userId: string | undefined, year: number) => {
  const [savings, setSavings] = useState<MonthlyAmount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize empty data with zero values for all months
  const getEmptyData = () => {
    return MONTHS.map((_, index) => ({
      month: index + 1,
      amount: 0
    }));
  };

  // Fetch savings data
  const fetchSavings = async () => {
    if (!userId) {
      setSavings(getEmptyData());
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('monthly_savings')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .maybeSingle();
      
      if (fetchError) throw new Error(fetchError.message);
      
      if (data) {
        // Parse data if it's a string or use as is if it's already an object
        const savingsData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
        setSavings(savingsData);
      } else {
        // No data found, initialize with empty data
        setSavings(getEmptyData());
      }
    } catch (err) {
      console.error('Error fetching savings data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load savings data');
      setSavings(getEmptyData());
      
      toast({
        title: 'Data Loading Error',
        description: 'Could not load your savings data. Using empty values instead.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save savings data
  const saveSavings = async () => {
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
      
      // Cast the savings array to Json type for Supabase
      const savingsData = savings as unknown as Json;
      
      const { error: saveError } = await supabase
        .from('monthly_savings')
        .upsert({
          id: uuidv4(),
          user_id: userId,
          year,
          data: savingsData
        }, {
          onConflict: 'user_id,year'
        });
      
      if (saveError) throw new Error(saveError.message);
      
      toast({
        title: 'Savings Saved',
        description: `Your savings for ${year} have been saved successfully`,
      });
      
      return true;
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
      
      toast({
        title: 'Save Error',
        description: 'Could not save your savings data. Please try again.',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an individual month's amount
  const updateMonthAmount = (month: number, amount: number) => {
    setSavings(prev => 
      prev.map(item => item.month === month ? { ...item, amount } : item)
    );
  };

  // Calculate average monthly savings
  const getAverageSavings = (): number => {
    if (!savings || savings.length === 0) return 0;
    const total = savings.reduce((sum, item) => sum + item.amount, 0);
    return total / savings.length;
  };

  // Load data when component mounts or year/userId changes
  useEffect(() => {
    fetchSavings();
  }, [userId, year]);

  return {
    savings,
    isLoading,
    error,
    updateMonthAmount,
    saveSavings,
    fetchSavings,
    getAverageSavings
  };
};
