
import React from 'react';

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

  return (
    <div className="mb-8">
      <div className="relative">
        {/* Progress bar background */}
        <div className="bg-gray-200 h-1 absolute top-4 left-0 right-0 z-0"></div>
        
        {/* Active progress bar */}
        <div 
          className="bg-brand-primary h-1 absolute top-4 left-0 z-10 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        
        {/* Steps */}
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
    </div>
  );
};

export default GarmentFormStepProgress;
