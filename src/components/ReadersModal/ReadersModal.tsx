import { useEffect } from 'react';
import ReaderItem from '../ReaderItem/ReaderItem';
import PageHeader from '../PageHeader/PageHeader';
import { useInfiniteViewers } from '../../hooks/useViewers';
import InfiniteScrollSentinel from '../InfiniteScrollSentinel/InfiniteScrollSentinel';

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

  const viewers = data?.pages.flat() || [];
  
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
            <div className="flex flex-col w-full">
              {viewers.map((viewer) => (
                <ReaderItem key={viewer.id} viewer={viewer} />
              ))}

              <InfiniteScrollSentinel 
                hasNextPage={hasNextPage} 
                onIntersect={fetchNextPage} 
                isLoading={isLoading} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-neutral-400">
              <p>No readers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadersModal;
