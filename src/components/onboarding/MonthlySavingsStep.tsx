
import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import MonthlySavings from '@/components/savings/MonthlySavings';

const MonthlySavingsStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();
  
  const handleSave = (updatedProfile: any) => {
    if (updatedProfile.monthlySavings) {
      updateProfile({
        ...profile,
        monthlySavings: updatedProfile.monthlySavings
      });
    }
  };
  
  return (
    <MonthlySavings 
      profile={profile as any} 
      onSave={handleSave} 
    />
  );
};

export default MonthlySavingsStep;
