import { 
  VerifyOtpPayload, 
  GenerateOtpPayload, 
  LoginWithEmailPasswordPayload, 
} from "../types/admin/api";
import {
  GetArtifactPayload,
  InitializationPayload,
  PostResponseFeedbackPayload,
  UpdateProspectPayload,
  UpdateSessionDataPayload,
} from "../types/api";
import apiClient from "./client";

export const getConfig = (agentId: string) =>
  apiClient.get(`/tenant/chat/agent/${agentId}/config/`);

export const getArtifact = (payload: GetArtifactPayload) =>
  apiClient.get(
    `/tenant/chat/message/artifact/${payload.artifactId}?artifact_type=${payload.artifactType}`);
    

export const initializeSession = (
  agentId: string,
  payload: InitializationPayload,
) =>
  apiClient.post(`/tenant/chat/agent/${agentId}/session/init/`, payload);


export const updateSession = (
  sessionId: string,
  agentId: string,
  payload: UpdateSessionDataPayload,
) =>
  apiClient.put(
    `/tenant/chat/${agentId}/session/${sessionId}/update/`,
    payload
  );


export const postResponseFeedback = (
  sessionId: string,
  payload: PostResponseFeedbackPayload,
) =>
  apiClient.post(`/tenant/chat/session/${sessionId}/feedback/`, payload);


export const updateProspect = (
  prospectId: string,
  payload: UpdateProspectPayload,
) =>
  apiClient.put(`/tenant/chat/prospect/${prospectId}/update/`, payload);
  
export const loginWithEmailPassword = (
  payload: LoginWithEmailPasswordPayload
) => apiClient.post(`/core/api/login/`, payload);

export const generateOtp = (payload: GenerateOtpPayload) =>
  apiClient.post(`/core/api/generate-code/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) =>
  apiClient.post(`/core/api/verify-code/`, payload);