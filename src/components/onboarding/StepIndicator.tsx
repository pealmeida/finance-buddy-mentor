import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Step {
  id: number;
  label: string;
  completed: boolean;
  current: boolean;
  required?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  const { t } = useTranslation();
  // Calculate progress percentage (0-100)
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Step labels and indicators */}
      <div className='flex justify-between w-full px-4'>
        {steps.map((step) => (
          <div
            key={step.id}
            className='flex flex-col items-center gap-1 min-w-[40px]'
            aria-current={step.current ? "step" : undefined}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                ${
                  step.completed
                    ? "bg-finance-green text-white"
                    : step.current
                    ? "bg-finance-blue text-white"
                    : "bg-white border border-gray-300 text-gray-600"
                }`}>
              {step.completed ? <Check className='w-4 h-4' /> : step.id}
            </div>
            <span
              className={`text-xs text-center ${
                step.completed
                  ? "text-finance-green"
                  : step.current
                  ? "font-medium text-finance-blue"
                  : "text-gray-500"
              }`}>
              {t(step.label)}
              {step.required && <span className='text-red-500 ml-1'>*</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className='w-full bg-gray-200 h-1.5 rounded-full relative'>
        <div
          className='bg-finance-blue h-1.5 rounded-full transition-all duration-500 absolute top-0 left-0'
          style={{
            width: `${progressPercentage}%`,
          }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role='progressbar'
        />
      </div>
    </div>
  );
};
