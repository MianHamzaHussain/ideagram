import { motion } from 'framer-motion';

interface SelectablePillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  fullWidth?: boolean;
  className?: string;
}

/**
 * A toggle-able pill used for Status, Trend, and Tags.
 */
const SelectablePill = ({ label, isActive, onClick, fullWidth = false, className = '' }: SelectablePillProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      type="button"
      onClick={onClick}
      className={`
        h-[40px] px-[12px] py-[8px] rounded-[100px] 
        font-['Inter',sans-serif] font-semibold text-[16px] leading-[24px] 
        transition-colors duration-200 border
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${isActive 
          ? 'bg-[#59A7F6] text-white border-[#59A7F6] shadow-sm' 
          : 'bg-[#F6F7F8] border-[#D5D5D5] text-[#1F2122] hover:bg-neutral-50'
        }
        ${className}
      `}
    >
      {label}
    </motion.button>
  );
};

export default SelectablePill;
