
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { FinancialGoal } from '@/types/finance';

/**
 * Handle financial goals updates for a user
 * @param userId The user's ID
 * @param financialGoals Array of financial goals
 */
export const handleFinancialGoals = async (userId: string, financialGoals: FinancialGoal[]) => {
  try {
    // Get existing goals
    const { data: existingGoals, error: fetchGoalsError } = await supabase
      .from('financial_goals')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchGoalsError) throw new Error(`Error fetching existing goals: ${fetchGoalsError.message}`);
    
    const existingGoalIds = existingGoals ? existingGoals.map((g: any) => g.id) : [];
    const newGoalIds = financialGoals.map(g => g.id);
    
    // Find goals to delete (exist in DB but not in the updated profile)
    const goalsToDelete = existingGoalIds.filter(id => !newGoalIds.includes(id));
    
    // Delete removed goals
    if (goalsToDelete.length > 0) {
      const { error: deleteGoalsError } = await supabase
        .from('financial_goals')
        .delete()
        .in('id', goalsToDelete);
        
      if (deleteGoalsError) throw new Error(`Error deleting goals: ${deleteGoalsError.message}`);
    }
    
    // Upsert all current goals - ensure each goal has a valid ID
    const goalsToUpsert = financialGoals.map(goal => ({
      id: goal.id || uuidv4(),
      user_id: userId,
      name: goal.name,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
      target_date: goal.targetDate instanceof Date 
        ? goal.targetDate.toISOString().split('T')[0] 
        : (typeof goal.targetDate === 'string' ? goal.targetDate : new Date().toISOString().split('T')[0]),
      priority: goal.priority
    }));
    
    const { error: upsertGoalsError } = await supabase
      .from('financial_goals')
      .upsert(goalsToUpsert, { onConflict: 'id' });
      
    if (upsertGoalsError) throw new Error(`Error updating goals: ${upsertGoalsError.message}`);
    
  } catch (err) {
    console.error("Error handling financial goals:", err);
    throw err;
  }
};
