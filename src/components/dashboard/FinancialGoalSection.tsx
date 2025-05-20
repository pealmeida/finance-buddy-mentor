
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { FinancialGoal } from '@/types/finance';

interface FinancialGoalSectionProps {
  goal: FinancialGoal | undefined;
}

const FinancialGoalSection: React.FC<FinancialGoalSectionProps> = ({ goal }) => {
  if (!goal) return null;
  
  const goalProgress = Math.min(goal.currentAmount / goal.targetAmount * 100, 100);
  
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">{goal.name}</p>
        <p className="text-sm text-gray-500">
          ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
        </p>
      </div>
      <Progress value={goalProgress} className="h-2 progress-animation" />
      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {goalProgress < 100 ? `${Math.round(goalProgress)}% completed` : "Goal achieved!"}
        </p>
        <p className="text-xs text-finance-blue">
          Target date: {new Date(goal.targetDate).toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

export default FinancialGoalSection;
