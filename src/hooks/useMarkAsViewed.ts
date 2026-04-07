import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportApi } from '../api/report';

export const useMarkAsViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reportApi.markAsViewed(id),
    onSuccess: (_, id) => {
      // Invalidate specific report data to update viewer counts and list
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      queryClient.invalidateQueries({ queryKey: ['viewers', id] });
    },
  });
};
