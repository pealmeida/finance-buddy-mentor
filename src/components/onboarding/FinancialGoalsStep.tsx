
import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import GoalForm from '@/components/goals/GoalForm';
import GoalList from '@/components/goals/GoalList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { FinancialGoal } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const FinancialGoalsStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal({
      ...goal,
      targetDate: goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate)
    });
    setIsFormOpen(true);
  };

  const handleSaveGoal = (goal: FinancialGoal) => {
    try {
      setIsSaving(true);
      
      // Make sure to format dates correctly
      const formattedGoal = {
        ...goal,
        targetDate: goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate)
      };

      let updatedGoals: FinancialGoal[];
      
      if (editingGoal) {
        // Edit existing goal
        updatedGoals = (profile.financialGoals || []).map(g => 
          g.id === formattedGoal.id ? formattedGoal : g
        );
        toast({
          title: "Goal Updated",
          description: "Your financial goal has been updated in your profile."
        });
      } else {
        // Add new goal with a unique ID
        const newGoal = {
          ...formattedGoal,
          id: uuidv4()
        };
        updatedGoals = [...(profile.financialGoals || []), newGoal];
        toast({
          title: "Goal Added",
          description: "Your new financial goal has been added to your profile."
        });
      }
      
      // Update onboarding context with updated goals
      updateProfile({
        ...profile,
        financialGoals: updatedGoals
      });
      
      // Reset form state
      setIsFormOpen(false);
      setEditingGoal(null);
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

  const handleDeleteGoal = (goalId: string) => {
    try {
      // Filter out the deleted goal
      const updatedGoals = (profile.financialGoals || []).filter(g => g.id !== goalId);
      
      // Update profile with filtered goals
      updateProfile({
        ...profile,
        financialGoals: updatedGoals
      });
      
      toast({
        title: "Goal Deleted",
        description: "Your financial goal has been removed from your profile."
      });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Financial Goals</h2>
        {!isFormOpen && (
          <Button 
            onClick={handleAddGoal} 
            className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
          >
            <PlusCircle size={16} />
            Add Goal
          </Button>
        )}
      </div>
      
      <p className="text-gray-600 mb-6">
        Add your short-term and long-term financial goals to create a roadmap for your financial future.
      </p>
      
      {isFormOpen ? (
        <GoalForm 
          goal={editingGoal} 
          onSave={handleSaveGoal} 
          onCancel={handleCancelEdit}
          isSaving={isSaving}
        />
      ) : isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-finance-blue" />
        </div>
      ) : (
        <GoalList
          goals={profile.financialGoals || []}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
        />
      )}
    </div>
  );
};

export default FinancialGoalsStep;
