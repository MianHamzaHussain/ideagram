import { useInfiniteQuery } from '@tanstack/react-query';
import { projectApi, type InfiniteProjectResponse } from '../api/project';

export const useInfiniteProjects = (keyword?: string) => {
  return useInfiniteQuery<InfiniteProjectResponse>({
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
      // Defense against unexpected API response structure
      if (!lastPage || !Array.isArray(lastPage) || lastPage.length === 0) return undefined;
      const lastProject = lastPage[lastPage.length - 1];
      if (!lastProject) return undefined;
      return lastProject.id;
    },

  });
};
