import React from "react";
import PersonalInfoStep from "./PersonalInfoStep";
import RiskProfileStep from "./RiskProfileStep";
import FinancialGoalsStep from "./FinancialGoalsStep";
import InvestmentsStep from "./InvestmentsStep";
import MonthlySavingsStep from "./MonthlySavingsStep";
import MonthlyExpensesStep from "./MonthlyExpensesStep";

interface OnboardingStepContentProps {
  currentStep: number;
  onOpenReview: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
}

const stepComponents: {
  [key: number]: (props: OnboardingStepContentProps) => React.ReactElement;
} = {
  1: () => <PersonalInfoStep />,
  2: () => <RiskProfileStep />,
  3: () => <MonthlyExpensesStep />,
  4: () => <MonthlySavingsStep />,
  5: () => <FinancialGoalsStep />,
  6: ({ onOpenReview, onPrevious, isLastStep }) => (
    <InvestmentsStep
      onOpenReview={onOpenReview}
      onPrevious={onPrevious}
      onNext={onOpenReview}
      isLastStep={isLastStep}
    />
  ),
};

const OnboardingStepContent: React.FC<OnboardingStepContentProps> = ({
  currentStep,
  onOpenReview,
  onNext,
  onPrevious,
  isLastStep,
}) => {
  const renderStep = stepComponents[currentStep];

  if (!renderStep) {
    return <div>Step not found</div>; // Or handle as an error/fallback
  }

  return (
    <div className='glass-panel rounded-2xl p-8 mb-8 animate-scale-in'>
      {renderStep({
        currentStep,
        onOpenReview,
        onNext,
        onPrevious,
        isLastStep,
      })}
    </div>
  );
};

export default OnboardingStepContent;
