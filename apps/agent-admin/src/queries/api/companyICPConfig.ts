import adminApiClient from '@neuraltrade/core/adminHttp/client';
import { UpdateCompanyICPConfigPayload } from '../mutation/useUpdateCompanyICPConfig';

/**
 * Fetches company ICP config for an agent
 * @param agentId - The ID of the agent
 * @returns Promise with the API response
 */
export const getCompanyICPConfig = async (agentId: number) => {
  return await adminApiClient.get(`/tenant/api/agent/${agentId}/company-icp-config/`);
};

/**
 * Updates company ICP config for an agent
 * @param agentId - The ID of the agent
 * @param payload - The payload containing the updated company ICP config
 * @returns Promise with the API response
 */
export const updateCompanyICPConfig = async (agentId: number, payload: UpdateCompanyICPConfigPayload) => {
  return await adminApiClient.patch(`/tenant/api/agent/${agentId}/company-icp-config/`, payload);
};
