import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationApi, type Notification } from '../api/notification';

export const useInfiniteNotifications = () => {
  return useInfiniteQuery<Notification[]>({
    queryKey: ['notifications', 'infinite'],
    queryFn: ({ pageParam }) =>
      notificationApi.list({
        type: 'mobile',
        before_id: pageParam as number,
        page_size: 10,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem.id;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
