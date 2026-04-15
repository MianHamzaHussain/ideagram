import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/api/report';
import { STALE_TIME } from '@/config/queryConfig';

export const useNotifiedUsers = (reportId: number) => {
  return useQuery({
    queryKey: ['notifiedUsers', reportId],
    queryFn: () => reportApi.getNotifiedUsers(reportId),
    enabled: !!reportId,
    staleTime: STALE_TIME.DEFAULT,
  });
};
