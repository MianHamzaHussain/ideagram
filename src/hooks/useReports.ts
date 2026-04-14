import { useInfiniteQuery } from '@tanstack/react-query';
import { reportApi, type InfiniteReportResponse } from '../api/report';

export interface UseReportsParams {
  reportType?: 'progress' | 'trouble';
  keyword?: string;
  projectId?: number;
  tags?: Record<number, number[]>;
}

export const useInfiniteReports = (params: UseReportsParams = {}) => {
  return useInfiniteQuery<InfiniteReportResponse>({
    queryKey: ['reports', params.reportType, params.keyword, params.projectId, params.tags],
    queryFn: ({ pageParam }) =>
      reportApi.list({
        pag_type: 'mobile',
        before_id: pageParam as number,
        report_type: params.reportType,
        page_size: 10,
        keyword: params.keyword,
        project_id: params.projectId,
        tags: params.tags,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // Backend returns a raw array, so we check lastPage.length
      if (!lastPage || lastPage.length === 0) return undefined;
      const lastReport = lastPage[lastPage.length - 1];
      return lastReport.id;
    },
  });
};

