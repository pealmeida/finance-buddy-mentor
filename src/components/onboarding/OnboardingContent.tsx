
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
    if ((isEditMode || existingProfile) && !profileInitialized) {
      if (existingProfile) {
        console.log('Initializing onboarding with existing profile:', existingProfile);
        updateProfile(existingProfile);
        setProfileInitialized(true);
      }
    }
  }, [isEditMode, existingProfile, updateProfile, profileInitialized]);

  const handleComplete = () => {
    // Make sure we have a complete UserProfile with required fields
    if (!profile.id && existingProfile?.id) {
      // Use the id from existingProfile if profile doesn't have one
      const completeProfile: UserProfile = {
        ...profile,
        id: existingProfile.id,
        // Ensure other required properties are present
        email: profile.email || existingProfile.email,
        name: profile.name || existingProfile.name,
        age: profile.age ?? existingProfile.age,
        monthlyIncome: profile.monthlyIncome ?? existingProfile.monthlyIncome,
        riskProfile: profile.riskProfile || existingProfile.riskProfile,
        hasEmergencyFund: profile.hasEmergencyFund ?? existingProfile.hasEmergencyFund,
        hasDebts: profile.hasDebts ?? existingProfile.hasDebts,
        financialGoals: profile.financialGoals || existingProfile.financialGoals,
        investments: profile.investments || existingProfile.investments,
        debtDetails: profile.debtDetails || existingProfile.debtDetails
      };
      completeOnboarding(completeProfile);
    } else {
      // If we have a complete profile with an id, use it directly
      completeOnboarding(profile as UserProfile);
    }
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
