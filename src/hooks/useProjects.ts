import { useQuery } from '@tanstack/react-query';
import { projectApi, type Project } from '../api/project';

export const useProjects = (pageSize = 50) => {
  return useQuery<Project[]>({
    queryKey: ['projects', pageSize],
    queryFn: () => projectApi.list({ 
      pag_type: 'mobile', 
      page_size: pageSize 
    }),
    staleTime: 1000 * 60 * 60, // Projects change infrequently, cache for 1 hour
  });
};
