import React, { useEffect, useState, useCallback } from "react";
import { UserProfile } from "../../types/finance";
import { useOnboarding } from "../../context/OnboardingContext";
import { StepIndicator } from "./StepIndicator";
import OnboardingNavigation from "./OnboardingNavigation";
import OnboardingStepContent from "./OnboardingStepContent";
import { useOnboardingFlow } from "../../hooks/useOnboardingFlow";
import { ReviewModal } from "./ReviewModal";
import { useToast } from "../../components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface OnboardingContentProps {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isEditMode?: boolean;
  isSaving?: boolean;
  onOnboardingComplete: () => void;
}

interface OnboardingStep {
  id: number;
  label: string;
  component: React.ReactNode;
}

const OnboardingContent: React.FC<OnboardingContentProps> = ({
  onComplete,
  existingProfile,
  isEditMode,
  isSaving = false,
  onOnboardingComplete,
}) => {
  const { profile, updateProfile } = useOnboarding();
  const [profileInitialized, setProfileInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const hasMonthlyExpenses = useCallback(() => {
    if (!profile.monthlyExpenses || profile.monthlyExpenses.data.length === 0) {
      return false;
    }
    return profile.monthlyExpenses.data.some(
      (expense) => (expense.amount || 0) > 0
    );
  }, [profile.monthlyExpenses]);

  const getMissingProfileField = useCallback(() => {
    if (!profile.name) return "Personal Info: Name";

    if (!profile.age) return "Personal Info: Age";

    if (!profile.monthlyIncome) return "Personal Info: Monthly Income";

    if (!profile.riskProfile) return "Risk Profile";

    if (
      profile.hasEmergencyFund === undefined ||
      profile.hasEmergencyFund === null
    ) {
      return "Risk Profile: Emergency Fund";
    }

    if (!profile.monthlyExpenses || profile.monthlyExpenses.data.length === 0)
      return "Monthly Expenses";

    if (!profile.financialGoals || profile.financialGoals.length === 0)
      return "Financial Goals";

    if (!profile.investments || profile.investments.length === 0)
      return "Investments";

    return null;
  }, [profile]);

  const isProfileComplete = useCallback(() => {
    const complete =
      !!profile.name &&
      !!profile.age &&
      !!profile.monthlyIncome &&
      !!profile.riskProfile &&
      hasMonthlyExpenses() &&
      !!profile.financialGoals &&
      profile.financialGoals.length > 0 &&
      !!profile.investments &&
      profile.investments.length > 0;
    return complete;
  }, [profile, hasMonthlyExpenses]);

  const isStepCompleted = useCallback(
    (stepId: number): boolean => {
      switch (stepId) {
        case 1:
          return !!profile.name && !!profile.age && !!profile.monthlyIncome;
        case 2:
          return (
            !!profile.riskProfile &&
            profile.hasEmergencyFund !== undefined &&
            profile.hasEmergencyFund !== null
          );
        case 3:
          return hasMonthlyExpenses();
        case 4:
          return (
            !!profile.monthlySavings && profile.monthlySavings.data.length > 0
          );
        case 5:
          return !!profile.financialGoals && profile.financialGoals.length > 0;
        case 6:
          return !!profile.investments && profile.investments.length > 0;
        default:
          return false;
      }
    },
    [profile, hasMonthlyExpenses]
  );

  const {
    step,
    totalSteps,
    handleNextStep,
    handlePrevStep,
    handleCancel,
    handleComplete: completeOnboarding,
  } = useOnboardingFlow({
    onComplete,
    isEditMode,
    isSaving,
    existingProfile,
  });

  // Log current step and total steps when component re-renders
  useEffect(() => {
    console.log(
      `OnboardingContent: Current Step: ${step}, Total Steps: ${totalSteps}`
    );
  }, [step, totalSteps]);

  const steps = {
    goals: 1,
    savings: 2,
    investments: 3,
  };

  const stepIndicatorSteps = [
    {
      id: 1,
      label: t("onboarding.personalInfo"),
      completed: isStepCompleted(1),
      current: step === 1,
      required: true,
    },
    {
      id: 2,
      label: t("onboarding.riskProfile"),
      completed: isStepCompleted(2),
      current: step === 2,
      required: true,
    },
    {
      id: 3,
      label: t("onboarding.monthlyExpenses"),
      completed: isStepCompleted(3),
      current: step === 3,
    },
    {
      id: 4,
      label: t("onboarding.monthlySavings"),
      completed: isStepCompleted(4),
      current: step === 4,
    },
    {
      id: 5,
      label: t("onboarding.financialGoals"),
      completed: isStepCompleted(5),
      current: step === 5,
    },
    {
      id: 6,
      label: t("onboarding.investments"),
      completed: isStepCompleted(6),
      current: step === 6,
    },
  ];

  useEffect(() => {
    if (isEditMode && existingProfile) {
      console.log(
        "OnboardingContent: Updating context profile with existing profile:",
        existingProfile
      );
      updateProfile(existingProfile);
    }
  }, [isEditMode, existingProfile, updateProfile]);

  const handleFinalizeOnboarding = useCallback(() => {
    if (isEditMode) {
      setIsReviewModalOpen(true);
    } else {
      completeOnboarding(profile as UserProfile);
      onOnboardingComplete();
    }
  }, [isEditMode, completeOnboarding, profile, onOnboardingComplete]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    console.log("Attempting to save profile:", profile);
    try {
      await onComplete(profile as UserProfile); // Always call onComplete
      toast({
        title: t("onboarding.profileSaved"),
        description: t("onboarding.profileSavedSuccessfully"),
        variant: "success",
      });
      if (isEditMode) {
        onOnboardingComplete(); // Close modal or navigate back if in edit mode
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: t("onboarding.errorSavingProfile"),
        description: t("onboarding.errorSavingProfileDescription"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <StepIndicator steps={stepIndicatorSteps} currentStep={step} />

      <OnboardingStepContent
        currentStep={step}
        onOpenReview={handleFinalizeOnboarding}
        onPrevious={handlePrevStep}
        onNext={handleNextStep}
        isLastStep={step === totalSteps}
      />

      <OnboardingNavigation
        currentStep={step}
        totalSteps={totalSteps}
        onNext={handleNextStep}
        onPrevious={handlePrevStep}
        onComplete={handleFinalizeOnboarding}
        onCancel={handleCancel}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSave={handleSaveProfile}
        profileData={profile}
      />
    </div>
  );
};

export default OnboardingContent;
