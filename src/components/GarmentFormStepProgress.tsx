
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface GarmentFormStepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const GarmentFormStepProgress: React.FC<GarmentFormStepProgressProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  const steps = [
    { id: 1, name: 'Garment Details' },
    { id: 2, name: 'Measurements' },
    { id: 3, name: 'Fit Perception' },
  ];

  // Calculate percentage for progress bar
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-1 mb-4" />
      
      {/* Step indicators */}
      <div className="flex justify-between relative z-20">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id <= currentStep 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-white border-2 border-gray-200 text-gray-400'
              }`}
            >
              {step.id}
            </div>
            <span className={`text-xs mt-2 ${
              step.id <= currentStep ? 'text-gray-800' : 'text-gray-400'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GarmentFormStepProgress;
