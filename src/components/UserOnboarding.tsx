
import React, { useState } from 'react';
import { UserProfile } from '@/types/finance';
import { OnboardingProvider, useOnboarding } from '@/context/OnboardingContext';
import StepIndicator from './onboarding/StepIndicator';
import PersonalInfoStep from './onboarding/PersonalInfoStep';
import RiskProfileStep from './onboarding/RiskProfileStep';
import FinancialGoalsStep from './onboarding/FinancialGoalsStep';
import InvestmentsStep from './onboarding/InvestmentsStep';
import ReviewStep from './onboarding/ReviewStep';
import OnboardingNavigation from './onboarding/OnboardingNavigation';

interface UserOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const TOTAL_STEPS = 5;

const OnboardingContent: React.FC<UserOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const { profile } = useOnboarding();

  const handleNextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
      
      <div className="glass-panel rounded-2xl p-8 mb-8 animate-scale-in">
        {step === 1 && <PersonalInfoStep />}
        {step === 2 && <RiskProfileStep />}
        {step === 3 && <FinancialGoalsStep />}
        {step === 4 && <InvestmentsStep />}
        {step === 5 && <ReviewStep />}
      </div>
      
      <OnboardingNavigation 
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onNext={handleNextStep}
        onPrevious={handlePrevStep}
        onComplete={() => onComplete(profile as UserProfile)}
      />
    </div>
  );
};

const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete }) => {
  return (
    <OnboardingProvider>
      <OnboardingContent onComplete={onComplete} />
    </OnboardingProvider>
  );
};

export default UserOnboarding;
