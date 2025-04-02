
import { useState } from 'react';
import { useSupabaseBase } from './useSupabaseBase';
import { MonthlySavings, MonthlyAmount } from '@/types/finance';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

export function useMonthlySavings() {
  const { supabase, loading: baseLoading, setLoading, handleError } = useSupabaseBase();
  const [loading, setLocalLoading] = useState(false);
  
  /**
   * Fetch monthly savings for a user and year
   * @param userId User ID
   * @param year Year to fetch data for
   * @returns Monthly savings data or null if error
   */
  const fetchMonthlySavings = async (
    userId: string, 
    year: number
  ): Promise<MonthlySavings | null> => {
    try {
      setLocalLoading(true);
      setLoading(true);

      console.log(`Fetching monthly savings for user ${userId} and year ${year}`);
      
      // Fetch monthly savings for the given user and year
      const { data, error } = await supabase
        .from('monthly_savings')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .maybeSingle();

      if (error) {
        console.error("Database error when fetching monthly savings:", error);
        throw error;
      }

      // If no data found, return null
      if (!data) {
        console.log(`No savings data found for user ${userId} and year ${year}`);
        return null;
      }

      console.log("Monthly savings data retrieved:", data);
      
      // Transform to the client-side format with safer type handling
      return {
        id: data.id,
        userId: data.user_id,
        year: data.year,
        // Parse JSON data if it's a string, otherwise use as is
        data: typeof data.data === 'string' 
          ? JSON.parse(data.data) as MonthlyAmount[]
          : (data.data as unknown) as MonthlyAmount[]
      };
    } catch (err) {
      handleError(err, "Error fetching monthly savings");
      return null;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  /**
   * Save monthly savings data
   * @param monthlySavings Monthly savings data to save
   * @returns Boolean indicating success
   */
  const saveMonthlySavings = async (
    monthlySavings: MonthlySavings
  ): Promise<boolean> => {
    try {
      setLocalLoading(true);
      setLoading(true);

      // Ensure we have an id
      if (!monthlySavings.id) {
        monthlySavings.id = uuidv4();
      }

      console.log("Attempting to save monthly savings:", monthlySavings);

      // Use a raw upsert operation with explicit conflict target
      const { error } = await supabase
        .from('monthly_savings')
        .upsert({
          id: monthlySavings.id,
          user_id: monthlySavings.userId,
          year: monthlySavings.year,
          // Cast the MonthlyAmount[] to Json using type assertion
          data: monthlySavings.data as unknown as Json
        }, {
          onConflict: 'user_id,year'
        });

      if (error) {
        console.error("Database error when saving monthly savings:", error);
        throw error;
      }

      console.log("Monthly savings saved successfully");
      return true;
    } catch (err) {
      handleError(err, "Error saving monthly savings");
      return false;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  /**
   * Calculate average monthly savings for a given year
   */
  const calculateAverageSavings = (monthlySavings: MonthlyAmount[] | undefined): number => {
    if (!monthlySavings || monthlySavings.length === 0) return 0;
    
    const totalSavings = monthlySavings.reduce((sum, month) => sum + month.amount, 0);
    return totalSavings / monthlySavings.length;
  };

  return {
    loading: baseLoading || loading,
    fetchMonthlySavings,
    saveMonthlySavings,
    calculateAverageSavings
  };
}
