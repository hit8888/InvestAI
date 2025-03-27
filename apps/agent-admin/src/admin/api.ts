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

import adminApiClient from './client';

export const loginWithEmailPassword = (payload: LoginWithEmailPasswordPayload) =>
  adminApiClient.post(`/core/api/login/`, payload);

export const generateOtp = (payload: GenerateOtpPayload) => adminApiClient.post(`/core/api/generate-code/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) => adminApiClient.post(`/core/api/verify-code/`, payload);

export const regenerateTokens = (payload: GenerateTokens) => adminApiClient.post(`/core/api/token/refresh/`, payload);

export const getUserDataFromMeAPI = () => adminApiClient.get(`/core/api/me/`);

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

export const getFilterPreferences = async (tableName: string) => {
  return adminApiClient.get(`/tenant/api/filter-preferences/?table_name=${tableName}`);
};

export const getEntityDataBasedOnType = async (entityType: string) => {
  return adminApiClient.get(`/tenant/api/entity/?entity_type=${entityType}`);
};
