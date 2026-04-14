import { useInfiniteQuery } from '@tanstack/react-query';
import { projectApi, type ProjectListResponse } from '../api/project';

export const useInfiniteProjects = (keyword?: string) => {
  return useInfiniteQuery<ProjectListResponse>({
    queryKey: ['projects', 'infinite', keyword],
    queryFn: ({ pageParam }) =>
      projectApi.list({
        pag_type: 'mobile',
        before_id: pageParam as number,
        page_size: 10,
        keyword,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // Extract results and find the ID of the last item for pagination
      const results = lastPage?.results || [];
      if (results.length === 0) return undefined;
      
      const lastProject = results[results.length - 1];
      return lastProject?.id;
    },
  });
};
