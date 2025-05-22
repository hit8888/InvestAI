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

export const fetchPrompts = async (agentId: number): Promise<Prompt[]> => {
  const response = await adminApiClient.get(`/tenant/api/prompts/response-generation/${agentId}`);
  return response.data;
};

export const usePrompts = (agentId: number) => {
  return useQuery({
    queryKey: ['prompts', agentId],
    queryFn: () => fetchPrompts(agentId),
  });
};
