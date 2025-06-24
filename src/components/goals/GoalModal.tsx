import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import GoalForm from "./GoalForm";
import { FinancialGoal } from "@/types/finance";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./ErrorBoundary";

interface GoalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  goal: FinancialGoal | null;
  onSave: (goal: FinancialGoal) => Promise<void>;
  isSaving: boolean;
}

const GoalModal = ({
  isOpen,
  onOpenChange,
  goal,
  onSave,
  isSaving,
}: GoalModalProps) => {
  const { t } = useTranslation();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onOpenChange(false);
    } else {
      onOpenChange(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {goal ? t("goals.editGoal") : t("goals.addNewGoal")}
          </DialogTitle>
          <DialogDescription>
            {goal
              ? t(
                  "goals.editGoalDescription",
                  "Update your financial goal details."
                )
              : t(
                  "goals.addGoalDescription",
                  "Create a new financial goal to track your progress."
                )}
          </DialogDescription>
        </DialogHeader>
        <ErrorBoundary>
          <GoalForm
            goal={goal}
            onSave={onSave}
            onCancel={() => handleOpenChange(false)}
            isSaving={isSaving}
          />
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default GoalModal;
