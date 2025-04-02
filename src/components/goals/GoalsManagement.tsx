
import React, { useState } from 'react';
import { FinancialGoal } from '@/types/finance';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface GoalsManagementProps {
  goals: FinancialGoal[];
  onGoalsChange: (goals: FinancialGoal[]) => void;
}

const GoalsManagement: React.FC<GoalsManagementProps> = ({ goals, onGoalsChange }) => {
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Get current user id from supabase session
  const [userId, setUserId] = useState<string | null>(null);
  
  React.useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    getUser();
  }, []);

  const handleAddGoal = () => {
    // Initialize a new goal with default values
    const newGoal: FinancialGoal = {
      id: uuidv4(),
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date(),
      priority: 'medium'
    };
    
    setEditingGoal(newGoal);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to delete goals",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Delete from Supabase directly
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', goalId);
        
      if (error) throw new Error(error.message);
      
      // Update local state if Supabase deletion was successful
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      onGoalsChange(updatedGoals);
      
      toast({
        title: "Goal deleted",
        description: "Your financial goal has been deleted successfully"
      });
    } catch (err) {
      console.error("Failed to delete goal:", err);
      toast({
        title: "Error deleting goal",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGoal = async (goal: FinancialGoal) => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to save goals",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare goal data for Supabase (convert Date to string)
      const goalData = {
        id: goal.id,
        user_id: userId,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        target_date: goal.targetDate instanceof Date 
          ? goal.targetDate.toISOString().split('T')[0] 
          : new Date(goal.targetDate).toISOString().split('T')[0],
        priority: goal.priority
      };
      
      // Upsert to Supabase
      const { error } = await supabase
        .from('financial_goals')
        .upsert(goalData, { onConflict: 'id' });
        
      if (error) throw new Error(error.message);
      
      // Update local state if Supabase upsert was successful
      let updatedGoals: FinancialGoal[];
      
      if (goals.some(g => g.id === goal.id)) {
        // Update existing goal
        updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
      } else {
        // Add new goal
        updatedGoals = [...goals, goal];
      }
      
      onGoalsChange(updatedGoals);
      setEditingGoal(null);
      setIsFormOpen(false);
      
      toast({
        title: "Goal saved",
        description: "Your financial goal has been saved successfully"
      });
    } catch (err) {
      console.error("Failed to save goal:", err);
      toast({
        title: "Error saving goal",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setIsFormOpen(false);
  };

  return (
    <div>
      {isFormOpen ? (
        <GoalForm 
          goal={editingGoal} 
          onSave={handleSaveGoal} 
          onCancel={handleCancelEdit} 
          isSaving={isSaving} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Financial Goals</h2>
            <Button 
              onClick={handleAddGoal} 
              className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
            >
              <PlusCircle size={16} />
              Add New Goal
            </Button>
          </div>
          
          <GoalList 
            goals={goals} 
            onEdit={handleEditGoal} 
            onDelete={handleDeleteGoal} 
          />
        </>
      )}
    </div>
  );
};

export default GoalsManagement;
