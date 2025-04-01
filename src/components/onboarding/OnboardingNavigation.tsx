
import React from 'react';
import { ArrowRight, ChevronRight, X, Loader2 } from 'lucide-react';
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
  isLoading?: boolean;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious,
  onComplete,
  onCancel,
  isEditMode = false,
  isLoading = false
}) => {
  const { profile, updateProfile } = useOnboarding();

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const handleNextClick = () => {
    // For step 2 (risk profile), ensure emergency fund months is set properly
    if (currentStep === 2 && profile.hasEmergencyFund && profile.emergencyFundMonths === undefined) {
      updateProfile({ emergencyFundMonths: 3 });
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex justify-between">
      {!isFirstStep ? (
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2" disabled={isLoading}>
          <ArrowRight className="h-4 w-4 rotate-180" />
          Previous
        </Button>
      ) : (
        <div>
          {isEditMode && onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex items-center gap-2 border-red-300 text-red-500 hover:bg-red-50" disabled={isLoading}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      )}
      
      <Button 
        onClick={handleNextClick}
        className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {!isLastStep ? 'Processing...' : (isEditMode ? 'Saving...' : 'Completing...')}
          </>
        ) : (
          <>
            {!isLastStep ? 'Next' : (isEditMode ? 'Save Changes' : 'Complete')}
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
