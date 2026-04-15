import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Header,
  Footer,
  ReportCard,
  InfiniteScrollSentinel,
  FiltersModal,
  AnimatedPage,
  PageMeta,
  ReportSkeleton
} from '@/components';
import { useInfiniteReports } from '@/hooks';
import { mapReportToCardProps } from '@/utils';
import { useFilterStore } from '@/store';
import Tabs from '@/components/Tabs/Tabs';
import { feedContainerVariants, feedItemVariants } from '@/config/animations';



/**
 * Modern Industry-Standard PWA Home Page
 * Implements a sticky header/tabs, scrollable content, and fixed footer.
 */
const HomePage = () => {
  const { reportType, setReportType, tagIds, tagsMap, keyword, projectId } = useFilterStore();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteReports({
    reportType,
    tags: tagsMap,
    keyword: keyword || undefined,
    projectId,
  });

  const reports = data?.pages.flat() || [];

  const handleApplyFilters = (filters: {
    reportType?: 'progress' | 'trouble';
    tagsMap: Record<number, number[]>;
    tagIds: number[];
  }) => {
    if (filters.reportType) {
      setReportType(filters.reportType);
    }
    useFilterStore.getState().setFilters({
      tagIds: filters.tagIds,
      tagsMap: filters.tagsMap
    });
  };

  return (
    <AnimatedPage animationType="fade">
      <PageMeta title="Reports" description="View and manage project progress and trouble reports." />
      <div className="flex flex-col h-full bg-white overflow-hidden font-inter">
        <Header onFilterClick={() => setIsFilterModalOpen(true)} />
        <Tabs activeTab={reportType} onTabChange={setReportType} />

        {/* Scrollable Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto px-4 py-4 scroll-smooth scrollbar-hide">
          {isLoading && reports.length === 0 ? (
            <ReportSkeleton count={3} />
          ) : isError ? (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
              <p>Failed to load reports</p>
              <button onClick={() => window.location.reload()} className="text-secondary-300 font-bold mt-2 underline">Retry</button>
            </div>
          ) : reports.length > 0 ? (
            <motion.div
              variants={feedContainerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {reports.map((report) => (
                <motion.div key={report.id} variants={feedItemVariants}>
                  <ReportCard {...mapReportToCardProps(report)} />
                </motion.div>
              ))}

              <InfiniteScrollSentinel
                hasNextPage={hasNextPage}
                onIntersect={fetchNextPage}
                isLoading={isLoading}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-neutral-500 italic">No reports found matching your filters.</p>
            </div>
          )}
        </main>

        <Footer />

        <FiltersModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={useMemo(() => ({
            reportType: reportType,
            tagIds: tagIds,
          }), [reportType, tagIds])}
        />
      </div>
    </AnimatedPage>
  );
};

export default HomePage;
