import React from "react";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStep
                ? "bg-finance-blue text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`mt-2 text-sm ${
              index <= currentStep ? "text-finance-blue" : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;