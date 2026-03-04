import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createThumbnail, deleteThumbnail } from '@neuraltrade/core/adminHttp/api';
import { CreateThumbnailRequest } from '@neuraltrade/core/types/admin/api';

interface DeleteThumbnailParams {
  thumbnailId: string;
}

/**
 * Hook for deleting a thumbnail
 * @returns Mutation object for deleting a thumbnail
 */
export const useDeleteThumbnailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ thumbnailId }: DeleteThumbnailParams) => deleteThumbnail(thumbnailId),
    onSuccess: () => {
      // Invalidate and refetch agent configs after successful mutation
      queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
    },
  });
};

interface CreateThumbnailParams extends CreateThumbnailRequest {
  onProgress?: (progress: number) => void;
}

export const useCreateThumbnailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateThumbnailParams) =>
      createThumbnail(
        { file: params.file, artifact_id: params.artifact_id, thumbnail_type: params.thumbnail_type },
        params.onProgress,
      ),
    onSuccess: () => {
      // Invalidate and refetch agent configs after successful mutation
      queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
    },
  });
};
