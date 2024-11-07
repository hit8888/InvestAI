import {
  GetArtifactPayload,
  InitializationPayload,
  PostResponseFeedbackPayload,
  UpdateProspectPayload,
  UpdateSessionDataPayload,
} from "../types/api";
import apiClient from "./client";

export const getConfig = (tenantName: string, agentId: string) =>
  apiClient.get(`/tenant/chat/agent/${agentId}/config/`, {
    headers: {
      "x-tenant-name": tenantName,
    },
  });

export const getArtifact = (tenantName: string, payload: GetArtifactPayload) =>
  apiClient.get(
    `/tenant/chat/message/artifact/${payload.artifactId}?artifact_type=${payload.artifactType}`,
    {
      headers: {
        "x-tenant-name": tenantName,//TODO: Set up headers inside interceptor
      },
    },
  );

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
