import React from "react";
import { ArrowRight, ChevronRight, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useOnboarding } from "../../context/OnboardingContext";
import { useTranslation } from "react-i18next";

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
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const handleNextClick = () => {
    console.log(
      `OnboardingNavigation: handleNextClick - Current Step: ${currentStep}, Total Steps: ${totalSteps}, Is Last Step: ${isLastStep}`
    );
    if (isLastStep) {
      console.log("OnboardingNavigation: Calling onComplete.");
      onComplete();
    } else {
      console.log("OnboardingNavigation: Calling onNext.");
      onNext();
    }
  };

  return (
    <div className='flex justify-between'>
      {!isFirstStep ? (
        <Button
          variant='outline'
          onClick={onPrevious}
          className='flex items-center gap-2'
          disabled={isLoading}>
          <ArrowRight className='h-4 w-4 rotate-180' />
          {t("onboarding.previous")}
        </Button>
      ) : (
        <div>
          {isEditMode && onCancel && (
            <Button
              variant='outline'
              onClick={onCancel}
              className='flex items-center gap-2 border-red-300 text-red-500 hover:bg-red-50'
              disabled={isLoading}>
              <X className='h-4 w-4' />
              {t("onboarding.cancel")}
            </Button>
          )}
        </div>
      )}

      <Button
        onClick={() => {
          console.log("Save/Next button clicked!");
          handleNextClick();
        }}
        className='flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover'
        disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            {!isLastStep
              ? t("onboarding.processing")
              : isEditMode
              ? t("onboarding.saving")
              : t("onboarding.completing")}
          </>
        ) : (
          <>
            {!isLastStep
              ? t("onboarding.next")
              : isEditMode
              ? t("common.save")
              : t("onboarding.complete")}
            <ChevronRight className='h-4 w-4' />
          </>
        )}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
