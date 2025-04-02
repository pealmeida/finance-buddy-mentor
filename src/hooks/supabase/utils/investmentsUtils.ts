
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Investment } from '@/types/finance';

/**
 * Handle investments updates for a user
 * @param userId The user's ID
 * @param investments Array of investments
 */
export const handleInvestments = async (userId: string, investments: Investment[]) => {
  try {
    // Get existing investments
    const { data: existingInvestments, error: fetchInvestmentsError } = await supabase
      .from('investments')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchInvestmentsError) throw new Error(`Error fetching existing investments: ${fetchInvestmentsError.message}`);
    
    const existingInvestmentIds = existingInvestments ? existingInvestments.map((i: any) => i.id) : [];
    const newInvestmentIds = investments.map(i => i.id);
    
    // Find investments to delete
    const investmentsToDelete = existingInvestmentIds.filter(id => !newInvestmentIds.includes(id));
    
    // Delete removed investments
    if (investmentsToDelete.length > 0) {
      const { error: deleteInvestmentsError } = await supabase
        .from('investments')
        .delete()
        .in('id', investmentsToDelete);
        
      if (deleteInvestmentsError) throw new Error(`Error deleting investments: ${deleteInvestmentsError.message}`);
    }
    
    // Upsert all current investments - ensure each investment has a valid ID
    const investmentsToUpsert = investments.map(investment => ({
      id: investment.id || uuidv4(),
      user_id: userId,
      type: investment.type,
      name: investment.name,
      value: investment.value,
      annual_return: investment.annualReturn || null
    }));
    
    const { error: upsertInvestmentsError } = await supabase
      .from('investments')
      .upsert(investmentsToUpsert, { onConflict: 'id' });
      
    if (upsertInvestmentsError) throw new Error(`Error updating investments: ${upsertInvestmentsError.message}`);
    
  } catch (err) {
    console.error("Error handling investments:", err);
    throw err;
  }
};
