import { AgentType } from '@meaku/core/types/admin/agent-configs';
import { getAllAgents } from '@meaku/core/adminHttp/api';
import { setTenantIdentifier } from '@meaku/core/utils/index';
import toast from 'react-hot-toast';
import { OrganizationDetails } from '@meaku/core/types/admin/auth';
import { ENV } from '@meaku/core/types/env';

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

export const setupTenantAndAgent = async (tenantData: OrganizationDetails) => {
  setTenantIdentifier(tenantData);
  const agentId = await getAgentIdFromTenant();
  if (agentId) {
    setTenantIdentifier({ ...tenantData, agentId }); // Adding agentId to tenantIdentifier
  } else {
    toast.error('No agents found for tenant');
  }
};

export const getWebsocketBaseUrl = () => {
  // Ensure WebSocket URL uses wss:// protocol
  const protocol = 'wss:';
  const baseUrl = ENV.VITE_CHAT_BASE_API_URL?.replace(/^https?:/, protocol);
  return baseUrl;
};
