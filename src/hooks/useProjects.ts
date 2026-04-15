import { useQuery } from '@tanstack/react-query';
import { projectApi, type Project, type ProjectListResponse } from '../api/project';
import { STALE_TIME, PAGE_SIZE } from '@/config/queryConfig';

export const useProjects = (pageSize = PAGE_SIZE.PROJECTS) => {
  return useQuery<ProjectListResponse, Error, Project[]>({
    queryKey: ['projects', pageSize],
    queryFn: () => projectApi.list({
      pag_type: 'mobile',
      page_size: pageSize
    }),
    staleTime: STALE_TIME.LONG,
    select: (data) => data.results, // Extract the results array from the paginated response
  });
};
