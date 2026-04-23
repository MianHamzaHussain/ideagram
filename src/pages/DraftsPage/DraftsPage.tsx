import { AnimatePresence } from 'framer-motion';
import { 
  PageHeader, 
  AnimatedPage, 
  PageMeta, 
  ReportSkeleton,
  EmptyState,
  ReportCard,
  Button
} from '@/components';
import { useInfiniteReports, usePublishReport, useDeleteReport } from '@/hooks';
import { mapReportToCardProps } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Trash2, Send } from 'react-feather';

const DraftsPage = () => {
  const navigate = useNavigate();
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useInfiniteReports({ draft: true });
  
  const { mutate: publish, isPending: isPublishing } = usePublishReport();
  const { mutate: deleteDraft, isPending: isDeleting } = useDeleteReport();

  const drafts = data?.pages.flat() || [];

  return (
    <AnimatedPage animationType="slide-up">
      <PageMeta title="My Drafts" description="View and manage your unpublished reports." />
      <div className="flex flex-col h-full bg-white overflow-hidden">
        <PageHeader 
          title="My Drafts" 
          onBack={() => navigate(-1)} 
          showBorder={false}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          {isLoading ? (
            <ReportSkeleton count={3} />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
              <p>Failed to load drafts</p>
              <button onClick={() => refetch()} className="text-secondary-300 font-bold mt-2 underline">Retry</button>
            </div>
          ) : drafts.length > 0 ? (
            <div className="space-y-6 pb-20">
              <AnimatePresence>
                {drafts.map((draft) => (
                  <ReportCard
                    key={draft.id}
                    {...mapReportToCardProps(draft)}
                    isDraft
                    footerActions={
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDraft(draft.id);
                          }}
                          disabled={isPublishing || isDeleting}
                          className="flex-1 flex items-center justify-center gap-2 border-brand-red text-brand-red hover:bg-brand-red/5"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            publish(draft.id);
                          }}
                          disabled={isPublishing || isDeleting}
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <Send size={16} />
                          Publish
                        </Button>
                      </div>
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState 
              title="No drafts found" 
              description="You don't have any unpublished reports at the moment."
            />
          )}
        </main>
      </div>
    </AnimatedPage>
  );
};

export default DraftsPage;
