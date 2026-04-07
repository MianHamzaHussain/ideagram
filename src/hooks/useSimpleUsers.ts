import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user';

export const useSimpleUsers = (projectId: string, authorId?: number, keyword?: string) => {
  return useQuery({
    queryKey: ['simple-users', projectId, authorId, keyword],
    queryFn: () => userApi.fetchSimpleUsers({ project_id: projectId, author_id: authorId, keyword }),
    enabled: !!projectId, // Only fetch if we have a project selected
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
