
import React, { useState } from 'react';
import { FinancialGoal } from '@/types/finance';
import { useGoals } from '@/hooks/useGoals';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';

interface GoalsManagementProps {
  goals: FinancialGoal[];
  onGoalsChange: (goals: FinancialGoal[]) => void;
}

const GoalsManagement: React.FC<GoalsManagementProps> = ({ onGoalsChange }) => {
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { goals, loading, error, addGoal, editGoal, removeGoal } = useGoals();
  
  // Update parent component's state when goals change
  React.useEffect(() => {
    if (goals) {
      onGoalsChange(goals);
    }
  }, [goals, onGoalsChange]);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleSaveGoal = async (goal: FinancialGoal) => {
    try {
      if (editingGoal) {
        await editGoal(goal);
      } else {
        await addGoal(goal);
      }
      setIsFormOpen(false);
      setEditingGoal(null);
    } catch (err) {
      // Error is handled in the useGoals hook
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await removeGoal(goalId);
    } catch (err) {
      // Error is handled in the useGoals hook
    }
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setIsFormOpen(false);
  };

  if (loading) {
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
          onClick={() => window.location.reload()}
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
          isSaving={false}
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
