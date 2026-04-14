import { useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import ReaderItem from '../ReaderItem/ReaderItem';
import PageHeader from '../PageHeader/PageHeader';
import { useInfiniteViewers } from '../../hooks/useViewers';
import InfiniteScrollSentinel from '../InfiniteScrollSentinel/InfiniteScrollSentinel';

interface ReadersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const ReadersModal = ({ isOpen, onClose, reportId }: ReadersModalProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteViewers(reportId);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const viewers = data?.pages.flat() || [];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end items-center max-w-[600px] mx-auto overflow-hidden">
          {/* Top Backdrop Area / Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#414346]/20 pointer-events-auto"
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
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="relative w-full h-full mt-4 bg-white rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            <PageHeader
              title="Readers"
              onBack={onClose}
              variant="default"
              centered={true}
              showBorder={false}
              showHandle={true}
            />

            {/* Viewers List */}
            <div className="flex-1 overflow-y-auto pb-6 overscroll-contain w-full scrollbar-hide">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="flex gap-3 animate-pulse px-4 py-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="w-24 h-4 bg-neutral-100 rounded" />
                        <div className="w-full h-8 bg-neutral-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewers && viewers.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col w-full"
                >
                  {viewers.map((viewer) => (
                    <motion.div key={viewer.id} variants={itemVariants}>
                      <ReaderItem viewer={viewer} />
                    </motion.div>
                  ))}

                  <InfiniteScrollSentinel
                    hasNextPage={hasNextPage}
                    onIntersect={fetchNextPage}
                    isLoading={isLoading}
                  />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-neutral-400">
                  <p>No readers found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReadersModal;
