import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@meaku/core/adminHttp/client';
import { Prompt } from '../query/usePrompts';

export interface CreatePromptPayload {
  prompt: string;
  agent_id: number;
  prompt_type: string;
  agent_function: string;
}

interface UpdatePromptPayload {
  prompt: string;
  prompt_type: string;
  agent_function: string;
}

export const createPrompt = async (payload: CreatePromptPayload): Promise<Prompt> => {
  const response = await adminApiClient.post('/tenant/api/prompts/', payload);
  return response.data;
};

export const updatePrompt = async (promptId: number, payload: UpdatePromptPayload): Promise<Prompt> => {
  const response = await adminApiClient.patch(`/tenant/api/prompts/${promptId}/`, payload);
  return response.data;
};

export const deletePrompt = async (promptId: number): Promise<Prompt> => {
  const response = await adminApiClient.delete(`/tenant/api/prompts/${promptId}/`);
  return response.data;
};

export const useCreatePrompt = (agentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', agentId] });
    },
  });
};

export const useUpdatePrompt = (agentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promptId, payload }: { promptId: number; payload: UpdatePromptPayload }) =>
      updatePrompt(promptId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', agentId] });
    },
  });
};

export const useDeletePrompt = (agentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promptId }: { promptId: number }) => deletePrompt(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', agentId] });
    },
  });
};
