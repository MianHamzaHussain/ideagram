import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteReports } from '../../hooks/useReports';
import { useInfiniteProjects } from '../../hooks/useInfiniteProjects';
import { useDebounce } from '../../hooks/useDebounce';
import { mapReportToCardProps } from '../../utils/reportMapper';
import ReportCard from '../../components/ReportCard/ReportCard';
import SearchProjectCard from '../../components/SearchProjectCard/SearchProjectCard';
import InfiniteScrollSentinel from '../../components/InfiniteScrollSentinel/InfiniteScrollSentinel';
import { Search as SearchIcon, X } from 'react-feather';
import SelectablePill from '../../components/SelectablePill/SelectablePill';
import PageHeader from '../../components/PageHeader/PageHeader';
import AnimatedPage from '../../components/AnimatedPage/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';

type SearchCategory = 'progress' | 'trouble' | 'project';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('progress');
  const debouncedKeyword = useDebounce(keyword, 500);

  // Data Fetching - Reports (Progress or Trouble)
  const isReportSearch = activeCategory === 'progress' || activeCategory === 'trouble';
  const {
    data: reportData,
    fetchNextPage: fetchNextPageReports,
    hasNextPage: hasNextPageReports,
    isLoading: isReportsLoading,
    isFetchingNextPage: isFetchingExtraReports,
  } = useInfiniteReports({
    reportType: isReportSearch ? activeCategory : undefined,
    keyword: debouncedKeyword,
  });

  // Data Fetching - Projects
  const {
    data: projectData,
    fetchNextPage: fetchNextPageProjects,
    hasNextPage: hasNextPageProjects,
    isLoading: isProjectsLoading,
    isFetchingNextPage: isFetchingExtraProjects,
  } = useInfiniteProjects(activeCategory === 'project' ? debouncedKeyword : '');

  const reports = reportData?.pages.flat() || [];
  const projects = projectData?.pages.flatMap(page => page.results || []) || [];

  return (
    <AnimatedPage animationType="slide-up">
      <div className="flex flex-col bg-[#414346]/20 h-full w-full max-w-[600px] h-[100dvh] mx-auto font-inter overflow-hidden">
        <div className="flex-1 bg-white rounded-t-[32px] flex flex-col overflow-hidden">
          <PageHeader
            title=""
            onBack={() => navigate(-1)}
            centered={false}
            showBorder={false}
            showHandle={true}
            rightElement={
              <div className="flex-1 relative flex items-center h-[44px] mr-2">
                <div className="absolute left-4 z-10 text-neutral-400">
                  <SearchIcon size={20} />
                </div>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search reports or projects..."
                  className="w-full h-full pl-11 pr-11 bg-white border border-neutral-200 rounded-full text-[16px] outline-none focus:ring-1 focus:ring-brand-blue/30 transition-all font-medium placeholder:text-neutral-400"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword('')}
                    className="absolute right-4 z-10 p-2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            }
            className="!p-0"
          />

          {/* Category Selection */}
          <div className="flex-none px-4 py-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              <SelectablePill
                label="PROGRESS"
                isActive={activeCategory === 'progress'}
                onClick={() => setActiveCategory('progress')}
              />
              <SelectablePill
                label="TROUBLE"
                isActive={activeCategory === 'trouble'}
                onClick={() => setActiveCategory('trouble')}
              />
              <SelectablePill
                label="PROJECT"
                isActive={activeCategory === 'project'}
                onClick={() => setActiveCategory('project')}
              />
            </div>
          </div>

          {/* Results Area */}
          <main className="flex-1 overflow-y-auto px-4 pb-10 scrollbar-hide">
            {!debouncedKeyword && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="flex items-center justify-center mb-4">
                  <SearchIcon size={56} className="text-neutral-200" />
                </div>
                <p className="text-neutral-400 font-medium">Start typing to search...</p>
              </div>
            )}

            {debouncedKeyword && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${debouncedKeyword}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {isReportSearch ? (
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <motion.div key={report.id} variants={itemVariants}>
                          <ReportCard {...mapReportToCardProps(report)} />
                        </motion.div>
                      ))}

                      <InfiniteScrollSentinel
                        hasNextPage={hasNextPageReports}
                        onIntersect={fetchNextPageReports}
                        isLoading={isReportsLoading || isFetchingExtraReports}
                      />

                      {!isReportsLoading && reports.length === 0 && (
                        <p className="text-center py-10 text-neutral-400 italic">No reports found.</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 pb-6">
                      {projects.map((project) => (
                        <motion.div key={project.id} variants={itemVariants}>
                          <SearchProjectCard project={project} />
                        </motion.div>
                      ))}

                      <InfiniteScrollSentinel
                        hasNextPage={hasNextPageProjects}
                        onIntersect={fetchNextPageProjects}
                        isLoading={isProjectsLoading || isFetchingExtraProjects}
                      />

                      {!isReportsLoading && reports.length === 0 && projects.length === 0 && (
                        <p className="text-center py-10 text-neutral-400 italic">No projects found.</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SearchPage;
