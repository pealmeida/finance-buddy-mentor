
import React from 'react';
import { ArrowRight, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious,
  onComplete,
  onCancel,
  isEditMode = false
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
        <div>
          {isEditMode && onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex items-center gap-2 border-red-300 text-red-500 hover:bg-red-50">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      )}
      
      <Button 
        onClick={handleNextClick}
        className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover"
      >
        {!isLastStep ? 'Next' : (isEditMode ? 'Save Changes' : 'Complete')}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
