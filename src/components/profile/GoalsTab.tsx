
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/finance';
import { Target, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GoalsTabProps {
  profile?: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSubmitting?: boolean;
}

const GoalsTab: React.FC<GoalsTabProps> = ({ profile, onSave, isSubmitting }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goalsCount = profile?.financialGoals?.length || 0;

  const handleGoalsRedirect = () => {
    navigate('/goals');
  };

  const handleInvestmentsRedirect = () => {
    navigate('/full-profile', { state: { targetStep: 4 } }); // Investments step
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.financialGoals', 'Financial Goals')}</CardTitle>
        </CardHeader>
        <CardContent>
          {goalsCount > 0 ? (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {t('profile.goalsCount', 'You have {{count}} financial goal{{plural}} set up.', {
                  count: goalsCount,
                  plural: goalsCount !== 1 ? 's' : ''
                })}
              </p>
              <div className="flex items-center text-sm text-finance-blue">
                <Target className="h-4 w-4 mr-1" />
                <span>{t('profile.progressTracking', 'Progress tracking available on the dashboard')}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">
              {t('profile.goalsDescription', 'Define your financial goals to track progress and stay motivated.')}
            </p>
          )}
          <Button 
            variant="outline" 
            className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white"
            onClick={handleGoalsRedirect}
          >
            {t('profile.manageGoals', 'Manage Goals')}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.investmentPortfolio', 'Investment Portfolio')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            {t('profile.investmentsDescription', 'View and manage your investment portfolio.')}
          </p>
          <Button 
            variant="outline"
            className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white"
            onClick={handleInvestmentsRedirect}
          >
            {t('profile.manageInvestments', 'Manage Investments')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsTab;
