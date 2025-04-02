
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DebtDetail } from '@/types/finance';

/**
 * Handle debt details updates for a user
 * @param userId The user's ID
 * @param debtDetails Array of debt details
 */
export const handleDebtDetails = async (userId: string, debtDetails: DebtDetail[]) => {
  try {
    // Get existing debts
    const { data: existingDebts, error: fetchDebtsError } = await supabase
      .from('debt_details')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchDebtsError) throw new Error(`Error fetching existing debts: ${fetchDebtsError.message}`);
    
    const existingDebtIds = existingDebts ? existingDebts.map((d: any) => d.id) : [];
    const newDebtIds = debtDetails.map(d => d.id);
    
    // Find debts to delete
    const debtsToDelete = existingDebtIds.filter(id => !newDebtIds.includes(id));
    
    // Delete removed debts
    if (debtsToDelete.length > 0) {
      const { error: deleteDebtsError } = await supabase
        .from('debt_details')
        .delete()
        .in('id', debtsToDelete);
        
      if (deleteDebtsError) throw new Error(`Error deleting debts: ${deleteDebtsError.message}`);
    }
    
    // Upsert all current debts - ensure each debt has a valid ID
    const debtsToUpsert = debtDetails.map(debt => ({
      id: debt.id || uuidv4(),
      user_id: userId,
      type: debt.type,
      name: debt.name,
      amount: debt.amount,
      interest_rate: debt.interestRate
    }));
    
    const { error: upsertDebtsError } = await supabase
      .from('debt_details')
      .upsert(debtsToUpsert, { onConflict: 'id' });
      
    if (upsertDebtsError) throw new Error(`Error updating debts: ${upsertDebtsError.message}`);
    
  } catch (err) {
    console.error("Error handling debt details:", err);
    throw err;
  }
};
