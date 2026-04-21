import { motion } from 'framer-motion';
import { listContainerVariants, listItemVariants } from '@/config/animations';
import { ReaderItem, PageHeader, InfiniteScrollSentinel, ListItemSkeleton, BottomSheet } from '@/components';
import { useInfiniteViewers } from '@/hooks';

interface ReadersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
}

const ReadersModal = ({ isOpen, onClose, reportId }: ReadersModalProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteViewers(reportId);

  const viewers = data?.pages.flat() || [];
  
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} fullHeight={true}>
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
        {isLoading && viewers.length === 0 ? (
          <ListItemSkeleton count={4} className="p-4" />
        ) : viewers && viewers.length > 0 ? (
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col w-full"
          >
            {viewers.map((viewer) => (
              <motion.div key={viewer.id} variants={listItemVariants}>
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
    </BottomSheet>
  );
};

export default ReadersModal;
