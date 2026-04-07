import { useInfiniteQuery } from '@tanstack/react-query';
import { reportApi, type Viewer } from '../api/report';

export const useInfiniteViewers = (reportId: number) => {
  return useInfiniteQuery<Viewer[]>({
    queryKey: ['viewers', reportId],
    queryFn: ({ pageParam }) =>
      reportApi.getViewers({
        reportId,
        page_size: 5,
        pag_type: 'mobile',
        before_id: pageParam as number,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const lastViewer = lastPage[lastPage.length - 1];
      return lastViewer.id;
    },
    enabled: !!reportId,
  });
};
