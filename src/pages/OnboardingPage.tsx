
import React from 'react';
import Header from '@/components/Header';
import UserOnboarding from '@/components/UserOnboarding';
import { UserProfile } from '@/types/finance';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';

interface OnboardingPageProps {
  onProfileComplete: (profile: UserProfile) => void;
  userProfile?: UserProfile;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onProfileComplete, userProfile }) => {
  const isEditMode = Boolean(userProfile);
  const { handleProfileComplete, isSubmitting } = useProfileCompletion(onProfileComplete);
  
  const handleComplete = (profile: UserProfile) => {
    handleProfileComplete(profile, isEditMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={isEditMode} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <OnboardingHeader isEditMode={isEditMode} />
          
          <UserOnboarding 
            onComplete={handleComplete} 
            existingProfile={userProfile} 
            isEditMode={isEditMode}
            isSaving={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
