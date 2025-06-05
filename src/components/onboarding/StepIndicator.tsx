import React from "react";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
  completed: boolean;
  current: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Step labels and indicators */}
      <div className='flex justify-between w-full px-4'>
        {steps.map((step) => (
          <div
            key={step.id}
            className='flex flex-col items-center gap-1 min-w-[40px]'>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                ${
                  step.completed
                    ? "bg-green-500 text-white"
                    : step.current
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              aria-current={step.current ? "step" : undefined}>
              {step.completed ? <Check className='w-4 h-4' /> : step.id}
            </div>
            <span
              className={`text-xs text-center ${
                step.current ? "font-bold text-blue-500" : "text-gray-600"
              }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className='w-full bg-gray-200 h-1.5 rounded-full'>
        <div
          className='bg-blue-500 h-1.5 rounded-full transition-all duration-500'
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
