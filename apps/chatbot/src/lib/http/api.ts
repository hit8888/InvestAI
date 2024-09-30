import {
  InitializationPayload,
  PostResponseFeedbackPayload,
  UpdateProspectPayload,
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
  tenantName: string,
  payload: UpdateSessionDataPayload,
) =>
  apiClient.put(
    `/tenant/chat/${agentId}/session/${sessionId}/update/`,
    payload,
    {
      headers: {
        "x-tenant-name": tenantName,
      },
    },
  );

export const postResponseFeedback = (
  sessionId: string,
  tenantName: string,
  payload: PostResponseFeedbackPayload,
) =>
  apiClient.post(`/tenant/chat/session/${sessionId}/feedback/`, payload, {
    headers: {
      "x-tenant-name": tenantName,
    },
  });

export const updateProspect = (
  tenantName: string,
  prospectId: string,
  payload: UpdateProspectPayload,
) =>
  apiClient.put(`/tenant/chat/prospect/${prospectId}/update/`, payload, {
    headers: {
      "x-tenant-name": tenantName,
    },
  });
