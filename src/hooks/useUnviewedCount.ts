import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../api/notification';

export const useUnviewedCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unviewedCount'],
    queryFn: () => notificationApi.getUnviewedCount(),
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
    staleTime: 1000 * 60, // 1 minute stale time
  });
};
