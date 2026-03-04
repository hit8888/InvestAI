import { useMutation, useQueryClient } from '@tanstack/react-query';
import { downloadLlmsTxt, generateLlmsTxt } from '@neuraltrade/core/adminHttp/api';
import { AxiosResponse, isAxiosError } from 'axios';
import { useSessionStore } from '../../stores/useSessionStore';

// Types
export interface GenerateLlmsTxtPayload {
  data_source_id: number;
  max_pages?: number;
}

export interface GenerateLlmsTxtResponse {
  workflow_id: string;
}

const generateLlmsTxtFile = async (payload: GenerateLlmsTxtPayload): Promise<GenerateLlmsTxtResponse> => {
  const response: AxiosResponse<GenerateLlmsTxtResponse> = await generateLlmsTxt(
    payload.data_source_id,
    payload.max_pages,
  );
  return response.data;
};

const downloadLlmsTxtFile = async (dataSourceId: number): Promise<Blob> => {
  const response: AxiosResponse<Blob> = await downloadLlmsTxt(dataSourceId);
  return response.data;
};

export const useGenerateLlmsTxt = () => {
  const queryClient = useQueryClient();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useMutation({
    mutationFn: generateLlmsTxtFile,
    onSuccess: (_data, variables) => {
      // Invalidate the details query to refresh the status
      queryClient.invalidateQueries({ queryKey: ['llms-txt-details', tenantName, variables.data_source_id] });
    },
    onError: (error, variables) => {
      // Invalidate on any error
      queryClient.invalidateQueries({ queryKey: ['llms-txt-details', tenantName, variables?.data_source_id] });
      if (
        isAxiosError(error) &&
        error.response?.status === 409 &&
        error.response.data?.error === 'workflow already running'
      ) {
        // handled in UI
      }
    },
  });
};

export const useDownloadLlmsTxt = () => {
  return useMutation({
    mutationFn: downloadLlmsTxtFile,
    onSuccess: (blob: Blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'llms.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};
