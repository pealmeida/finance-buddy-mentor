
import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/finance';
import { useOnboarding } from '@/context/OnboardingContext';
import StepIndicator from './StepIndicator';
import OnboardingNavigation from './OnboardingNavigation';
import OnboardingStepContent from './OnboardingStepContent';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';

interface OnboardingContentProps {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isEditMode?: boolean;
  isSaving?: boolean;
}

const OnboardingContent: React.FC<OnboardingContentProps> = ({ 
  onComplete, 
  existingProfile, 
  isEditMode,
  isSaving = false 
}) => {
  const { profile, updateProfile } = useOnboarding();
  const [profileInitialized, setProfileInitialized] = useState(false);
  
  const {
    step,
    totalSteps,
    handleNextStep,
    handlePrevStep,
    handleCancel,
    handleComplete: completeOnboarding,
    isLoading
  } = useOnboardingFlow({
    onComplete,
    isEditMode,
    isSaving,
    existingProfile
  });

  // Initialize onboarding context with existing profile data if in edit mode
  useEffect(() => {
    if (isEditMode && existingProfile && !profileInitialized) {
      console.log('Initializing onboarding with existing profile:', existingProfile);
      updateProfile(existingProfile);
      setProfileInitialized(true);
    }
  }, [isEditMode, existingProfile, updateProfile, profileInitialized]);

  const handleComplete = () => {
    completeOnboarding(profile);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <StepIndicator currentStep={step} totalSteps={totalSteps} />
      
      <OnboardingStepContent currentStep={step} />
      
      <OnboardingNavigation 
        currentStep={step}
        totalSteps={totalSteps}
        onNext={handleNextStep}
        onPrevious={handlePrevStep}
        onComplete={handleComplete}
        onCancel={handleCancel}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OnboardingContent;
