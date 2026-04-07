import { useInfiniteQuery } from '@tanstack/react-query';
import { reportApi, type InfiniteReportResponse } from '../api/report';

export const useInfiniteReports = (reportType?: 'progress' | 'problem') => {
  // Mapping 'progress' | 'problem' to string identifiers for the API
  const typeStr = reportType === 'progress' ? 'progress' : reportType === 'problem' ? 'trouble' : undefined;

  return useInfiniteQuery<InfiniteReportResponse>({
    queryKey: ['reports', reportType],
    queryFn: ({ pageParam }) =>
      reportApi.list({
        pag_type: 'mobile',
        before_id: pageParam as number,
        report_type: typeStr,
        page_size: 5,
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
