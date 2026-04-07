import { useQuery } from '@tanstack/react-query';
import { tagApi, type Tag } from '../api/tag';

export const useTags = (reportType: number) => {
  return useQuery({
    queryKey: ['tags', reportType],
    queryFn: () => tagApi.list(reportType),
    enabled: reportType > 0, // Only fetch if reportType is valid
    staleTime: 1000 * 60 * 60, // Tags are static metadata, cache for 1 hour
    select: (data) => data.results as Tag[], // Return the raw array of results
  });
};
