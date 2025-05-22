import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@meaku/core/adminHttp/client';
import { Prompt } from '../query/usePrompts';

interface CreatePromptPayload {
  prompt: string;
  agent_id: number;
}

interface UpdatePromptPayload {
  prompt: string;
}

export const createPrompt = async (payload: CreatePromptPayload): Promise<Prompt> => {
  const response = await adminApiClient.post('/tenant/api/prompts/response-generation/', payload);
  return response.data;
};

export const updatePrompt = async (promptId: number, payload: UpdatePromptPayload): Promise<Prompt> => {
  const response = await adminApiClient.put(`/tenant/api/prompts/response-generation/prompt/${promptId}/`, payload);
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
