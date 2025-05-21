import { AgentType } from '@meaku/core/types/admin/agent-configs';
import { getAllAgents } from '../admin/api';
import { setTenantIdentifier } from '@meaku/core/utils/index';
import toast from 'react-hot-toast';
import { OrganizationDetails } from '@meaku/core/types/admin/auth';

export const getAllAgentsForTenant = async () => {
  try {
    const response = await getAllAgents();
    return response.data.agents as AgentType[];
  } catch (error) {
    console.error('Error fetching agents for tenant', error);
    return [];
  }
};

export const setupTenantAndAgent = async (tenantData: OrganizationDetails) => {
  setTenantIdentifier(tenantData);
  const agents = await getAllAgentsForTenant();
  if (agents.length > 0) {
    const agentId = agents[0].id; // taking first agent as default and must be active agent coming from backend
    setTenantIdentifier({ ...tenantData, agentId }); // Adding agentId to tenantIdentifier
  } else {
    toast.error('No agents found for tenant');
  }
};
