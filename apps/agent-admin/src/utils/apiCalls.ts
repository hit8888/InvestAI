import { AgentType } from '@meaku/core/types/admin/agent-configs';
import { getAllAgents } from '@meaku/core/adminHttp/api';
import { ENV } from '@meaku/core/types/env';
import { OrganizationDetailsResponse } from '@meaku/core/types/admin/api';

export const getAllAgentsForTenant = async () => {
  try {
    const response = await getAllAgents();
    return response.data.agents as AgentType[];
  } catch (error) {
    console.error('Error fetching agents for tenant', error);
    return [];
  }
};

export const getAgentIdFromTenant = async (): Promise<number | null> => {
  const agents = await getAllAgentsForTenant();
  if (agents.length > 0) {
    return agents[0].id; // taking first agent as default and must be active agent coming from backend
  }
  return null;
};

// Remove complex tenant switch tracking

export const getWebsocketBaseUrl = () => {
  // Ensure WebSocket URL uses wss:// protocol
  const protocol = 'wss:';
  const baseUrl = ENV.VITE_CHAT_BASE_API_URL?.replace(/^https?:/, protocol);
  return baseUrl;
};

/**
 * Processes login response by filtering and sorting organizations
 * Filters out organizations with empty tenant-name and sorts by name
 */
export const processLoginResponse = <T extends { data: { user: { organizations?: OrganizationDetailsResponse[] } } }>(
  response: T,
): T['data'] => {
  const organizations =
    response?.data?.user?.organizations?.filter((org: OrganizationDetailsResponse) => org['tenant-name'] !== '') ?? [];

  if (organizations.length > 0) {
    organizations.sort(
      (a: OrganizationDetailsResponse, b: OrganizationDetailsResponse) => a.name?.localeCompare(b.name ?? '') ?? 0,
    );
  }

  response.data.user.organizations = organizations;
  return response.data;
};
