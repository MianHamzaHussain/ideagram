import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listContainerVariants, listItemVariants } from '@/config/animations';
import { CommentItem, PageHeader, InfiniteScrollSentinel, CommentFormModal } from '@/components';
import { useInfiniteComments } from '@/hooks';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
}



const CommentsModal = ({ isOpen, onClose, reportId }: CommentsModalProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteComments(reportId);

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

  const comments = data?.pages.flat() || [];

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
              title="Comments"
              onBack={onClose}
              variant="default"
              centered={true}
              showBorder={false}
              showHandle={true}
              rightElement={
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="p-2 -mr-2 text-brand-blue active:opacity-50 transition-opacity focus:outline-none font-bold"
                >
                  Add
                </button>
              }
            />

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto pb-6 overscroll-contain w-full scrollbar-hide">
              {isLoading && comments.length === 0 ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="w-24 h-4 bg-neutral-100 rounded" />
                        <div className="w-full h-12 bg-neutral-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                <motion.div
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col w-full"
                >
                  {comments.map((comment) => (
                    <motion.div key={comment.id} variants={listItemVariants}>
                      <CommentItem comment={comment} reportId={reportId} />
                    </motion.div>
                  ))}
                  <InfiniteScrollSentinel
                    hasNextPage={hasNextPage}
                    onIntersect={fetchNextPage}
                    isLoading={isLoading}
                  />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-8 text-center">
                  <p className="text-neutral-500 font-inter text-[16px]">There is no comment, please add</p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="h-[40px] px-6 rounded-full bg-primary-300 text-white font-bold text-[14px] hover:bg-primary-400 transition-colors"
                  >
                    Add Comment
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <CommentFormModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            reportId={reportId}
            mode="create"
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommentsModal;