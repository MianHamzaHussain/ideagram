import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationApi, type Notification } from '@/api/notification';
import { STALE_TIME, PAGE_SIZE } from '@/config/queryConfig';

export const useInfiniteNotifications = () => {
  return useInfiniteQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) =>
      notificationApi.list({
        type: 'mobile',
        before_id: pageParam as number,
        page_size: PAGE_SIZE.FEED,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem.id;
    },
    staleTime: STALE_TIME.DEFAULT,
  });
};
