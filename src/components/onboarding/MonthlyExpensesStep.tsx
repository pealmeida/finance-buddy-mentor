
import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import MonthlyExpenses from '@/components/expenses/MonthlyExpenses';
import { UserProfile } from '@/types/finance';
import { useTranslation } from 'react-i18next';

const MonthlyExpensesStep: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  
  const handleSave = (updatedProfile: UserProfile) => {
    if (updatedProfile.monthlyExpenses) {
      updateProfile({
        ...profile as UserProfile,
        monthlyExpenses: updatedProfile.monthlyExpenses
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t('expenses.monthlyExpenses', 'Monthly Expenses')}</h2>
      <p className="text-gray-600">
        {t('expenses.trackMonthlyExpenses', 'Track your monthly expenses to better understand your spending habits.')}
      </p>
      
      <MonthlyExpenses 
        profile={profile as UserProfile} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default MonthlyExpensesStep;
