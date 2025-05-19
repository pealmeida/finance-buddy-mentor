
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface SavingsAnalysisStatsProps {
  totalSaved: number;
  averageSaved: number;
  profile: any;
  selectedYear: number;
}

const SavingsAnalysisStats: React.FC<SavingsAnalysisStatsProps> = ({
  totalSaved,
  averageSaved,
  profile,
  selectedYear
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('savings.analysis.totalSaved')}</CardTitle>
          <CardDescription>{t('common.amountSavedIn', 'Amount saved in')} {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">${totalSaved.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('savings.analysis.averageSaved')}</CardTitle>
          <CardDescription>{t('savings.averageSavingsPerMonth', 'Average savings per month')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">${averageSaved.toLocaleString()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('savings.yearlyGoal', 'Yearly Goal')}</CardTitle>
          <CardDescription>{t('savings.progressTowardsGoal', 'Progress towards your yearly goal')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-600">
            {profile?.monthlySavings ? t('common.onTrack', 'On Track') : t('goals.setGoal', 'Set a Goal')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsAnalysisStats;
