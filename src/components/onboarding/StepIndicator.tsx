
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(stepNumber => (
        <div 
          key={stepNumber}
          className={`relative flex items-center justify-center h-10 w-10 rounded-full 
            ${stepNumber < currentStep ? 'bg-finance-green text-white' : 
              stepNumber === currentStep ? 'bg-finance-blue text-white' : 
              'bg-gray-200 text-gray-500'} 
            transition-all duration-300`}
        >
          {stepNumber < currentStep ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium">{stepNumber}</span>
          )}
          
          {stepNumber < totalSteps && (
            <div 
              className={`absolute top-5 -right-full h-0.5 w-full 
                ${stepNumber < currentStep ? 'bg-finance-green' : 'bg-gray-200'} 
                transition-all duration-300`} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
