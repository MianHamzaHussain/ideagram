interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * A thin, multi-segment progress indicator for creation flows.
 * @param currentStep 0-indexed current step.
 * @param totalSteps total number of segments.
 */
const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex w-full gap-1 px-4 py-2 bg-white">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-[2px] flex-1 rounded-full transition-colors duration-300 ${
            index <= currentStep ? 'bg-brand-blue' : 'bg-neutral-100'
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
