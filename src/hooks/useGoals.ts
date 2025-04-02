
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedGoals = await fetchUserGoals();
      setGoals(fetchedGoals);
    } catch (err) {
      console.error('Failed to load goals:', err);
      setError(err instanceof Error ? err.message : 'Failed to load financial goals');
      toast({
        title: 'Error',
        description: 'Failed to load your financial goals. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (newGoalData: Omit<FinancialGoal, 'id'>) => {
    try {
      const newGoal = await createGoal(newGoalData);
      setGoals(prev => [...prev, newGoal]);
      toast({
        title: 'Goal added',
        description: 'Your financial goal has been created successfully.'
      });
      return newGoal;
    } catch (err) {
      console.error('Failed to add goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to create your financial goal. Please try again.',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const editGoal = async (updatedGoal: FinancialGoal) => {
    try {
      await updateGoal(updatedGoal);
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      toast({
        title: 'Goal updated',
        description: 'Your financial goal has been updated successfully.'
      });
    } catch (err) {
      console.error('Failed to update goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to update your financial goal. Please try again.',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const removeGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      toast({
        title: 'Goal deleted',
        description: 'Your financial goal has been deleted successfully.'
      });
    } catch (err) {
      console.error('Failed to delete goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete your financial goal. Please try again.',
        variant: 'destructive'
      });
      throw err;
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
