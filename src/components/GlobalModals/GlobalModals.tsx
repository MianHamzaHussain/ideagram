import { ReadersModal, CommentsModal } from '@/components';
import { useModalStore } from '@/store/useModalStore';

const GlobalModals = () => {
  const { 
    currentReportId, 
    isReadersOpen, 
    isCommentsOpen, 
    closeReaders, 
    closeComments 
  } = useModalStore();

  return (
    <>
      <ReadersModal 
        isOpen={isReadersOpen} 
        onClose={closeReaders} 
        reportId={currentReportId || 0} 
      />
      <CommentsModal 
        isOpen={isCommentsOpen} 
        onClose={closeComments} 
        reportId={currentReportId || 0} 
      />
    </>
  );
};

export default GlobalModals;
