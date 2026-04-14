import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ImageCarousel,
  CommentsModal,
  PageHeader,
  DetailItem,
  StatusPill,
  CarouselIndicators,
  ReadersModal,
  CommentItem,
  ReaderItem,
  AnimatedPage
} from '@/components';
import {
  useReportDetails,
  useInfiniteComments,
  useNotifiedUsers,
  useMarkAsViewed,
  useInfiniteViewers,
  useAddViewer
} from '@/hooks';
import { getInitials } from '@/utils';
import { motion } from 'framer-motion';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isReadersModalOpen, setIsReadersModalOpen] = useState(false);

  const reportId = Number(id);
  const { data: report, isLoading, isError } = useReportDetails(reportId);
  const { data: commentsData } = useInfiniteComments(reportId);
  const { data: notifiedData } = useNotifiedUsers(reportId);
  const { data: viewersData } = useInfiniteViewers(reportId);

  const markAsViewedMutation = useMarkAsViewed();
  const addViewerMutation = useAddViewer();
  const markedAsViewedRef = useRef<number | null>(null);
  const addedViewerRef = useRef<number | null>(null);

  useEffect(() => {
    if (reportId && markedAsViewedRef.current !== reportId) {
      markAsViewedMutation.mutate(reportId);
      markedAsViewedRef.current = reportId;
    }

    if (reportId && addedViewerRef.current !== reportId) {
      addViewerMutation.mutate(reportId);
      addedViewerRef.current = reportId;
    }
  }, [reportId]);


  if (isLoading && !report) {
    return (
      <div className="flex flex-col bg-white h-full w-full max-w-[600px] mx-auto animate-pulse">
        <PageHeader title="Loading..." onBack={() => navigate(-1)} variant="default" centered={true} showBorder={false} />
        <div className="flex-1 p-4 space-y-6">
          <div className="w-full h-8 bg-neutral-100 rounded" />
          <div className="w-full h-64 bg-neutral-100 rounded-xl" />
          <div className="space-y-3">
            <div className="w-full h-12 bg-neutral-100 rounded" />
            <div className="w-full h-12 bg-neutral-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-[600px] mx-auto bg-white px-4 text-center">
        <p className="text-neutral-500 mb-4">Failed to load report details.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary-300 text-white rounded-full font-bold">Retry</button>
      </div>
    );
  }

  const parts = report.explanation.split('\n');
  const title = parts[0] || 'Untitled Report';
  const description = parts.slice(1).join('\n').trim() || 'No description provided.';

  const statusTag = report.tags.find(t => t.tagType === 2)?.name;
  const trendTag = report.tags.find(t => t.tagType === 3)?.name;
  const generalTags = report.tags.filter(t => t.tagType !== 2 && t.tagType !== 3);

  const images = report.media.map(m => ({
    url: m.mediaType === 'image' ? m.image : m.videoUrl,
    caption: m.caption,
    type: m.mediaType
  }));

  return (
    <AnimatedPage animationType="slide-up">
      <div className="flex flex-col bg-[#414346]/20  w-full max-w-[600px] h-[100dvh] mx-auto font-inter overflow-hidden">
        <div className="flex-1 bg-white rounded-t-[32px] flex flex-col overflow-hidden">
          <PageHeader
            title={title}
            onBack={() => navigate(-1)}
            variant="default"
            centered={true}
            showBorder={false}
            showHandle={true}
          />

          {/* Scrollable Main Info */}
          <div className="flex-1 overflow-y-auto w-full pb-10 scrollbar-hide">
            {/* Post Metadata */}
            <div className="w-full h-[36px] py-[8px] px-4 flex justify-between items-center mb-4">
              <p className="body-s text-neutral-900 m-0">{report.elapsedTime}</p>
              <p className="body-s text-neutral-900 m-0">{report.authorName}</p>
            </div>

            {/* Info Grid / Stacked List */}
            <div className="flex flex-col mb-6">
              <DetailItem label="Project" value={report.projectName || 'General Project'} />
              <DetailItem label="Project Leader" value={report.projectLeaderName || 'N/A'} />
              <DetailItem label="Ship Date" value={report.projectShipDate || 'TBD'} />

              <div className="w-full py-[8px] px-4 flex flex-col gap-[8px]">
                <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900">Status</label>
                <div>
                  <StatusPill label={statusTag || 'Unknown'} />
                </div>
              </div>
              <div className="w-full py-[8px] px-4 flex flex-col gap-[8px]">
                <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900">Trend</label>
                <div>
                  <StatusPill label={trendTag || 'Neutral'} />
                </div>
              </div>
            </div>

            {/* Media Block */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900 px-4">Media</label>
              <div className="w-full px-4">
                <ImageCarousel images={images} onIndexChange={setActiveIndex} />
                <div className="flex justify-center items-center gap-[6px] mt-3">
                  <CarouselIndicators imagesCount={images.length} activeIndex={activeIndex} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 px-4 mb-6">
              <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900">Description</label>
              <p className="body-m text-neutral-900 m-0">
                {description}
              </p>
            </div>

            {/* Tags */}
            {generalTags.length > 0 && (
              <div className="flex flex-col gap-2 px-4 mb-6">
                <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900">Tags</label>
                <div className="flex flex-wrap items-center gap-[10px] w-full mt-1">
                  {generalTags.map((tag) => (
                    <StatusPill key={tag.id} label={tag.name} />
                  ))}
                </div>
              </div>
            )}

            {/* Mentions Section */}
            {notifiedData?.notifiedUsersExtra && notifiedData.notifiedUsersExtra.length > 0 && (
              <div className="flex flex-col gap-2 px-4 mb-6">
                <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900">Mentions</label>
                <div className="flex flex-wrap gap-x-4 gap-y-3 mt-1">
                  {notifiedData.notifiedUsersExtra.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 pr-2">
                      <div className="w-8 h-8 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-primary-600">{getInitials(user.name)}</span>
                      </div>
                      <span className="body-m text-neutral-900 truncate max-w-[150px]">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="flex flex-col mb-6">
              <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900 mb-2 px-4">Comments</label>

              <div className="flex flex-col w-full">
                {commentsData?.pages[0]?.slice(0, 3).map((comment) => (
                  <CommentItem key={comment.id} comment={comment} reportId={reportId} />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 mt-4 pb-4 flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={() => setIsCommentsModalOpen(true)}
                className="w-full h-[48px] rounded-[100px] border border-primary-300 text-primary-300 font-semibold text-[16px] flex items-center justify-center hover:bg-neutral-50 focus:outline-none"
              >
                All Comments ({report.commentCount || 0})
              </motion.button>
            </div>

            {/* Readers Section (Preview) */}
            <div className="flex flex-col mb-4">
              <label className="font-inter font-bold text-[16px] leading-[120%] text-neutral-900 mb-2 px-4">Readers</label>

              <div className="flex flex-col w-full">
                {viewersData?.pages[0] && viewersData.pages[0].length > 0 ? (
                  viewersData.pages[0].slice(0, 3).map((viewer) => (
                    <ReaderItem key={viewer.id} viewer={viewer} />
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-neutral-400 border border-dashed border-neutral-200 mx-4 rounded-xl">
                    No readers found yet.
                  </div>
                )}
              </div>
            </div>

            {/* Readers Action Button */}
            <div className="px-4 pb-8">
              <motion.button
                whileTap={report.viewerCount === 0 ? {} : { scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={() => setIsReadersModalOpen(true)}
                disabled={report.viewerCount === 0}
                className="w-full h-[48px] rounded-[100px] border border-primary-300 text-primary-300 font-semibold text-[16px] flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 disabled:border-neutral-200 disabled:text-neutral-400 focus:outline-none"
              >
                All Readers ({report.viewerCount || 0})
              </motion.button>
            </div>
          </div>
        </div>

        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={() => setIsCommentsModalOpen(false)}
          reportId={reportId}
        />

        <ReadersModal
          isOpen={isReadersModalOpen}
          onClose={() => setIsReadersModalOpen(false)}
          reportId={reportId}
        />
      </div>
    </AnimatedPage>
  );
};

export default ReportDetailPage;
