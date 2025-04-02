
import { supabase } from '@/integrations/supabase/client';
import { FinancialGoal } from '@/types/finance';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch financial goals for the current user
 */
export const fetchUserGoals = async (): Promise<FinancialGoal[]> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      throw new Error('No authenticated user');
    }
    
    const userId = sessionData.session.user.id;
    console.log('Fetching goals for user:', userId);
    
    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    console.log('Fetched goals:', data);
    
    return data.map(goal => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      targetDate: new Date(goal.target_date),
      priority: goal.priority as 'low' | 'medium' | 'high'
    }));
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

/**
 * Create a new financial goal
 */
export const createGoal = async (goal: Omit<FinancialGoal, 'id'>): Promise<FinancialGoal> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      throw new Error('No authenticated user');
    }
    
    const userId = sessionData.session.user.id;
    console.log('Creating goal for user:', userId, 'with data:', goal);
    
    const newGoal = {
      id: uuidv4(),
      ...goal
    };
    
    const { data, error } = await supabase
      .from('financial_goals')
      .insert({
        id: newGoal.id,
        user_id: userId,
        name: newGoal.name,
        target_amount: newGoal.targetAmount,
        current_amount: newGoal.currentAmount,
        target_date: newGoal.targetDate instanceof Date 
          ? newGoal.targetDate.toISOString().split('T')[0] 
          : new Date(newGoal.targetDate).toISOString().split('T')[0],
        priority: newGoal.priority
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database error creating goal:', error);
      throw error;
    }
    
    console.log('Created goal:', data);
    
    return newGoal;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

/**
 * Update an existing financial goal
 */
export const updateGoal = async (goal: FinancialGoal): Promise<FinancialGoal> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      throw new Error('No authenticated user');
    }
    
    const userId = sessionData.session.user.id;
    console.log('Updating goal for user:', userId, 'with data:', goal);
    
    const { data, error } = await supabase
      .from('financial_goals')
      .update({
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        target_date: goal.targetDate instanceof Date 
          ? goal.targetDate.toISOString().split('T')[0] 
          : new Date(goal.targetDate).toISOString().split('T')[0],
        priority: goal.priority
      })
      .eq('id', goal.id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Database error updating goal:', error);
      throw error;
    }
    
    console.log('Updated goal:', data);
    
    return goal;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

/**
 * Delete a financial goal
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      throw new Error('No authenticated user');
    }
    
    const userId = sessionData.session.user.id;
    console.log('Deleting goal:', goalId, 'for user:', userId);
    
    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Database error deleting goal:', error);
      throw error;
    }
    
    console.log('Goal deleted successfully:', goalId);
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};
