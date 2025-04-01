
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious,
  onComplete
}) => {
  const { profile } = useOnboarding();

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const handleNextClick = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex justify-between">
      {!isFirstStep ? (
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Previous
        </Button>
      ) : (
        <div></div>
      )}
      
      <Button 
        onClick={handleNextClick}
        className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover"
      >
        {!isLastStep ? 'Next' : 'Complete'}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
