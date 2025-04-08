
import React from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import RiskProfileStep from './RiskProfileStep';
import FinancialGoalsStep from './FinancialGoalsStep';
import InvestmentsStep from './InvestmentsStep';
import MonthlySavingsStep from './MonthlySavingsStep';
import MonthlyExpensesStep from './MonthlyExpensesStep';
import ReviewStep from './ReviewStep';

interface OnboardingStepContentProps {
  currentStep: number;
}

const OnboardingStepContent: React.FC<OnboardingStepContentProps> = ({ currentStep }) => {
  return (
    <div className="glass-panel rounded-2xl p-8 mb-8 animate-scale-in">
      {currentStep === 1 && <PersonalInfoStep />}
      {currentStep === 2 && <RiskProfileStep />}
      {currentStep === 3 && <FinancialGoalsStep />}
      {currentStep === 4 && <InvestmentsStep />}
      {currentStep === 5 && <MonthlyExpensesStep />}
      {currentStep === 6 && <MonthlySavingsStep />}
      {currentStep === 7 && <ReviewStep />}
    </div>
  );
};

export default OnboardingStepContent;
