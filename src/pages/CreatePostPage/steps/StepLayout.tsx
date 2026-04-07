import React from 'react';
import Button from '../../../components/Button/Button';

interface StepLayoutProps {
  title: string;
  children: React.ReactNode;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  className?: string;
  footer?: React.ReactNode;
}

const StepLayout = ({
  title,
  children,
  onNext,
  isNextDisabled = false,
  nextLabel = 'Continue',
  className = '',
  footer,
}: StepLayoutProps) => {
  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Step Heading - Fixed at top */}
      <div className="flex-none">
        <h1 className="font-['Inter',sans-serif] font-bold text-[25px] leading-[1.2] text-neutral-900 px-7 pt-4 pb-6 border-b border-[#D5D5D5]">
          {title}
        </h1>
      </div>

      {/* Main Step Content - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 py-2">
        <div className="px-6 pb-10">
          {children}
        </div>
      </div>

      {/* Footer Navigation with Top Border - Fixed at bottom */}
      <div className="flex-none px-6 py-6 border-t border-[#D5D5D5] bg-white pb-10">
        {footer ? (
          footer
        ) : (
          <Button 
            type="button" 
            onClick={onNext}
            disabled={isNextDisabled}
            className="w-full h-[50px] font-bold text-[16px]"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepLayout;
