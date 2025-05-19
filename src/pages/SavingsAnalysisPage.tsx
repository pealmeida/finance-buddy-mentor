import React from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useSimpleAuthCheck } from '@/hooks/useSimpleAuthCheck';
import MonthlyExpenses from '@/components/expenses/MonthlyExpenses';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MonthlyExpensesPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const SavingsAnalysisPage: React.FC<MonthlyExpensesPageProps> = ({
  userProfile,
  onProfileUpdate
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useSimpleAuthCheck(true);
  const { handleProfileComplete, isSubmitting } = useProfileCompletion(onProfileUpdate);

  const handleSave = (updatedProfile: UserProfile) => {
    handleProfileComplete(updatedProfile);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
          <p className="text-red-700 font-medium">{t('common.loading', 'Checking authentication...')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onboardingComplete={true} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">{t('expenses.monthlyExpenses', 'Monthly Expenses')}</h1>
            
            <div className="glass-panel rounded-2xl p-8">
              <MonthlyExpenses 
                profile={userProfile} 
                onSave={handleSave}
                isSaving={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SavingsAnalysisPage;
