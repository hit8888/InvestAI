import apiClient from "./client";

export const initialize = (tenantName: string, agentId: string) =>
  apiClient.post(`/tenant/chat/agent/${agentId}/session/init`, null, {
    headers: {
      "x-tenant-name": tenantName,
    },
  });
