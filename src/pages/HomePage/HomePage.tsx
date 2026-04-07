import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Tabs from '../../components/Tabs/Tabs';
import Footer from '../../components/Footer/Footer';
import ReportCard from '../../components/ReportCard/ReportCard';
import { useInfiniteReports } from '../../hooks/useReports';
import { mapReportToCardProps } from '../../utils/reportMapper';
import InfiniteScrollSentinel from '../../components/InfiniteScrollSentinel/InfiniteScrollSentinel';

/**
 * Modern Industry-Standard PWA Home Page
 * Implements a sticky header/tabs, scrollable content, and fixed footer.
 */
const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'progress' | 'problem'>('progress');
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteReports(activeTab);

  const reports = data?.pages.flat() || [];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-inter">
      <Header />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Scrollable Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto px-4 py-4 scroll-smooth scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full h-[300px] bg-neutral-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
            <p>Failed to load reports</p>
            <button onClick={() => window.location.reload()} className="text-secondary-300 font-bold mt-2 underline">Retry</button>
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <ReportCard key={report.id} {...mapReportToCardProps(report)} />
            ))}
            
            <InfiniteScrollSentinel 
              hasNextPage={hasNextPage} 
              onIntersect={fetchNextPage} 
              isLoading={isLoading} 
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center p-4 h-[78px] gap-4">
              <p className="font-inter font-normal text-[16px] leading-[140%] text-neutral-900 text-center">
                No posts yet
              </p>
              <button
                type="button"
                onClick={() => navigate('/create-post')}
                className="flex items-center justify-center w-[123px] h-[40px] px-4 py-2 gap-2 bg-splash-bg rounded-lg transition-transform active:scale-95"
              >
                <span className="font-inter font-semibold text-[16px] leading-[24px] text-white text-center">
                  Create Post
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
