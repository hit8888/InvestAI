import {
  VerifyOtpPayload,
  GenerateOtpPayload,
  LoginWithEmailPasswordPayload,
  LeadsPayload,
  ConversationsPayload,
  GenerateTokens,
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

export const getConversationFunnelData = () => adminApiClient.get(`/tenant/api/analytics/funnels/conversations`);
export const getConversationDetailsData = (sessionId: string, fetchAll?: boolean) => {
  const url = new URL(`tenant/api/conversations/${sessionId}`, adminApiClient.defaults.baseURL);

  if (fetchAll !== undefined) {
    url.searchParams.append('fetch_all', String(fetchAll));
  }

  return adminApiClient.get(url.toString());
};
