
import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTranslation } from 'react-i18next';
import GoalForm from '@/components/goals/GoalForm';
import GoalList from '@/components/goals/GoalList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { FinancialGoal } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const FinancialGoalsStep: React.FC = () => {
  const { t } = useTranslation();
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
      
      const formattedGoal = {
        ...goal,
        targetDate: goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate)
      };

      let updatedGoals: FinancialGoal[];
      
      if (editingGoal) {
        updatedGoals = (profile.financialGoals || []).map(g => 
          g.id === formattedGoal.id ? formattedGoal : g
        );
        toast({
          title: t('goals.goalUpdated'),
          description: t('goals.goalUpdatedDescription')
        });
      } else {
        const newGoal = {
          ...formattedGoal,
          id: uuidv4()
        };
        updatedGoals = [...(profile.financialGoals || []), newGoal];
        toast({
          title: t('goals.goalAdded'),
          description: t('goals.goalAddedDescription')
        });
      }
      
      updateProfile({
        ...profile,
        financialGoals: updatedGoals
      });
      
      setIsFormOpen(false);
      setEditingGoal(null);
    } catch (err) {
      console.error("Error saving goal:", err);
      toast({
        title: t('common.error'),
        description: t('goals.errorSavingGoal'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    try {
      const updatedGoals = (profile.financialGoals || []).filter(g => g.id !== goalId);
      
      updateProfile({
        ...profile,
        financialGoals: updatedGoals
      });
      
      toast({
        title: t('goals.goalDeleted'),
        description: t('goals.goalDeletedDescription')
      });
    } catch (err) {
      console.error("Error deleting goal:", err);
      toast({
        title: t('common.error'),
        description: t('goals.errorDeletingGoal'),
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
        <h2 className="text-2xl font-semibold">{t('onboarding.financialGoals')}</h2>
        {!isFormOpen && (
          <Button 
            onClick={handleAddGoal} 
            className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
          >
            <PlusCircle size={16} />
            {t('onboarding.addGoal')}
          </Button>
        )}
      </div>
      
      <p className="text-gray-600 mb-6">
        {t('onboarding.financialGoalsDescription')}
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
