import { useState } from 'react';
import { motion } from 'framer-motion';
import { listContainerVariants, listItemVariants } from '@/config/animations';
import { CommentItem, PageHeader, InfiniteScrollSentinel, CommentFormModal, ListItemSkeleton, BottomSheet } from '@/components';
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

  const comments = data?.pages.flat() || [];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fullHeight={true}>
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
          <ListItemSkeleton count={5} className="p-4" />
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

      <CommentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        reportId={reportId}
        mode="create"
      />
    </BottomSheet>
  );
};

export default CommentsModal;