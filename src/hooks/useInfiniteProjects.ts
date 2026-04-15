import { useInfiniteQuery } from '@tanstack/react-query';
import { projectApi, type ProjectListResponse } from '@/api/project';

export const useInfiniteProjects = (keyword?: string) => {
  return useInfiniteQuery<ProjectListResponse>({
    queryKey: ['projects', 'infinite', keyword],
    queryFn: ({ pageParam }) =>
      projectApi.list({
        pag_type: 'standard',
        page: pageParam as number,
        page_size: 10,
        keyword,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      
      // If the backend returns the current page number, we can just increment it
      // StandardPagination in backend returns response.data["page"]
      const currentPage = lastPage.page || 1;
      const totalPages = lastPage.total_pages || 1;
      
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};
