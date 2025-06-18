
import { DebtDetail } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch debt details for a user from Supabase
 */
export const fetchDebtDetails = async (userId: string): Promise<DebtDetail[]> => {
  try {
    const { data, error } = await supabase
      .from('debt_details')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching debt details: ${error.message}`);
    }

    // Transform the data to match our DebtDetail interface
    return data ? data.map((debt: any) => ({
      id: debt.id,
      type: debt.type as 'credit_card' | 'loan' | 'mortgage' | 'other',
      amount: debt.amount,
      interestRate: debt.interest_rate,
      minimumPayment: 0 // Set default since it's not stored in DB
    })) : [];
  } catch (error) {
    console.error('Error fetching debt details:', error);
    return [];
  }
};

/**
 * Save debt details to Supabase
 */
export const saveDebtDetails = async (userId: string, debtDetails: DebtDetail[]): Promise<boolean> => {
  try {
    // First, delete existing debt details for this user
    const { error: deleteError } = await supabase
      .from('debt_details')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      throw new Error(`Error deleting existing debt details: ${deleteError.message}`);
    }

    // Then insert the new debt details
    if (debtDetails.length > 0) {
      const debtDetailsToInsert = debtDetails.map(debt => ({
        user_id: userId,
        name: `${debt.type} debt`, // Generate a name based on type
        type: debt.type,
        amount: debt.amount,
        interest_rate: debt.interestRate
      }));

      const { error: insertError } = await supabase
        .from('debt_details')
        .insert(debtDetailsToInsert);

      if (insertError) {
        throw new Error(`Error inserting debt details: ${insertError.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving debt details:', error);
    return false;
  }
};
