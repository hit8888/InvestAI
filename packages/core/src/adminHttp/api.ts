import {
  AddWebpagesSitemapLinksRequest,
  AddWebpagesSitemapLinksResponse,
  BulkAddArtifactsRequest,
  BulkAddArtifactsResponse,
  BulkAddDocumentsRequest,
  BulkAddDocumentsResponse,
  BulkProcessDocumentsRequest,
  BulkReprocessArtifactsRequest,
  CalendarFormData,
  ConversationsPayload,
  CreateAndUpdateCustomDocumentResponse,
  CreateCustomDocumentRequest,
  DailySessionInsightsResponse,
  DataSourcePayload,
  DeleteArtifactsRequest,
  DeleteArtifactsResponse,
  DeleteDocumentsRequest,
  DeleteDocumentsResponse,
  DeleteWebpagesRequest,
  DeleteWebpagesResponse,
  ExportFormatType,
  FetchSitemapRequest,
  FetchSitemapResponse,
  FilterOptionsPayload,
  FrequentDocumentsResponse,
  ReachoutEmailPayload,
  GenerateOtpPayload,
  GenerateTokens,
  HourlySessionInsightsResponse,
  InsightsCommonRequest,
  InsightsSummaryResponse,
  IntegrationsResponse,
  LeadsPayload,
  LoginWithEmailPasswordPayload,
  LoginWithGoogleSsoPayload,
  ReprocessWebpagesRequest,
  ReprocessWebpagesResponse,
  SessionInsightsRequest,
  TenantMetadataResponse,
  TenantMetadataUpdateRequest,
  TopQuestionsByUserResponse,
  UpdateArtifactRequest,
  UpdateCustomDocumentRequest,
  VerifyOtpPayload,
  WeeklySessionInsightsResponse,
} from '@meaku/core/types/admin/api';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';

import adminApiClient from './client';
import { FeedbackRequestPayload } from '../types/api/feedback_request';

export const getFonts = (payload: { family?: string; subset?: string; capability?: string; sort?: string }) =>
  adminApiClient.get(`/core/api/fonts/`, { params: payload });

export const loginWithEmailPassword = (payload: LoginWithEmailPasswordPayload) =>
  adminApiClient.post(`/core/api/login/`, payload);

export const loginWithGoogleSso = (payload: LoginWithGoogleSsoPayload) =>
  adminApiClient.post(`/core/api/login/google/`, payload);

export const generateOtp = (payload: GenerateOtpPayload) => adminApiClient.post(`/core/api/generate-code/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) => adminApiClient.post(`/core/api/verify-code/`, payload);

export const regenerateTokens = (payload: GenerateTokens) => adminApiClient.post(`/core/api/token/refresh/`, payload);

export const getUserDataFromMeAPI = () => adminApiClient.get(`/core/api/me/`);

export const getAllAgents = () => adminApiClient.get(`/tenant/api/agent/`);

export const getLeadsRowData = (payload: LeadsPayload) =>
  adminApiClient.post(`/tenant/api/search/leads/query/`, payload);

export const getConversationRowData = (payload: ConversationsPayload) =>
  adminApiClient.post(`tenant/api/search/conversations/query/`, payload);

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

export const getDataSourceFilterOptionsData = (payload: FilterOptionsPayload, pageType: string) =>
  adminApiClient.post(`tenant/api/${pageType}/filterset/`, payload);

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

export const uploadAssetsFile = (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);

  return adminApiClient.post('/tenant/api/assets/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

export const getDataSourceOverviewData = () => adminApiClient.get(`tenant/api/datasources/overview/`);

export const getDataSourceWebpagesData = (payload: DataSourcePayload) =>
  adminApiClient.post(`tenant/api/webpages/query/`, payload);

export const getDataSourceDocumentsData = (payload: DataSourcePayload) =>
  adminApiClient.post(`tenant/api/documents/query/`, payload);

export const getDataSourceWebpagesItemData = (dataSourceID: number) =>
  adminApiClient.get(`tenant/api/webpages/${dataSourceID}/`);

export const getDataSourceDocumentsItemData = (dataSourceID: number) =>
  adminApiClient.get(`tenant/api/documents/${dataSourceID}/`);

export const getDataSourceArtifactsData = (payload: DataSourcePayload) =>
  adminApiClient.post(`/tenant/api/artifacts/query/`, payload);

export const bulkAddArtifacts = (payload: BulkAddArtifactsRequest) =>
  adminApiClient.post<BulkAddArtifactsResponse>(`/tenant/api/artifacts/bulk/`, payload);

export const updateArtifact = (id: number, payload: UpdateArtifactRequest) =>
  adminApiClient.patch<BulkAddArtifactsResponse>(`/tenant/api/artifacts/${id}/`, payload);

export const createCustomDocument = (payload: CreateCustomDocumentRequest) =>
  adminApiClient.post<CreateAndUpdateCustomDocumentResponse>(`/tenant/api/documents/create/`, payload);

export const updateCustomDocument = (id: number, payload: UpdateCustomDocumentRequest) =>
  adminApiClient.put<CreateAndUpdateCustomDocumentResponse>(`/tenant/api/documents/${id}/`, payload);

export const fetchSitemapforWebpage = (payload: FetchSitemapRequest) =>
  adminApiClient.post<FetchSitemapResponse>(`tenant/api/sitemap/`, payload);

export const addWebpagesSitemapLinks = (payload: AddWebpagesSitemapLinksRequest) =>
  adminApiClient.post<AddWebpagesSitemapLinksResponse>(`tenant/api/webpages/add/`, payload);

export const bulkAddDocuments = (payload: BulkAddDocumentsRequest) =>
  adminApiClient.post<BulkAddDocumentsResponse>(`tenant/api/documents/bulk/`, payload);

export const deleteWebpages = (payload: DeleteWebpagesRequest) =>
  adminApiClient.delete<DeleteWebpagesResponse>(`tenant/api/webpages/delete/`, { data: payload });

export const deleteArtifacts = (payload: DeleteArtifactsRequest) =>
  adminApiClient.delete<DeleteArtifactsResponse>(`tenant/api/artifacts/bulk/`, { data: payload });

export const deleteDocuments = (payload: DeleteDocumentsRequest) =>
  adminApiClient.delete<DeleteDocumentsResponse>(`tenant/api/documents/bulk/`, { data: payload });

export const reprocessWebpages = (payload: ReprocessWebpagesRequest) =>
  adminApiClient.post<ReprocessWebpagesResponse>(`tenant/api/webpages/reprocess/`, payload);

export const bulkProcessDocuments = (payload: BulkProcessDocumentsRequest) =>
  adminApiClient.post(`tenant/api/documents/bulk-process/`, payload);

export const bulkReprocessArtifacts = (payload: BulkReprocessArtifactsRequest) =>
  adminApiClient.post(`tenant/api/artifacts/bulk-reprocess/`, payload);

export const getInsightsSummary = (payload: InsightsCommonRequest) =>
  adminApiClient.post<InsightsSummaryResponse>(`tenant/api/analytics/ai-generated-summary/`, payload);

export const getSessionInsights = <
  T extends DailySessionInsightsResponse | WeeklySessionInsightsResponse | HourlySessionInsightsResponse,
>(
  payload: SessionInsightsRequest,
) => adminApiClient.post<T>(`tenant/api/analytics/session-count-by-interval/`, payload);

export const getFrequentSourcesInsights = (payload: InsightsCommonRequest) =>
  adminApiClient.post<FrequentDocumentsResponse>(`tenant/api/analytics/most-frequently-referenced-documents/`, payload);

export const getTopQuestionsAskedByUser = (payload: InsightsCommonRequest) =>
  adminApiClient.post<TopQuestionsByUserResponse>(`tenant/api/analytics/top-user-questions-asked/`, payload);

export const getTopQuestionsClickedByUser = (payload: InsightsCommonRequest) =>
  adminApiClient.post<TopQuestionsByUserResponse>(`tenant/api/analytics/top-user-questions-clicked/`, payload);

export const getIntegrations = () => adminApiClient.get<IntegrationsResponse>(`/tenant/api/integrations/`);

export const connectIntegration = (integrationType: string, formData?: Record<string, string>) => {
  return adminApiClient.post(`/tenant/api/integration/${integrationType}/connect`, formData);
};

export const connectIntegrationCallback = (payload: { code: string; state: string }) =>
  adminApiClient.get(`/tenant/integration/oauth2/callback?code=${payload.code}&state=${payload.state}`);

export const disconnectIntegration = (integrationType: string) => {
  return adminApiClient.post(`/tenant/api/integration/${integrationType}/disconnect`);
};

export const getCalendars = () => adminApiClient.get(`/tenant/api/calendars/`);

export const getMyCalendars = () => adminApiClient.get(`/tenant/api/calendars/my-calendars/`);

export const getManagedCalendars = () => adminApiClient.get(`/tenant/api/calendars/managed-calendars/`);

export const createCalendar = (payload: CalendarFormData) => adminApiClient.post(`/tenant/api/calendars/`, payload);

export const updateCalendar = (calendarId: number, payload: Partial<CalendarFormData>) =>
  adminApiClient.put(`/tenant/api/calendars/${calendarId}/`, payload);

export const deleteCalendar = (calendarId: number) => adminApiClient.delete(`/tenant/api/calendars/${calendarId}/`);

// Create breakout calendar
export const createBreakoutCalendar = (payload: { timezone?: string }) =>
  adminApiClient.post(`/tenant/api/calendars/create-managed-calendar/`, payload);

// Refresh user token
export const refreshUserToken = () => adminApiClient.post(`/tenant/api/calendars/refresh-user-token/`);

// LLMs.txt API endpoints
export const generateLlmsTxt = (dataSourceId: number, maxPages?: number) => {
  const payload = { data_source_id: dataSourceId, ...(maxPages && { max_pages: maxPages }) };
  return adminApiClient.post(`/tenant/api/llm-txt/`, payload);
};

export const downloadLlmsTxt = (dataSourceId: number) => {
  return adminApiClient.get(`/tenant/api/llm-txt/`, {
    params: { data_source_id: dataSourceId },
    responseType: 'blob',
  });
};

export const getLlmsTxtDetails = (dataSourceId: number) => {
  return adminApiClient.get(`/tenant/api/llm-txt/details/`, { params: { data_source_id: dataSourceId } });
};

export const getDataSourcesQuery = (payload: DataSourcePayload) => {
  return adminApiClient.post(`/tenant/api/datasources/query/`, payload);
};

export const getConversationProcessingTimeLog = (payload: InsightsCommonRequest) => {
  return adminApiClient.post(`/tenant/api/analytics/processing-time-logs/`, payload);
};

export const getBuyerIntentDistribution = (payload: InsightsCommonRequest) => {
  return adminApiClient.post(`/tenant/api/analytics/buyer-intent-distribution/`, payload);
};

export const getProductInterestDistribution = (payload: InsightsCommonRequest) => {
  return adminApiClient.post(`/tenant/api/analytics/product-interest-distribution/`, payload);
};

export const getCountryDistribution = (payload: InsightsCommonRequest) => {
  return adminApiClient.post(`/tenant/api/analytics/country-distribution/`, payload);
};

export const getTenantMetadata = (tenantIdentifier: string) =>
  adminApiClient.get<TenantMetadataResponse>(`/core/api/organization/${tenantIdentifier}/metadata/`);

export const updateTenantMetadata = (tenantIdentifier: string, payload: TenantMetadataUpdateRequest) =>
  adminApiClient.patch<TenantMetadataResponse>(`/core/api/organization/${tenantIdentifier}/metadata/`, payload);

export const reachoutEmail = (payload: ReachoutEmailPayload) => {
  return adminApiClient.post(`/tenant/api/generate-reachout-email/`, payload);
};
