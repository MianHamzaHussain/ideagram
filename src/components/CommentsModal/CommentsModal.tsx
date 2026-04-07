import { useEffect, useState } from 'react';
import CommentItem from '../CommentItem/CommentItem';
import PageHeader from '../PageHeader/PageHeader';
import { useInfiniteComments } from '../../hooks/useComments';
import InfiniteScrollSentinel from '../InfiniteScrollSentinel/InfiniteScrollSentinel';
import CommentFormModal from '../CommentForm/CommentFormModal';

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

  if (!isOpen) return null;

  const comments = data?.pages.flat() || [];
  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-[#414346]/20 font-inter max-w-[600px] mx-auto overflow-hidden animate-in fade-in duration-300">
      {/* Top Backdrop Area / Scrim */}
      <div
        className="h-1 w-full shrink-0 cursor-pointer"
        onClick={onClose}
      />
      {/* Sheet Content */}
      <div className="flex-1 bg-white rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden animate-slide-up duration-300">
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
              className="p-2 -mr-2 text-brand-blue active:opacity-50 transition-opacity focus:outline-none"
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
            <>
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} reportId={reportId} />
              ))}
              <InfiniteScrollSentinel
                hasNextPage={hasNextPage}
                onIntersect={fetchNextPage}
                isLoading={isLoading}
              />
            </>
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
      </div>
      <CommentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        reportId={reportId}
        mode="create"
      />
    </div>
  );
};
export default CommentsModal;
