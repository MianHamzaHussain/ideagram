import type { ReactNode } from 'react';

interface TypeCardProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
  activeColor?: string;
}

/**
 * Reusable selection card following the 173x177 design.
 */
const TypeCard = ({ label, icon, onClick, className = '', isActive = false, activeColor = 'border-primary-400' }: TypeCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center 
        w-full h-[177px] 
        pt-[32px] pb-[32px] px-[40px] 
        gap-[8px] 
        bg-white rounded-[16px] 
        border-2 border-dashed transition-all group focus:outline-none 
        active:scale-95 
        ${isActive ? `${activeColor} bg-primary-50/30` : 'border-[#D5D5D5] hover:bg-neutral-50'}
        ${className}
      `}
    >
      <div className="flex items-center justify-center w-[80px] h-[80px]">
        {icon}
      </div>
      <span className="font-['Inter',sans-serif] font-bold text-[18px] leading-[1.4] text-[#1F2122]">
        {label}
      </span>
    </button>
  );
};

export default TypeCard;
