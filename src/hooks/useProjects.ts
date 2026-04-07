import { useQuery } from '@tanstack/react-query';
import { projectApi, type Project } from '../api/project';

export const useProjects = (page = 1, pageSize = 50) => {
  return useQuery<{
    results: Project[];
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    queryKey: ['projects', page, pageSize],
    queryFn: () => projectApi.list(page, pageSize),
    staleTime: 1000 * 60 * 60, // Projects change infrequently, cache for 1 hour
  });
};
