import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getCompanyICPConfig } from '../api/companyICPConfig';

export interface CompanyICPConfigResponse {
  agent_id: number;
  agent_name: string;
  company_icp_config: string;
}

/**
 * Hook to fetch company ICP config for an agent
 * @param agentId - The ID of the agent
 * @returns UseQueryResult with the company ICP config data
 */
export const useCompanyICPConfig = (agentId: number): UseQueryResult<CompanyICPConfigResponse> => {
  return useQuery({
    queryKey: ['company-icp-config', agentId],
    queryFn: async (): Promise<CompanyICPConfigResponse> => {
      const response: AxiosResponse<CompanyICPConfigResponse> = await getCompanyICPConfig(agentId);
      return response.data;
    },
  });
};
