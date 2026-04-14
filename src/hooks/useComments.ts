import { useInfiniteQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { commentApi, type Comment } from '../api/comment';

export const useInfiniteComments = (reportId: number) => {
  return useInfiniteQuery<Comment[]>({
    queryKey: ['comments', reportId],
    queryFn: ({ pageParam }) =>
      commentApi.list({
        report: reportId,
        page_size: 5,
        pag_type: 'mobile',
        before_id: pageParam as number,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // Backend returns a raw array, take the ID of the last comment for before_id
      if (!lastPage || lastPage.length === 0) return undefined;
      const lastComment = lastPage[lastPage.length - 1];
      return lastComment.id;
    },
  });
};

const invalidateCommentQueries = (queryClient: QueryClient, reportId: number) => {
  queryClient.invalidateQueries({ queryKey: ['comments', reportId] });
  queryClient.invalidateQueries({ queryKey: ['report', reportId] });
};

export const useCreateComment = (reportId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const comment = await commentApi.create({ report: reportId, text });
      await commentApi.publish(comment.id);
      return comment;
    },
    onSuccess: () => invalidateCommentQueries(queryClient, reportId),
  });
};

export const useUpdateComment = (reportId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: number; text: string }) => 
      commentApi.update(id, { report: reportId, text }),
    onSuccess: () => invalidateCommentQueries(queryClient, reportId),
  });
};

export const useDeleteComment = (reportId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => commentApi.delete(id),
    onSuccess: () => invalidateCommentQueries(queryClient, reportId),
  });
};
