import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportApi } from '@/api/report';

export const useAddViewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: number) => reportApi.addViewer(reportId),
    onSuccess: (_, reportId) => {
      // Invalidate viewers list to show the new viewer
      queryClient.invalidateQueries({ queryKey: ['viewers', reportId] });
      // Also potentially invalidate the report details if viewerCount is displayed
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
    },
  });
};
