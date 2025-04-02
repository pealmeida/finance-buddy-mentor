
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

      // Fetch monthly savings for the given user and year using raw SQL
      // This avoids type issues with the new table not being in the generated types
      const { data, error } = await supabase
        .from('monthly_savings')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // If no data found, return null
      if (!data) {
        return null;
      }

      // Transform to the client-side format
      return {
        id: data.id,
        userId: data.user_id,
        year: data.year,
        // Explicit casting to MonthlyAmount[] using type assertion
        data: (data.data as unknown) as MonthlyAmount[]
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

      // Use a raw upsert operation to avoid type issues
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
        throw error;
      }

      return true;
    } catch (err) {
      handleError(err, "Error saving monthly savings");
      return false;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return {
    loading: baseLoading || loading,
    fetchMonthlySavings,
    saveMonthlySavings
  };
}
