import { motion, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileText } from 'react-feather';
import { useInfiniteNotifications } from '@/hooks';
import { PageHeader, AnimatedPage, PageMeta } from '@/components';
import type { Notification } from '@/api';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteNotifications();

  const scrollRef = useRef(null);
  const isInView = useInView(scrollRef);

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notifications = data?.pages.flatMap((page) => page) || [];

  const handleNotificationClick = (notification: Notification) => {
    // Navigate based on type (simple implementation)
    if (notification.report) {
      navigate(`/report/${notification.report}`);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <AnimatedPage animationType="slide-up">
      <PageMeta title="Notifications" description="View and manage your recent activity and mentions." />
      <div className="flex flex-col bg-[#414346]/20 h-full w-full max-w-[600px] h-[100dvh] mx-auto font-inter overflow-hidden">
        <div className="flex-1 bg-white rounded-t-[32px] flex flex-col overflow-hidden">
          <PageHeader 
            title="Notifications" 
            onBack={() => navigate(-1)} 
            centered={true}
            showBorder={false}
            showHandle={true}
          />

          <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-neutral-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🔔</span>
                </div>
                <p className="heading-s text-neutral-900 mb-1">No notifications yet</p>
                <p className="body-m text-neutral-500">We'll notify you when something important happens.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    whileTap={{ backgroundColor: '#f9f9f9' }}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex gap-4 p-4 border-b border-neutral-50 cursor-pointer transition-colors ${!notif.viewed ? 'bg-primary-50/20' : ''}`}
                  >
                    {/* Thumbnail / Icon */}
                    <div className="shrink-0 w-12 h-12 flex items-center justify-center overflow-hidden">
                      {notif.thumbnail ? (
                        <img src={notif.thumbnail} alt="" className="w-full h-full object-cover rounded-none" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-300">
                          {notif.comment ? <MessageSquare size={24} /> : <FileText size={24} />}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex justify-between items-start gap-2">
                         <p className="font-bold text-[14px] text-neutral-900 truncate">
                          {notif.title}
                        </p>
                        <span className="text-[11px] text-neutral-400 whitespace-nowrap pt-0.5">
                          {formatRelativeTime(notif.createdOn)}
                        </span>
                      </div>
                      <p className="text-[12px] text-neutral-500 font-medium truncate">
                        {notif.projectName}
                      </p>
                      <p className="text-[13px] text-neutral-600 line-clamp-2 leading-relaxed">
                        {notif.content}
                      </p>
                    </div>

                    {/* Unread Dot */}
                    {!notif.viewed && (
                      <div className="shrink-0 pt-2">
                        <div className="w-2 h-2 rounded-full bg-brand-red" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Load More Trigger */}
                <div ref={scrollRef} className="h-10 w-full flex items-center justify-center">
                  {isFetchingNextPage && <div className="loading-spinner h-6 w-6 border-2 border-primary-300 border-t-transparent rounded-full animate-spin" />}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default NotificationsPage;
