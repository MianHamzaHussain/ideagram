import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fullHeight?: boolean;
}

const BottomSheet = ({ isOpen, onClose, children, fullHeight = false }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end items-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Sheet Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 0.8
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={`
              relative w-full max-w-[600px] bg-white rounded-t-[32px] overflow-hidden 
              flex flex-col shadow-2xl
              ${fullHeight ? 'h-full' : 'max-h-[95dvh] min-h-[40dvh]'}
            `}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


export default BottomSheet;
