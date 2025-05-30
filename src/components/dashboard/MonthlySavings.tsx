
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/context/CurrencyContext';

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
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  
  // Calculate savings progress based on average monthly savings
  const savingsProgress = Math.min(averageSavings / recommendedSavings * 100, 100);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">{t('savings.monthlySavings', 'Monthly Savings')}</p>
        <p className="text-sm text-gray-500">
          {loading ? t('common.loading', 'Loading...') : `${formatCurrency(averageSavings)} of ${formatCurrency(recommendedSavings)}`}
        </p>
      </div>
      <Progress value={savingsProgress} className="h-2 progress-animation" />
      <p className="mt-1 text-xs text-gray-500">
        {savingsProgress < 100 ? 
          `${Math.round(100 - savingsProgress)}% ${t('dashboard.belowRecommended', 'below recommended savings')}` : 
          t('dashboard.meetingRecommended', 'Meeting recommended savings')
        }
      </p>
    </div>
  );
};

export default MonthlySavings;
