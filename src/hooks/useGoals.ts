
import { useState, useCallback } from 'react';
import { FinancialGoal } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchUserGoals,
  createGoal,
  updateGoal,
  deleteGoal 
} from '@/services/goalService';

export const useGoals = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading goals...');
      const fetchedGoals = await fetchUserGoals();
      console.log('Loaded goals:', fetchedGoals);
      setGoals(fetchedGoals);
      return fetchedGoals;
    } catch (err) {
      console.error('Failed to load goals:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load financial goals';
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load your financial goals. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addGoal = async (newGoalData: Omit<FinancialGoal, 'id'>) => {
    try {
      setLoading(true);
      console.log('Adding new goal:', newGoalData);
      const newGoal = await createGoal(newGoalData);
      console.log('Goal created successfully:', newGoal);
      
      setGoals(prev => [...prev, newGoal]);
      
      toast({
        title: "Goal added",
        description: "Your financial goal has been created successfully."
      });
      
      return newGoal;
    } catch (err) {
      console.error('Failed to add goal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      toast({
        title: "Error",
        description: `Failed to create your financial goal: ${errorMessage}`,
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editGoal = async (updatedGoal: FinancialGoal) => {
    try {
      setLoading(true);
      console.log('Editing goal:', updatedGoal);
      
      await updateGoal(updatedGoal);
      console.log('Goal updated successfully');
      
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      
      toast({
        title: "Goal updated",
        description: "Your financial goal has been updated successfully."
      });
    } catch (err) {
      console.error('Failed to update goal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      toast({
        title: "Error",
        description: `Failed to update your financial goal: ${errorMessage}`,
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeGoal = async (goalId: string) => {
    try {
      setLoading(true);
      console.log('Removing goal:', goalId);
      
      await deleteGoal(goalId);
      console.log('Goal deleted successfully');
      
      setGoals(prev => prev.filter(g => g.id !== goalId));
      
      toast({
        title: "Goal deleted",
        description: "Your financial goal has been deleted successfully."
      });
    } catch (err) {
      console.error('Failed to delete goal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      toast({
        title: "Error",
        description: `Failed to delete your financial goal: ${errorMessage}`,
        variant: "destructive"
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    goals,
    loading,
    error,
    refreshGoals: loadGoals,
    addGoal,
    editGoal,
    removeGoal
  };
};
