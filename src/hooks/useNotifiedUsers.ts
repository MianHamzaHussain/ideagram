import { useQuery } from '@tanstack/react-query';
import { reportApi, type NotifiedUsers } from '../api/report';

export const useNotifiedUsers = (id: number) => {
  return useQuery<NotifiedUsers>({
    queryKey: ['notified-users', id],
    queryFn: () => reportApi.getNotifiedUsers(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
