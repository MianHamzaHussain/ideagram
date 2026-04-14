import { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2 } from 'react-feather';
import { useAuthStore } from '@/store';
import { useDeleteComment } from '@/hooks';
import ConfirmModal from '../Modal/ConfirmModal';
import CommentFormModal from '../CommentForm/CommentFormModal';
import { toast } from 'react-toastify';
import type { Comment } from '@/api';
import { getInitials } from '@/utils';

interface CommentItemProps {
  comment: Comment;
  reportId: number;
}

const CommentItem = ({ comment, reportId }: CommentItemProps) => {
  const { user } = useAuthStore();
  const deleteMutation = useDeleteComment(reportId);

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const isSwiping = useRef(false);

  // Check if current user is the author
  const userFullName = user ? `${user.lastName} ${user.firstName}`.trim() : '';
  const authorNameFromUser = userFullName || (user?.email ?? '');
  const isOwner = comment.authorName === authorNameFromUser;

  const resetSwipe = () => {
    setSwipeOffset(0);
    isSwiping.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOwner) return;
    startX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isOwner || !startX.current) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;

    // Dampen the swipe or limit it
    // Swipe Left (Edit): Negative diff
    // Swipe Right (Delete): Positive diff
    if (Math.abs(diff) > 10) {
      // Limit offset to actions width (e.g., 45px)
      const offset = Math.max(-45, Math.min(45, diff));
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!isOwner) return;
    if (swipeOffset < -20) {
      // Committed to Edit (Swipe Left)
      setSwipeOffset(-45);
    } else if (swipeOffset > 20) {
      // Committed to Delete (Swipe Right)
      setSwipeOffset(45);
    } else {
      resetSwipe();
    }
    startX.current = null;
    currentX.current = null;
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(comment.id);
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setIsConfirmOpen(false);
      resetSwipe();
    }
  };

  // Close swipe on scroll or click outside (handled naturally by offset state)
  useEffect(() => {
    if (swipeOffset !== 0) {
      const timer = setTimeout(() => {
        // Optional: auto-reset if no action taken?
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [swipeOffset]);

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Action Layer: Edit (Swipe Left revealed on Right) */}
      <div
        className="absolute inset-y-0 right-0 w-[45px] flex items-center justify-center cursor-pointer"
        onClick={() => setIsEditOpen(true)}
        role="button"
        aria-label="Edit comment"
      >
        <Edit2 size={20} className="text-brand-blue" />
      </div>

      {/* Action Layer: Delete (Swipe Right revealed on Left) */}
      <div
        className="absolute inset-y-0 left-0 w-[45px] flex items-center justify-center cursor-pointer"
        onClick={() => setIsConfirmOpen(true)}
        role="button"
        aria-label="Delete comment"
      >
        <Trash2 size={20} className="text-brand-red" />
      </div>

      {/* Content Layer */}
      <div
        className="relative bg-white flex items-start gap-3 w-full py-3 px-4 transition-transform duration-200 ease-out z-10 select-none"
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Avatar Placeholder (Stylized Initials) */}
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100 select-none">
          <span className="text-primary-600 font-bold text-sm">
            {getInitials(comment.authorName)}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-inter font-bold text-[15px] leading-tight text-neutral-900 truncate">
              {comment.authorName}
            </span>
            <span className="font-inter font-normal text-[12px] leading-tight text-neutral-500 whitespace-nowrap">
              {comment.elapsedTime}
            </span>
          </div>

          <p className="font-inter font-normal text-[15px] leading-relaxed text-neutral-700 mt-1 break-words">
            {comment.text}
          </p>

          {/* Media Attachments */}
          {comment.media && comment.media.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {comment.media.map((item) => (
                <div
                  key={item.id}
                  className="relative w-[120px] h-[120px] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200"
                >
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.image || item.thumbnail}
                      alt="Comment Attachment"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <CommentFormModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          resetSwipe();
        }}
        reportId={reportId}
        mode="edit"
        commentId={comment.id}
        initialText={comment.text}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          resetSwipe();
        }}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CommentItem;
