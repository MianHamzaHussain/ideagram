import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fullHeight?: boolean;
}

const BottomSheet = ({ isOpen, onClose, children, fullHeight = false }: BottomSheetProps) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Optional: Add padding to prevent layout shift if there's a scrollbar
      // document.body.style.paddingRight = 'var(--scrollbar-width)';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end items-center max-w-[600px] mx-auto overflow-hidden">
          {/* Overlay / Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#000000]/30 backdrop-blur-[1px] pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Sheet Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 280,
              mass: 0.9,
              restDelta: 0.1
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            role="dialog"
            aria-modal="true"
            className={`
              relative w-full bg-white rounded-t-[32px] overflow-hidden 
              flex flex-col shadow-[0_-8px_30px_rgb(0,0,0,0.12)]
              ${fullHeight ? 'h-[calc(100%-40px)] mt-4' : 'max-h-[95dvh] min-h-[40dvh]'}
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
