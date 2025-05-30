
import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import MonthlySavings from '@/components/savings/MonthlySavings';
import { UserProfile } from '@/types/finance';
import { useTranslation } from 'react-i18next';

const MonthlySavingsStep: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  
  const handleSave = (updatedProfile: UserProfile) => {
    if (updatedProfile.monthlySavings) {
      updateProfile({
        ...profile as UserProfile,
        monthlySavings: updatedProfile.monthlySavings
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t('savings.monthlySavings', 'Monthly Savings')}</h2>
      <p className="text-gray-600">
        {t('savings.trackMonthlySavings', 'Track your monthly savings to visualize your progress throughout the year.')}
      </p>
      
      <MonthlySavings 
        profile={profile as UserProfile} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default MonthlySavingsStep;
