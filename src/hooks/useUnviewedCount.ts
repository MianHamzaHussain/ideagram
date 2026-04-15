import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/api/notification';
import { STALE_TIME, REFETCH_INTERVAL } from '@/config/queryConfig';

export const useUnviewedCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unviewedCount'],
    queryFn: () => notificationApi.getUnviewedCount(),
    refetchInterval: REFETCH_INTERVAL.NOTIFICATIONS,
    staleTime: STALE_TIME.SHORT,
  });
};
