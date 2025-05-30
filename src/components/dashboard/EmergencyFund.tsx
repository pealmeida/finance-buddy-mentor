
import React from 'react';
import { Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/context/CurrencyContext';

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
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-finance-blue" />
          <p className="font-medium">{t('dashboard.emergencyFund', 'Emergency Fund')}</p>
        </div>
        <p className="text-sm text-gray-500">
          {formatCurrency(currentEmergencyFund)} of {formatCurrency(emergencyFundTarget)}
        </p>
      </div>
      <Progress value={emergencyFundPercentage} className="h-2 progress-animation" />
      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {emergencyFundPercentage < 100 ? 
            `${Math.round(emergencyFundPercentage)}% ${t('dashboard.emergencyFundProgress', 'of 6 months target')}` : 
            t('dashboard.emergencyFundTarget', 'Emergency fund complete!')
          }
        </p>
        <p className="text-xs text-finance-blue">
          {t('dashboard.emergencyFundRecommended', 'Recommended: 6 months of expenses')}
        </p>
      </div>
    </div>
  );
};

export default EmergencyFund;
