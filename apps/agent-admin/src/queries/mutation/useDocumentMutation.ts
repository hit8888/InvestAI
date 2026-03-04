import { createCustomDocument, updateCustomDocument, updateDocumentAccessType } from '@neuraltrade/core/adminHttp/api';
import { UpdateCustomDocumentRequest } from '@neuraltrade/core/types/admin/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCustomDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
    },
  });
};

export const useUpdateCustomDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCustomDocumentRequest }) =>
      updateCustomDocument(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
    },
  });
};

export const useUpdateDocumentAccessType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, accessType }: { documentId: string; accessType: 'INTERNAL' | 'EXTERNAL' }) =>
      updateDocumentAccessType(documentId, { access_type: accessType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
    },
  });
};
