import React, { useEffect, useState } from "react";
import { UserProfile } from "@/types/finance";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepIndicator } from "./StepIndicator";
import OnboardingNavigation from "./OnboardingNavigation";
import OnboardingStepContent from "./OnboardingStepContent";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";
import PersonalInfoStep from "./PersonalInfoStep";
import RiskProfileStep from "./RiskProfileStep";
import MonthlyExpensesStep from "./MonthlyExpensesStep";
import MonthlySavingsStep from "./MonthlySavingsStep";
import DebtDetailsForm from "./DebtDetailsForm";
import FinancialGoalsStep from "./FinancialGoalsStep";
import InvestmentsStep from "./InvestmentsStep";
import ReviewStep from "./ReviewStep";

interface OnboardingContentProps {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isEditMode?: boolean;
  isSaving?: boolean;
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
}) => {
  const { profile, updateProfile } = useOnboarding();
  const [profileInitialized, setProfileInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    step,
    totalSteps,
    handleNextStep,
    handlePrevStep,
    handleCancel,
    handleComplete: completeOnboarding,
    isLoading,
  } = useOnboardingFlow({
    onComplete,
    isEditMode,
    isSaving,
    existingProfile,
  });

  const steps: OnboardingStep[] = [
    { id: 1, label: "Personal Info", component: <PersonalInfoStep /> },
    { id: 2, label: "Risk Profile", component: <RiskProfileStep /> },
    { id: 3, label: "Monthly Expenses", component: <MonthlyExpensesStep /> },
    { id: 4, label: "Savings", component: <MonthlySavingsStep /> },
    { id: 5, label: "Debt Details", component: <DebtDetailsForm /> },
    { id: 6, label: "Financial Goals", component: <FinancialGoalsStep /> },
    { id: 7, label: "Investments", component: <InvestmentsStep /> },
    { id: 8, label: "Review", component: <ReviewStep /> },
  ];

  const stepIndicatorSteps = steps.map((step) => ({
    id: step.id,
    label: step.label,
    completed: step.id < currentStep,
    current: step.id === currentStep,
  }));

  // Initialize onboarding context with existing profile data if in edit mode
  useEffect(() => {
    if (isEditMode && existingProfile && !profileInitialized) {
      console.log(
        "Initializing onboarding with existing profile:",
        existingProfile
      );
      updateProfile(existingProfile);
      setProfileInitialized(true);
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
        hasEmergencyFund:
          profile.hasEmergencyFund ?? existingProfile.hasEmergencyFund,
        hasDebts: profile.hasDebts ?? existingProfile.hasDebts,
        financialGoals:
          profile.financialGoals || existingProfile.financialGoals,
        investments: profile.investments || existingProfile.investments,
        debtDetails: profile.debtDetails || existingProfile.debtDetails,
      };
      completeOnboarding(completeProfile);
    } else {
      // If we have a complete profile with an id, use it directly
      completeOnboarding(profile as UserProfile);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <StepIndicator steps={stepIndicatorSteps} currentStep={currentStep} />

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
