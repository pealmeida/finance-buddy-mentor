import React, { useState, useEffect } from "react";
import { FinancialGoal } from "../../types/finance";
import { useGoals } from "../../hooks/useGoals";
import GoalList from "./GoalList";
import { Button } from "../ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useTranslation } from "react-i18next";
import GoalModal from "./GoalModal";
import { useResponsive } from "../../hooks/use-responsive";

interface GoalsManagementProps {
  goals: FinancialGoal[];
}

const GoalsManagement: React.FC<GoalsManagementProps> = ({ goals }) => {
  const { t } = useTranslation();
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isMobile } = useResponsive();

  // Debug logs
  useEffect(() => {}, [goals]);

  useEffect(() => {
    console.log("Modal state changed:", isModalOpen); // Debug log
  }, [isModalOpen]);

  const {
    goals: currentGoals,
    loading,
    error,
    addGoal,
    editGoal,
    removeGoal,
    refreshGoals,
  } = useGoals();
  const { toast } = useToast();

  // Prioritize profile goals over fetched goals
  // Use profile data if available, otherwise fall back to fetched data
  const effectiveGoals = goals && goals.length > 0 ? goals : currentGoals;

  // More debug logs
  useEffect(() => {}, [goals, currentGoals, effectiveGoals, loading, error]);

  useEffect(() => {
    // This effect should only be used to initialize the goals in the useGoals hook
    // if they are passed as props, not to trigger updates constantly.
    // The actual updates will be handled by addGoal, editGoal, removeGoal.
    // For now, we'll let useGoals manage its own state internally.
  }, [goals]);

  useEffect(() => {
    refreshGoals();
  }, [refreshGoals]);

  const handleAddGoal = () => {
    console.log("Add button clicked - Opening modal"); // Debug log
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal({
      ...goal,
      targetDate:
        goal.targetDate instanceof Date
          ? goal.targetDate
          : new Date(goal.targetDate),
    });
    setIsModalOpen(true);
  };

  const handleSaveGoal = async (goal: FinancialGoal) => {
    try {
      setIsSaving(true);
      const formattedGoal = {
        ...goal,
        targetDate:
          goal.targetDate instanceof Date
            ? goal.targetDate
            : new Date(goal.targetDate),
      };

      if (editingGoal) {
        await editGoal(formattedGoal);
        toast({
          title: t("goals.goalUpdated"),
          description: t("goals.goalUpdatedDescription"),
        });
      } else {
        await addGoal(formattedGoal);
        toast({
          title: t("goals.goalAdded"),
          description: t("goals.goalAddedDescription"),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      toast({
        title: t("common.error"),
        description: t("goals.savingError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await removeGoal(goalId);
      toast({
        title: t("goals.goalDeleted"),
        description: t("goals.goalDeletedDescription"),
      });
    } catch (err) {
      toast({
        title: t("common.error"),
        description: t("goals.deletingError"),
        variant: "destructive",
      });
    }
  };

  if (loading && !effectiveGoals.length) {
    return (
      <div className='flex justify-center items-center p-10'>
        <Loader2 className='h-8 w-8 animate-spin text-finance-blue' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 p-4 rounded-md text-red-700'>
        <p>
          {t("goals.loadingError")}: {error}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div
        className={`flex ${
          isMobile ? "flex-col items-start" : "justify-between items-center"
        } gap-4`}>
        <p className='text-gray-600'>{t("goals.goalsDescription")}</p>
        <Button
          onClick={handleAddGoal}
          className='flex items-center gap-2 font-medium px-6 py-3 text-sm bg-gradient-to-r from-finance-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg w-full md:w-auto'>
          <PlusCircle size={16} />
          {t("goals.addNewGoal")}
        </Button>
      </div>

      <GoalModal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingGoal(null);
          }
          setIsModalOpen(open);
        }}
        goal={editingGoal}
        onSave={handleSaveGoal}
        isSaving={isSaving}
      />

      {effectiveGoals.length === 0 ? (
        <div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-gray-500'>{t("goals.noGoalsYet")}</p>
          <p className='text-gray-400 text-sm mt-1'>{t("goals.clickToAdd")}</p>
        </div>
      ) : (
        <GoalList
          goals={effectiveGoals}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
        />
      )}
    </div>
  );
};

export default GoalsManagement;
