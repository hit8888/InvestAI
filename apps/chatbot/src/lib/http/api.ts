import {
  InitializationPayload,
  UpdateSessionDataPayload,
} from "../../types/api";
import apiClient from "./client";

export const initializeSession = (
  tenantName: string,
  agentId: string,
  payload: InitializationPayload,
) =>
  apiClient.post(`/tenant/chat/agent/${agentId}/session/init/`, payload, {
    headers: {
      "x-tenant-name": tenantName,
    },
  });

export const updateSession = (
  sessionId: string,
  agentId: string,
  payload: UpdateSessionDataPayload,
) =>
  apiClient.put(`/tenant/chat/${agentId}/session/${sessionId}/update`, payload);
