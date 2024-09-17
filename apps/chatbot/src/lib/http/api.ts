import apiClient from "./client";

type InitializationPayload = {
  url: string;
  session_id?: string;
  prospect_id?: string;
};

export const initialize = (
  tenantName: string,
  agentId: string,
  payload: InitializationPayload,
) =>
  apiClient.post(`/tenant/chat/agent/${agentId}/session/init/`, payload, {
    headers: {
      "x-tenant-name": tenantName,
    },
  });
