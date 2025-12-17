import React from 'react';
import { ApplicationStep } from '@/types/application';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface ApplicationProgressProps {
  steps: ApplicationStep[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
  className?: string;
}

const ApplicationProgress: React.FC<ApplicationProgressProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  const getStepIcon = (step: ApplicationStep, index: number) => {
    const stepNumber = index + 1;
    
    if (step.isCompleted) {
      return <CheckCircle className="text-green-600" size={24} />;
    } else if (stepNumber === currentStep) {
      return (
        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
          {stepNumber}
        </div>
      );
    } else if (step.isRequired && stepNumber < currentStep) {
      return <AlertCircle className="text-orange-500" size={24} />;
    } else {
      return (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center text-sm">
          {stepNumber}
        </div>
      );
    }
  };

  const getStepStatus = (step: ApplicationStep, index: number) => {
    const stepNumber = index + 1;
    
    if (step.isCompleted) {
      return 'completed';
    } else if (stepNumber === currentStep) {
      return 'current';
    } else if (stepNumber < currentStep) {
      return 'incomplete';
    } else {
      return 'upcoming';
    }
  };

  const getConnectorClass = (index: number) => {
    if (index === steps.length - 1) return 'hidden';
    
    const currentStepIndex = currentStep - 1;
    const isCompleted = index < currentStepIndex || steps[index].isCompleted;
    
    return clsx(
      'absolute top-3 left-6 w-full h-0.5 transform translate-x-3',
      isCompleted ? 'bg-green-500' : 'bg-gray-300'
    );
  };

  return (
    <div className={clsx('bg-white rounded-lg shadow-sm border border-gray-200 p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Progress</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(step, index);
          const isClickable = stepNumber <= currentStep || step.isCompleted;
          
          return (
            <div key={step.id} className="relative">
              {/* Connector line */}
              <div className={getConnectorClass(index)} />
              
              <div
                className={clsx(
                  'flex items-start space-x-4 p-3 rounded-lg transition-colors',
                  isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed',
                  status === 'current' && 'bg-primary-50 border border-primary-200'
                )}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                {/* Step Icon */}
                <div className="flex-shrink-0">
                  {getStepIcon(step, index)}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={clsx(
                      'text-sm font-medium',
                      status === 'completed' ? 'text-green-700' :
                      status === 'current' ? 'text-primary-700' :
                      status === 'incomplete' ? 'text-orange-600' :
                      'text-gray-500'
                    )}>
                      {step.title}
                      {step.isRequired && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h4>
                    
                    {/* Status Badge */}
                    <span className={clsx(
                      'text-xs px-2 py-1 rounded-full font-medium',
                      status === 'completed' ? 'bg-green-100 text-green-800' :
                      status === 'current' ? 'bg-primary-100 text-primary-800' :
                      status === 'incomplete' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {status === 'completed' ? 'Completed' :
                       status === 'current' ? 'In Progress' :
                       status === 'incomplete' ? 'Incomplete' :
                       'Upcoming'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </p>
                  
                  {status === 'incomplete' && step.isRequired && (
                    <p className="text-xs text-orange-600 mt-1">
                      This step requires completion before proceeding.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Overall Progress */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>
            {steps.filter(s => s.isCompleted).length} of {steps.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(steps.filter(s => s.isCompleted).length / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationProgress;

