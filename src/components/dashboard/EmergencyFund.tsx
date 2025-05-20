
import React from 'react';
import { Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EmergencyFundProps {
  currentEmergencyFund: number;
  emergencyFundTarget: number;
  emergencyFundPercentage: number;
}

const EmergencyFund: React.FC<EmergencyFundProps> = ({
  currentEmergencyFund,
  emergencyFundTarget,
  emergencyFundPercentage
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-finance-blue" />
          <p className="font-medium">Emergency Fund</p>
        </div>
        <p className="text-sm text-gray-500">
          ${currentEmergencyFund.toLocaleString(undefined, {
            maximumFractionDigits: 0
          })} 
          of ${emergencyFundTarget.toLocaleString(undefined, {
            maximumFractionDigits: 0
          })}
        </p>
      </div>
      <Progress value={emergencyFundPercentage} className="h-2 progress-animation" />
      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {emergencyFundPercentage < 100 ? `${Math.round(emergencyFundPercentage)}% of 6 months target` : "Emergency fund complete!"}
        </p>
        <p className="text-xs text-finance-blue">
          Recommended: 6 months of expenses
        </p>
      </div>
    </div>
  );
};

export default EmergencyFund;
