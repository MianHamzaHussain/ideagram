import { useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { reportApi, type Report, type InfiniteReportResponse } from '../api/report';

export const useReportDetails = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery<Report>({
    queryKey: ['report', id],
    queryFn: () => reportApi.getById(id),
    // Industry Standard: Seed the detail cache with existing data from the reports list 
    // for an "instant" perceived load time.
    initialData: () => {
      // Look into ALL 'reports' list queries (filtered or unfiltered)
      const allInfiniteData = queryClient.getQueriesData<InfiniteData<InfiniteReportResponse>>({ 
        queryKey: ['reports'] 
      });

      for (const [_, data] of allInfiniteData) {
        if (!data) continue;
        // Search through pages for the specific report ID
        for (const page of data.pages) {
          const foundReport = page.find((r: Report) => r.id === id);
          if (foundReport) {
            return foundReport;
          }
        }
      }
      return undefined;
    },
    // Prevent immediate refetching if we already have it in the details cache
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
