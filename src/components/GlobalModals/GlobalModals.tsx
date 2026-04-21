import { 
  ReadersModal, 
  CommentsModal, 
  FiltersModal, 
  CommentFormModal, 
  CameraCaptureModal, 
  ConfirmModal 
} from '@/components';
import { useModalStore } from '@/store/useModalStore';

const GlobalModals = () => {
  const { 
    isReadersOpen, 
    isCommentsOpen, 
    currentReportId, 
    closeReaders, 
    closeComments,
    isFiltersOpen,
    filtersProps,
    closeFilters,
    isCommentFormOpen,
    commentFormProps,
    closeCommentForm,
    isCameraOpen,
    cameraProps,
    closeCamera,
    isConfirmOpen,
    confirmProps,
    closeConfirm
  } = useModalStore();

  return (
    <>
      <ReadersModal 
        isOpen={isReadersOpen && !!currentReportId} 
        onClose={closeReaders} 
        reportId={currentReportId || 0} 
      />
      <CommentsModal 
        isOpen={isCommentsOpen && !!currentReportId} 
        onClose={closeComments} 
        reportId={currentReportId || 0} 
      />
      
      {isFiltersOpen && filtersProps && (
        <FiltersModal
          isOpen={isFiltersOpen}
          onClose={closeFilters}
          initialFilters={filtersProps.initialFilters}
          onApply={filtersProps.onApply as any}
        />
      )}

      {isCommentFormOpen && commentFormProps && (
        <CommentFormModal
          isOpen={isCommentFormOpen}
          onClose={closeCommentForm}
          reportId={commentFormProps.reportId}
          mode={commentFormProps.mode}
          commentId={commentFormProps.commentId}
          initialText={commentFormProps.initialText}
        />
      )}

      {isCameraOpen && cameraProps && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={closeCamera}
          onCapture={cameraProps.onCapture}
          allowedModes={cameraProps.allowedModes}
        />
      )}

      {isConfirmOpen && confirmProps && (
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={closeConfirm}
          title={confirmProps.title}
          message={confirmProps.message}
          onConfirm={() => {
            confirmProps.onConfirm();
            closeConfirm();
          }}
          confirmText={confirmProps.confirmText}
          cancelText={confirmProps.cancelText}
          variant={confirmProps.variant}
        />
      )}
    </>
  );
};

export default GlobalModals;
