import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@meaku/core/adminHttp/client';

export interface Prompt {
  id?: number;
  prompt: string;
  prompt_type?: string;
  agent_function?: string;
  agent_id: number;
  created_on?: string;
  updated_on?: string;
}

interface FetchPromptsPayload {
  filters: {
    field: string;
    value: string | number | null;
    operator?: string;
  }[];
}

export const fetchPrompts = async (payload: FetchPromptsPayload): Promise<Prompt[]> => {
  const response = await adminApiClient.post(`/tenant/api/prompts/query/`, payload);
  return response.data?.results;
};

export const usePrompts = (payload: FetchPromptsPayload) => {
  return useQuery({
    queryKey: ['prompts', payload],
    queryFn: () => fetchPrompts(payload),
    refetchOnMount: 'always',
  });
};
