
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MonthlySavingsProps {
  averageSavings: number;
  recommendedSavings: number;
  loading: boolean;
}

const MonthlySavings: React.FC<MonthlySavingsProps> = ({
  averageSavings,
  recommendedSavings,
  loading
}) => {
  // Calculate savings progress based on average monthly savings
  const savingsProgress = Math.min(averageSavings / recommendedSavings * 100, 100);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">Monthly Savings</p>
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : `$${averageSavings.toLocaleString(undefined, {
            maximumFractionDigits: 0
          })} of $${recommendedSavings.toLocaleString(undefined, {
            maximumFractionDigits: 0
          })}`}
        </p>
      </div>
      <Progress value={savingsProgress} className="h-2 progress-animation" />
      <p className="mt-1 text-xs text-gray-500">
        {savingsProgress < 100 ? `${Math.round(100 - savingsProgress)}% below recommended savings` : "Meeting recommended savings"}
      </p>
    </div>
  );
};

export default MonthlySavings;
