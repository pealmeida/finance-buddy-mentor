
import React, { useState, useEffect } from 'react';
import { FinancialGoal } from '@/types/finance';
import { useGoals } from '@/hooks/useGoals';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GoalsManagementProps {
  goals: FinancialGoal[];
  onGoalsChange: (goals: FinancialGoal[]) => void;
}

const GoalsManagement: React.FC<GoalsManagementProps> = ({ onGoalsChange }) => {
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { goals, loading, error, addGoal, editGoal, removeGoal, refreshGoals } = useGoals();
  const { toast } = useToast();
  
  // Update parent component's state when goals change
  useEffect(() => {
    if (goals) {
      console.log('Goals updated in GoalsManagement:', goals);
      onGoalsChange(goals);
    }
  }, [goals, onGoalsChange]);

  // Ensure goals are loaded when component mounts
  useEffect(() => {
    console.log('Component mounted, loading goals...');
    const loadData = async () => {
      try {
        await refreshGoals();
      } catch (err) {
        console.error("Error loading goals on mount:", err);
      }
    };
    
    loadData();
  }, [refreshGoals]);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    console.log('Editing goal:', goal);
    setEditingGoal({
      ...goal,
      // Ensure targetDate is a Date object
      targetDate: goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate)
    });
    setIsFormOpen(true);
  };

  const handleSaveGoal = async (goal: FinancialGoal) => {
    try {
      setIsSaving(true);
      console.log('Saving goal:', goal);
      
      // Make sure to format dates correctly
      const formattedGoal = {
        ...goal,
        targetDate: goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate)
      };
      
      if (editingGoal) {
        console.log('Editing existing goal');
        await editGoal(formattedGoal);
        toast({
          title: "Goal Updated",
          description: "Your financial goal has been successfully updated."
        });
      } else {
        console.log('Adding new goal');
        await addGoal(formattedGoal);
        toast({
          title: "Goal Added",
          description: "Your new financial goal has been created."
        });
      }
      
      setIsFormOpen(false);
      setEditingGoal(null);
      
      // Refresh goals list to ensure we have the latest data
      refreshGoals();
      
    } catch (err) {
      console.error("Error saving goal:", err);
      toast({
        title: "Error",
        description: "There was a problem saving your goal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      console.log('Deleting goal:', goalId);
      await removeGoal(goalId);
    } catch (err) {
      console.error("Error deleting goal:", err);
      toast({
        title: "Error",
        description: "There was a problem deleting your goal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setIsFormOpen(false);
  };

  const handleRefreshGoals = async () => {
    try {
      await refreshGoals();
      toast({
        title: "Goals Refreshed",
        description: "Your financial goals have been refreshed."
      });
    } catch (err) {
      console.error("Error refreshing goals:", err);
    }
  };

  if (loading && goals.length === 0) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-finance-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700">
        <p>Error loading goals: {error}</p>
        <Button 
          variant="outline"
          onClick={() => refreshGoals()}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefreshGoals}
                className="flex items-center gap-1"
                disabled={loading}
              >
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </Button>
              <Button 
                onClick={handleAddGoal} 
                className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
              >
                <PlusCircle size={16} />
                Add New Goal
              </Button>
            </div>
          </div>
          
          {goals.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">You don't have any financial goals yet.</p>
              <p className="text-gray-400 text-sm mt-1">Click the 'Add New Goal' button to get started.</p>
            </div>
          ) : (
            <GoalList 
              goals={goals} 
              onEdit={handleEditGoal} 
              onDelete={handleDeleteGoal} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default GoalsManagement;
