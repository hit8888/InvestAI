import {
  GetArtifactPayload,
  InitializationPayload,
  PostResponseFeedbackPayload,
  UpdateProspectPayload,
  UpdateSessionDataPayload,
} from "../types/api";
import { ENV } from "../types/env";
import apiClient from "./client";

export const ARTIFACT_BASE_API_URL = ENV.VITE_ARTIFACT_BASE_API_URL;

export const getConfig = (agentId: string) =>
  apiClient.get(`/tenant/chat/agent/${agentId}/config/`);

export const getArtifact = (
  payload: GetArtifactPayload,
  role: "agent" | "admin" = "agent"
) => {
  const originalUrl = apiClient.defaults.baseURL;
  // console.log("originalUrl", originalUrl);
  apiClient.defaults.baseURL = role === "admin" 
    ? ARTIFACT_BASE_API_URL 
    : originalUrl || '';
  // console.log("newUrl", apiClient.defaults.baseURL);
  const response = apiClient.get(
    `/tenant/chat/message/artifact/${payload.artifactId}?artifact_type=${payload.artifactType}`
  );

  // Reset back to original base URL
  apiClient.defaults.baseURL = originalUrl;

  return response;
};

export const initializeSession = (
  agentId: string,
  payload: InitializationPayload
) => apiClient.post(`/tenant/chat/agent/${agentId}/session/init/`, payload);

export const updateSession = (
  sessionId: string,
  agentId: string,
  payload: UpdateSessionDataPayload
) =>
  apiClient.put(
    `/tenant/chat/${agentId}/session/${sessionId}/update/`,
    payload
  );

export const postResponseFeedback = (
  sessionId: string,
  payload: PostResponseFeedbackPayload
) => apiClient.post(`/tenant/chat/session/${sessionId}/feedback/`, payload);

export const updateProspect = (
  prospectId: string,
  payload: UpdateProspectPayload
) => apiClient.put(`/tenant/chat/prospect/${prospectId}/update/`, payload);
