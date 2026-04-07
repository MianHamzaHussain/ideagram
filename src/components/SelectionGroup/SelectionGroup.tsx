import type { ReactNode } from 'react';

interface SelectionGroupProps {
  label: string;
  subLabel?: string;
  children: ReactNode;
  contentClassName?: string;
  className?: string;
}

/**
 * A reusable wrapper for labeled sections like Status, Trend, and Tags.
 */
const SelectionGroup = ({ label, subLabel, children, contentClassName = '', className = '' }: SelectionGroupProps) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <label className="font-['Inter',sans-serif] font-bold text-[16px] text-neutral-900 px-1">
        {label}
      </label>
      {subLabel && (
        <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-[1.4] text-[#414346] mb-2 px-1">
          {subLabel}
        </span>
      )}
      <div className={`flex flex-wrap gap-3 px-1 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default SelectionGroup;
