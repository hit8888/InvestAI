import {
  AddWebpagesSitemapLinksRequest,
  AddWebpagesSitemapLinksResponse,
  AssignSdrRequest,
  AssignSdrResponse,
  BulkAddArtifactsRequest,
  BulkAddArtifactsResponse,
  BulkAddDocumentsRequest,
  BulkAddDocumentsResponse,
  BulkProcessDocumentsRequest,
  BulkReprocessArtifactsRequest,
  CalendarFormData,
  ChangePasswordPayload,
  ChangePasswordResponse,
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
  UserInfoResponse,
  ReachoutEmailPayload,
  GenerateOtpPayload,
  GenerateTokens,
  HourlySessionInsightsResponse,
  InsightsCommonRequest,
  InsightsSummaryResponse,
  IntegrationsResponse,
  LeadsPayload,
  CompaniesPayload,
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
  UpdateUserProfilePayload,
  UserProfileResponse,
  UserProfileUpdateResponse,
  UserManagementResponse,
  UserManagementCreateRequest,
  UserManagementUpdateRequest,
  UsersListResponse,
  UsersListQueryParams,
  VerifyOtpPayload,
  WeeklySessionInsightsResponse,
  VisitorsPayload,
  IcpConfigPayload,
  IcpConfigResponse,
  CreateThumbnailRequest,
  AssetUploadPayload,
  BaseFilePayload,
  VideoValidationRequest,
  VideoValidationResponse,
  BlocksResponse,
  Block,
  UpdateBlockPayload,
  RecalculateRelevanceScoreResponse,
  TaskStatus,
} from '@meaku/core/types/admin/api';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';

import adminApiClient from './client';
import { FeedbackRequestPayload } from '../types/api/feedback_request';

// Generic asset upload function that handles two use cases:
// 1. FormData-only uploads (for simple file uploads)
// 2. Payload with file + metadata (for uploads with additional data)
export const assetUpload = (url: string, payload: AssetUploadPayload, onProgress?: (progress: number) => void) => {
  let requestData: FormData;

  if (payload instanceof FormData) {
    // Use case 1: Direct FormData upload
    requestData = payload;
  } else {
    // Use case 2: Payload with file and metadata
    requestData = new FormData();
    requestData.append('file', payload.file);

    // Append other fields from payload (excluding file)
    Object.keys(payload).forEach((key) => {
      if (key !== 'file' && payload[key as keyof BaseFilePayload] !== undefined) {
        const value = payload[key as keyof BaseFilePayload];
        // Handle different value types appropriately
        if (value !== null && value !== undefined) {
          requestData.append(key, String(value));
        }
      }
    });
  }

  return adminApiClient.post(url, requestData, {
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

export const getFonts = (payload: { family?: string; subset?: string; capability?: string; sort?: string }) =>
  adminApiClient.get(`/core/api/fonts/`, { params: payload });

export const loginWithEmailPassword = (payload: LoginWithEmailPasswordPayload) =>
  adminApiClient.post(`/core/api/login/`, payload);

export const loginWithGoogleSso = (payload: LoginWithGoogleSsoPayload) =>
  adminApiClient.post(`/core/api/login/google/`, payload);

export const generateOtp = (payload: GenerateOtpPayload) => adminApiClient.post(`/core/api/generate-code/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) => adminApiClient.post(`/core/api/verify-code/`, payload);

export const changePassword = (payload: ChangePasswordPayload) =>
  adminApiClient.post<ChangePasswordResponse>(`/core/api/password/change/`, payload);

export const regenerateTokens = (payload: GenerateTokens) => adminApiClient.post(`/core/api/token/refresh/`, payload);

export const getUserDataFromMeAPI = () => adminApiClient.get<UserInfoResponse>(`/core/api/me/`);

export const getUserProfile = () => adminApiClient.get<UserProfileResponse>(`/tenant/api/users/profile/`);

export const updateUserProfile = (payload: UpdateUserProfilePayload) =>
  adminApiClient.patch<UserProfileUpdateResponse>(`/tenant/api/users/profile/`, payload);

export const getAllAgents = () => adminApiClient.get(`/tenant/api/agent/`);

export const getLeadsRowData = (payload: LeadsPayload) =>
  adminApiClient.post(`/tenant/api/search/leads/query/`, payload);

export const getCompaniesRowData = (payload: CompaniesPayload) =>
  adminApiClient.post(`/tenant/api/search/companies/query/`, payload);

export const getConversationRowData = (payload: ConversationsPayload) =>
  adminApiClient.post(`tenant/api/search/conversations/query/`, payload);

export const getVisitorsRowData = (payload: VisitorsPayload) =>
  adminApiClient.post(`tenant/api/prospects/query/`, payload);

export const exportTableData = (
  payload: LeadsPayload | ConversationsPayload | VisitorsPayload | CompaniesPayload,
  downloadType: ExportFormatType,
  tableName: string,
) => {
  return adminApiClient.post(`/tenant/api/${tableName}/download/${downloadType}/`, payload, {
    responseType: 'blob',
  });
};

export const getProspectsFilterOptionsData = (payload: FilterOptionsPayload) =>
  adminApiClient.post(`tenant/api/prospects/filterset/`, payload);

export const getFilterOptionsData = (payload: FilterOptionsPayload, pageType: string) =>
  adminApiClient.post(`tenant/api/search/${pageType}/filterset/`, payload);

export const getDataSourceFilterOptionsData = (payload: FilterOptionsPayload, pageType: string) =>
  adminApiClient.post(`tenant/api/${pageType}/filterset/`, payload);

export const getConversationFunnelData = () => adminApiClient.get(`/tenant/api/analytics/funnels/conversations`);

export const getConversationDetailsData = (sessionId: string) =>
  adminApiClient.get(`tenant/api/conversations/${sessionId}/?fetch_all=true`);

export const getSessionDetailsBySessionId = (sessionId: string) => {
  return adminApiClient.get(`tenant/api/session/${sessionId}/details/?chat_summary_required=true`);
};

export const getSessionDetailsByProspectId = (prospectId: string) => {
  return adminApiClient.get(`tenant/api/prospect/${prospectId}/details/?chat_summary_required=true`);
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

  return assetUpload('/tenant/api/assets/upload/', formData, onProgress);
};

export const uploadAssetsFromUrl = (url: string) => {
  const formData = new FormData();
  formData.append('url', url);
  return adminApiClient.post('/tenant/api/assets/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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

export const updateDocumentAccessType = (documentId: string, payload: { access_type: 'INTERNAL' | 'EXTERNAL' }) =>
  adminApiClient.patch(`/tenant/api/documents/${documentId}/`, payload);

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

export const deleteThumbnail = (thumbnailId: string) => adminApiClient.delete(`tenant/api/thumbnails/${thumbnailId}/`);

export const createThumbnail = (payload: CreateThumbnailRequest, onProgress?: (progress: number) => void) => {
  return assetUpload('/tenant/api/thumbnails/', payload, onProgress);
};

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

export const getWebpageScreenshots = (payload: { urls: string[] }) => {
  return adminApiClient.post(`/tenant/api/webpages/screenshots/`, payload);
};

export const getIcps = (payload: { company_name?: string | null; domain?: string | null }) => {
  return adminApiClient.post(`/tenant/api/icp-enrichment/`, payload);
};

export const getIcpDetails = (payload: { icp_id: number }) => {
  return adminApiClient.post(`/tenant/api/icp-email-enrichment/`, payload);
};

// Get organization users list API
export const getUsersList = (params?: UsersListQueryParams) =>
  adminApiClient.get<UsersListResponse>(`/tenant/api/users/`, { params });

export const getUserById = (userId: number) =>
  adminApiClient.get<UserManagementResponse>(`/tenant/api/users/${userId}/`);

export const createUser = (payload: UserManagementCreateRequest) =>
  adminApiClient.post<UserManagementResponse>(`/tenant/api/users/`, payload);

export const updateUser = (userId: number, payload: UserManagementUpdateRequest) =>
  adminApiClient.patch<UserManagementResponse>(`/tenant/api/users/${userId}/`, payload);

export const deleteUser = (userId: number) => adminApiClient.delete(`/tenant/api/users/${userId}/`);

// Assign SDR manually API
export const assignSdrManually = (payload: AssignSdrRequest) =>
  adminApiClient.post<AssignSdrResponse>(`/tenant/api/prospects/assign_sdr_manually/`, payload);

export const getIcpConfig = (agentId: number) =>
  adminApiClient.get<IcpConfigResponse>(`/tenant/api/agent/${agentId}/icp-config/`);

export const updateIcpConfig = (agentId: number, payload: Partial<IcpConfigPayload>) =>
  adminApiClient.patch(`/tenant/api/agent/${agentId}/icp-config/`, payload);

// AI Blocks API
export const getBlocks = (agentId: number) =>
  adminApiClient.get<BlocksResponse>(`/tenant/api/agent/${agentId}/blocks/`);

export const getBlock = (agentId: number, blockId: number) =>
  adminApiClient.get<Block>(`/tenant/api/agent/${agentId}/blocks/${blockId}/`);

export const updateBlock = (agentId: number, blockId: number, payload: UpdateBlockPayload) =>
  adminApiClient.patch<Block>(`/tenant/api/agent/${agentId}/blocks/${blockId}/`, payload);

// Video validation API
export const validateVideoUrls = (payload: VideoValidationRequest) =>
  adminApiClient.post<VideoValidationResponse>(`tenant/api/videos/validate/`, payload);

// Relevance score recalculation API
export const recalculateRelevanceScore = () =>
  adminApiClient.post<RecalculateRelevanceScoreResponse>(`/tenant/api/companies/relevance-score/recalculate/`);

export const getTaskStatus = (taskId: number) => adminApiClient.get<TaskStatus>(`/tenant/api/tasks/status/${taskId}/`);
