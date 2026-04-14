import { useQuery } from '@tanstack/react-query';
import { projectApi, type Project, type ProjectListResponse } from '../api/project';

export const useProjects = (pageSize = 50) => {
  return useQuery<ProjectListResponse, Error, Project[]>({
    queryKey: ['projects', pageSize],
    queryFn: () => projectApi.list({
      pag_type: 'mobile',
      page_size: pageSize
    }),
    staleTime: 1000 * 60 * 60, // Projects change infrequently, cache for 1 hour
    select: (data) => data.results, // Extract the results array from the paginated response
  });
};
