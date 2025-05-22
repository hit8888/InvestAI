import {
  ConversationsPayload,
  ExportFormatType,
  FilterOptionsPayload,
  GenerateOtpPayload,
  GenerateTokens,
  LeadsPayload,
  LoginWithEmailPasswordPayload,
  VerifyOtpPayload,
} from '@meaku/core/types/admin/api';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';

import adminApiClient from './client';
import { FeedbackRequestPayload } from '../types/api/feedback_request';

export const loginWithEmailPassword = (payload: LoginWithEmailPasswordPayload) =>
  adminApiClient.post(`/core/api/login/`, payload);

export const generateOtp = (payload: GenerateOtpPayload) => adminApiClient.post(`/core/api/generate-code/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) => adminApiClient.post(`/core/api/verify-code/`, payload);

export const regenerateTokens = (payload: GenerateTokens) => adminApiClient.post(`/core/api/token/refresh/`, payload);

export const getUserDataFromMeAPI = () => adminApiClient.get(`/core/api/me/`);

export const getAllAgents = () => adminApiClient.get(`/tenant/api/agent/`);

export const getLeadsRowData = (payload: LeadsPayload) => adminApiClient.post(`/tenant/api/search/leads/`, payload);

export const getConversationRowData = (payload: ConversationsPayload) =>
  adminApiClient.post(`tenant/api/search/conversations/`, payload);

export const downloadLeadsRowData = (payload: LeadsPayload, downloadType: ExportFormatType) => {
  return adminApiClient.post(`/tenant/api/leads/download/${downloadType}/`, payload, {
    responseType: 'blob',
  });
};

export const downloadConversationRowData = (payload: ConversationsPayload, downloadType: ExportFormatType) => {
  return adminApiClient.post(`tenant/api/conversations/download/${downloadType}/`, payload, {
    responseType: 'blob',
  });
};

export const getFilterOptionsData = (payload: FilterOptionsPayload, pageType: string) =>
  adminApiClient.post(`tenant/api/search/${pageType}/filterset/`, payload);

export const getConversationFunnelData = () => adminApiClient.get(`/tenant/api/analytics/funnels/conversations`);

export const getConversationDetailsData = (sessionId: string) =>
  adminApiClient.get(`tenant/api/conversations/${sessionId}/?fetch_all=true`);

export const getActiveConversationDetailsData = (sessionId: string, queryParams?: Record<string, string>) => {
  const queryParamsStr = queryParams ? new URLSearchParams(queryParams).toString() : '';
  return adminApiClient.get(`tenant/api/session/${sessionId}/details/?${queryParamsStr}`);
};

export const getFilterPreferences = async (tableName: string) => {
  return adminApiClient.get(`/tenant/api/filter-preferences/?table_name=${tableName}`);
};

export const getEntityDataBasedOnType = async (entityType: string) => {
  return adminApiClient.get(`/tenant/api/entity/?entity_type=${entityType}`);
};

export const getActiveConversations = async () => {
  return adminApiClient.get(`/tenant/api/search/sessions/live_sessions`);
};

// Agent Configs api endpoints
export const getBrandingAgentConfigs = async (agentId: number) => {
  return adminApiClient.get(`/tenant/api/agent/${agentId}`);
};

export const updateBrandingAgentConfigs = async (agentId: number, payload: AgentConfigPayload) => {
  return adminApiClient.put(`/tenant/api/agent/${agentId}/`, payload);
};

export const patchAgentConfigs = async (agentId: number, payload: Partial<AgentConfigPayload>) => {
  return adminApiClient.patch(`/tenant/api/agent/${agentId}/`, payload);
};

export const postResponseFeedbackFromDashboard = (sessionId: string, payload: FeedbackRequestPayload) => {
  return adminApiClient.post(`/tenant/api/sessions/${sessionId}/feedback/`, payload);
};

export const uploadAssetsFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return adminApiClient.post('/tenant/api/assets/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
