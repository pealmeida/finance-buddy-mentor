
import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import MonthlySavings from '@/components/savings/MonthlySavings';
import { UserProfile } from '@/types/finance';

const MonthlySavingsStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();
  
  const handleSave = (updatedProfile: UserProfile) => {
    if (updatedProfile.monthlySavings) {
      updateProfile({
        ...profile,
        monthlySavings: updatedProfile.monthlySavings
      });
    }
  };
  
  return (
    <MonthlySavings 
      profile={profile as UserProfile} 
      onSave={handleSave} 
    />
  );
};

export default MonthlySavingsStep;
