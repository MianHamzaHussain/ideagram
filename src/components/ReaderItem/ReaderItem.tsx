import { motion } from 'framer-motion';
import type { Viewer } from '@/api';
import { getInitials } from '@/utils';

interface ReaderItemProps {
  viewer: Viewer;
}

const ReaderItem = ({ viewer }: ReaderItemProps) => {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex items-center gap-3 w-full py-4 px-4 hover:bg-neutral-50/50 transition-colors cursor-pointer font-inter min-h-[72px]"
    >
      {/* Avatar Placeholder (Stylized Initials) */}
      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100 select-none">
        <span className="text-primary-600 font-bold text-sm">
          {getInitials(viewer.userName)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-inter font-bold text-[15px] leading-tight text-neutral-900 truncate">
            {viewer.userName}
          </span>
          <span className="font-inter font-normal text-[12px] leading-tight text-neutral-500 whitespace-nowrap">
            {viewer.elapsedTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReaderItem;
