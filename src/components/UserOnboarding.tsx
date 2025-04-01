
import React from 'react';
import { UserProfile } from '@/types/finance';
import { OnboardingProvider } from '@/context/OnboardingContext';
import OnboardingContent from './onboarding/OnboardingContent';

interface UserOnboardingProps {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isEditMode?: boolean;
  isSaving?: boolean;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ 
  onComplete, 
  existingProfile, 
  isEditMode, 
  isSaving 
}) => {
  return (
    <OnboardingProvider>
      <OnboardingContent 
        onComplete={onComplete} 
        existingProfile={existingProfile} 
        isEditMode={isEditMode}
        isSaving={isSaving} 
      />
    </OnboardingProvider>
  );
};

export default UserOnboarding;
