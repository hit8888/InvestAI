import { z } from 'zod';
import { WebSocketMessageSchema } from '../webSocketData';
import { FeedbackRequestPayloadSchema } from '../api/feedback_request';

// LoginWithEmailPasswordPayload
export const LoginWithEmailPasswordPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginWithEmailPasswordPayload = z.infer<typeof LoginWithEmailPasswordPayloadSchema>;

// GoogleSsoPayload
export const LoginWithGoogleSsoPayloadSchema = z.object({
  code: z.string(),
  redirect_uri: z.string(),
});
export type LoginWithGoogleSsoPayload = z.infer<typeof LoginWithGoogleSsoPayloadSchema>;

// GenerateOtpPayload
export const GenerateOtpPayloadSchema = z.object({
  email: z.string().email(),
});
export type GenerateOtpPayload = z.infer<typeof GenerateOtpPayloadSchema>;

// GenerateTokens
export const GenerateTokensSchema = z.object({
  refresh: z.string(),
});
export type GenerateTokens = z.infer<typeof GenerateTokensSchema>;

// VerifyOtpPayload
export const VerifyOtpPayloadSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});
export type VerifyOtpPayload = z.infer<typeof VerifyOtpPayloadSchema>;

// Operator
export const OperatorSchema = z.enum([
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'contains',
  'icontains',
  'in',
  'not_in',
  'isnull',
  'is_not_null',
  'exists',
  'not_exists',
  'between',
]);
export type Operator = z.infer<typeof OperatorSchema>;

// Filter
export const FilterSchema = z.object({
  field: z.string(),
  operator: OperatorSchema,
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()])), z.null()]),
});
export type FilterItem = z.infer<typeof FilterSchema>;

// Sort
export const SortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']),
});
export type SortItem = z.infer<typeof SortSchema>;

// LeadsPayload
export const LeadsPayloadSchema = z.object({
  filters: z.array(FilterSchema),
  sort: z.array(SortSchema),
  search: z.string().optional(),
  page: z.number(),
  page_size: z.number().optional(),
});
export type LeadsPayload = z.infer<typeof LeadsPayloadSchema>;

export enum ExportFormat {
  XLSX = 'XLSX',
  CSV = 'CSV',
}

export const ExportFormatSchema = z.enum([ExportFormat.XLSX, ExportFormat.CSV]);
export type ExportFormatType = z.infer<typeof ExportFormatSchema>;

// ConversationsPayload
export const TablePayloadSchema = z.object({
  filters: z.array(FilterSchema),
  sort: z.array(SortSchema),
  search: z.string().optional(),
  page: z.number(),
  page_size: z.number().optional(),
});
export type ConversationsPayload = z.infer<typeof TablePayloadSchema>;
export type DataSourcePayload = z.infer<typeof TablePayloadSchema>;

export const AdditionalInfoSchema = z
  .object({
    loc: z.string(),
    city: z.string(),
    region: z.string(),
    role: z.string().optional().nullable(),
    budget: z.string().optional().nullable(),
    timeline: z.string().optional().nullable(),
    product_interest: z.string().optional().nullable(),
    summary: z.string().optional(),
    timezone: z.string().optional(),
    country: z.string().optional(),
    last_name: z.string().optional(),
    first_name: z.string().optional(),
    ip_address: z.string().optional(),
    buyer_intent: z.string().optional(),
  })
  .or(z.object({}));

// Type for individual result item
export const LeadResultSchema = z.object({
  id: z.number(),
  external_id: z.string().nullable(),
  prospect_id: z.string().nullable(),
  session_id: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  role: z.string().nullable(),
  country: z.string().nullable(),
  company: z.string().nullable(),
  company_size: z.string().nullable(),
  company_industry: z.string().nullable(),
  budget: z.string().nullable(),
  timeline: z.string().nullable(),
  product_interest: z.string().nullable(),
  additional_info: AdditionalInfoSchema.optional().nullable(),
  created_on: z.string(), // ISO date string
  updated_on: z.string(), // ISO date string
  lead_type: z.string().optional(),
});

export const EnrichmentSourceEnum = z.enum(['ip_enrichment', 'user_provided', 'crm_extracted', 'utm_extracted']);

export const ProspectDetailsSchema = z.object({
  loc: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  ip_address: z.string().optional(),
  role: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  product_interest: z.string().optional().nullable(),
  enrichment_source: EnrichmentSourceEnum.optional().nullable(),
  linkedin_url: z.string().optional().nullable(),
  enriched_info: z.record(z.string(), z.string().optional().nullable()).optional().nullable(),
});

export const CompanyDetailsSchema = z.object({
  id: z.number().optional(),
  keywords: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  ip_address: z.array(z.string()).optional(),
  ip_country: z.string().optional(),
  competitors: z.array(z.string()).optional(),
  website_url: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  company_type: z.string().optional().nullable(),
  linkedin_url: z.string().optional().nullable(),
  brief_summary: z.string().optional().nullable(),
  employee_count: z.string().optional().or(z.string()),
  company_country: z.string().optional().nullable(),
  company_revenue: z.string().optional().nullable(),
  industry_domain: z.string().optional().nullable(),
  enrichment_provider: z.string().optional().nullable(),
  operating_countries: z.array(z.string()).optional(),
  enrichment_source: EnrichmentSourceEnum.optional().nullable(),
});

export const ConversationsResponseResultSchema = z.object({
  buyer_intent_score: z.number().nullable(),
  buyer_intent: z.string().nullable(),
  session_id: z.string().nullable(),
  timestamp: z.string().nullable(), // ISO date-time string
  summary: z.string().nullable(),
  ip_address: z.string().nullable(),
  budget: z.string().nullable(),
  timeline: z.string().nullable(),
  product_of_interest: z.string().nullable(),
  company: z.string().nullable(),
  name: z.string().nullable(),
  need: z.string().nullable(),
  email: z.string().nullable(),
  role: z.string().nullable(),
  country: z.string().nullable(),
  user_message_count: z.number(),
  is_test: z.boolean(),
  prospect_details: ProspectDetailsSchema.optional().nullable(),
  company_details: CompanyDetailsSchema.optional().nullable(),
});

export const PaginationDataSchema = z.object({
  current_page: z.number().nonnegative(), // Current page number, must be >= 0
  page_size: z.number().nonnegative(), // Items per page, must be >= 0
  total_pages: z.number().nonnegative(), // Total number of pages, must be >= 0
  total_records: z.number().nonnegative(), // Total number of records, must be >= 0
});

export const LeadsTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(LeadResultSchema), // Array of lead results
});

export const ConversationsTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(ConversationsResponseResultSchema), // Array of conversation results
});

// Schema for individual step
export const FunnelStepSchema = z.object({
  name: z.string(), // Name of the step
  count: z.number(), // Count of items in the step
  conversion_rate: z.number(), // Conversion rate for the step
});

// Schema for the entire funnel
export const ConversationFunnelResponseSchema = z.object({
  funnel_id: z.number(), // Unique ID for the funnel
  funnel_name: z.string(), // Name of the funnel
  steps: z.array(FunnelStepSchema), // Array of funnel steps
  total_conversion_rate: z.number(), // Total conversion rate
  analyzed_at: z.string(), // ISO date-time string when analyzed
});

// Schema for the Entire Conversation Details Schema
export const ConversationDetailsResponseSchema = z.object({
  chat_history: z.array(WebSocketMessageSchema),
  conversation: ConversationsResponseResultSchema.nullable(),
  feedback: z.array(FeedbackRequestPayloadSchema).optional(),
});

export const ActiveConversationDetailsResponseSchema = z.object({
  chat_history: z.array(WebSocketMessageSchema),
  chat_summary: z.string(),
});

// Schema for Filter Options - Payload & Response
export const FilterOptionsPayloadSchema = z.object({
  field: z.string(),
  filters: z.array(FilterSchema),
  search: z.string(),
});

export const FilterOptionsResponseSchema = z.object({
  field: z.string(),
  values: z.array(z.string()),
});

export type FilterOptionsPayload = z.infer<typeof FilterOptionsPayloadSchema>;
export type FilterOptionsResponse = z.infer<typeof FilterOptionsResponseSchema>;

export const FilterPreferencesResponseSchema = z.object({
  id: z.number(),
  table_name: z.string(),
  filter_data: z.object({
    sort: z.array(SortSchema),
    filters: z.array(FilterSchema),
  }),
  source: z.enum(['user', 'organization']),
});

export type FilterPreferencesResponseType = z.infer<typeof FilterPreferencesResponseSchema>;

export const EntityMetadataSchema = z.object({
  id: z.number(),
  entity_type: z.string(),
  source: z.string(),
  key_name: z.string(),
  display_name: z.string(),
  column_name: z.string(),
  description: z.string(),
  data_type: z.string(),
  parent_column: z.string().nullable(),
});

export type EntityMetadataSchemaType = z.infer<typeof EntityMetadataSchema>;

export const EntityMetadataResponseSchema = z.array(EntityMetadataSchema);

export type EntityMetadataResponseType = z.infer<typeof EntityMetadataResponseSchema>;

// Agent Configs Schema and Types

export const DataSourceOverviewSchema = z.object({
  data_sources_count: z.number(),
  total_count: z.number(),
  pending_count: z.number(),
});

export const DataSourceFeaturesSchema = z.object({
  feature_name: z.string(),
  updated_on: z.string(),
  frames_count: z.number(),
});

export const DataSourceOverviewResponseResultSchema = z.object({
  WEB_PAGE: DataSourceOverviewSchema.optional().nullable(),
  PDF: DataSourceOverviewSchema.optional().nullable(),
  FEATURES: z.array(DataSourceFeaturesSchema).optional().nullable(),
  VIDEO: DataSourceOverviewSchema.optional().nullable(),
  SLIDE: DataSourceOverviewSchema.optional().nullable(),
});

export const DataSourceWebpagesResponseResultSchema = z.object({
  id: z.number(),
  url: z.string(),
  title: z.string().nullable(),
  status: z.string(),
  status_display: z.string(),
  data_source: z.number(),
  data_source_type: z.string(),
  page_type: z.string().nullable(),
  page_intent_level: z.string().nullable(),
  created_on: z.string(),
  updated_on: z.string(),
});

export const DataSourceAssetItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional().nullable(),
  key: z.string(),
  public_url: z.string(),
});
export type DataSourceItem = z.infer<typeof DataSourceAssetItemSchema>;

export const DataSourceDocumentsResponseResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  data: z.string(),
  relevant_queries: z.array(z.string()),
  metadata: z
    .object({
      page_count: z.number(),
      content_type: z.string(),
      extraction_method: z.string(),
    })
    .or(z.object({})),
  asset: DataSourceAssetItemSchema.nullable(),
  data_source_id: z.number(),
  data_source_type: z.string(),
  created_on: z.string(),
  updated_on: z.string(),
  status: z.string(),
});

export const DataSourceArtifactsResponseResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  data: z.string(),
  relevant_queries: z.array(z.string()),
  status: z.string(),
  asset: DataSourceAssetItemSchema,
  data_source_id: z.number(),
  data_source_type: z.string(),
  labelled_by: z.string().or(z.number()).nullable(),
  labelled_by_name: z.string().nullable(),
  created_on: z.string(),
  updated_on: z.string(),
});

export const DataSourceWebpagesTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(DataSourceWebpagesResponseResultSchema), // Array of webpages results
});

export const DataSourceDocumentsTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(DataSourceDocumentsResponseResultSchema), // Array of documents results
});

export const DataSourceArtifactsTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(DataSourceArtifactsResponseResultSchema), // Array of artifacts results
});

export const FetchSitemapRequestSchema = z.object({
  url: z.string(),
});
export type FetchSitemapRequest = z.infer<typeof FetchSitemapRequestSchema>;

export const FetchSitemapResponseSchema = z.object({
  urls: z.array(z.string()),
  count: z.number(),
});
export type FetchSitemapResponse = z.infer<typeof FetchSitemapResponseSchema>;

export const AddWebpagesSitemapLinksRequestSchema = z.object({
  main_url: z.string(),
  urls: z.array(z.string()),
});
export type AddWebpagesSitemapLinksRequest = z.infer<typeof AddWebpagesSitemapLinksRequestSchema>;

export const AddWebpagesSitemapLinksResponseSchema = z.object({
  data_source_id: z.number(),
  data_source_name: z.string(),
  is_new_data_source: z.boolean(),
  urls_added: z.array(z.object({ url: z.string(), id: z.number() })),
  urls_count: z.number(),
});
export type AddWebpagesSitemapLinksResponse = z.infer<typeof AddWebpagesSitemapLinksResponseSchema>;

export const BulkAddDocumentsRequestSchema = z.array(
  z.object({
    asset: z.string(),
  }),
);
export type BulkAddDocumentsRequest = z.infer<typeof BulkAddDocumentsRequestSchema>;

export const BulkAddDocumentsResponseSchema = z.array(DataSourceDocumentsResponseResultSchema);
export type BulkAddDocumentsResponse = z.infer<typeof BulkAddDocumentsResponseSchema>;

export const BulkAddArtifactsRequestSchema = z.array(
  z.object({
    asset: z.string(),
    data_source_type: z.string(),
  }),
);
export type BulkAddArtifactsRequest = z.infer<typeof BulkAddArtifactsRequestSchema>;

export const UpdateArtifactAndCustomDocumentRequestSchema = z.object({
  title: z.string(),
  data: z.string(),
  relevant_queries: z.array(z.string()),
});
export type UpdateArtifactAndCustomDocumentRequest = z.infer<typeof UpdateArtifactAndCustomDocumentRequestSchema>;

export type UpdateArtifactRequest = UpdateArtifactAndCustomDocumentRequest;

export type UpdateCustomDocumentRequest = UpdateArtifactAndCustomDocumentRequest;

export const CreateCustomDocumentRequestSchema = UpdateArtifactAndCustomDocumentRequestSchema;
export type CreateCustomDocumentRequest = z.infer<typeof CreateCustomDocumentRequestSchema>;

export const CreateAndUpdateCustomDocumentResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  data: z.string(),
  relevant_queries: z.array(z.string()),
  status: z.string(),
  data_source_id: z.number(),
  data_source_type: z.string(),
  asset: z.null(),
  created_on: z.string(),
  updated_on: z.string(),
  metadata: z.object({}),
});
export type CreateAndUpdateCustomDocumentResponse = z.infer<typeof CreateAndUpdateCustomDocumentResponseSchema>;

export const BulkAddArtifactsResponseSchema = z.array(DataSourceArtifactsResponseResultSchema);
export type BulkAddArtifactsResponse = z.infer<typeof BulkAddArtifactsResponseSchema>;

export const DeleteWebpagesRequestSchema = z.object({
  webpage_ids: z.array(z.number()),
  delete_embeddings: z.boolean(),
});
export type DeleteWebpagesRequest = z.infer<typeof DeleteWebpagesRequestSchema>;

export const DeleteWebpagesResponseSchema = z.object({
  deactivated_count: z.number(),
  not_found_ids: z.array(z.number()),
  embeddings_deleted: z.boolean(),
});
export type DeleteWebpagesResponse = z.infer<typeof DeleteWebpagesResponseSchema>;

export const DeleteDocumentsRequestSchema = z.object({
  document_ids: z.array(z.number()),
});
export type DeleteDocumentsRequest = z.infer<typeof DeleteDocumentsRequestSchema>;

export const DeleteDocumentsResponseSchema = z.object({
  deleted_documents: z.array(
    z.object({
      document_id: z.number(),
      success: z.boolean(),
      message: z.string(),
    }),
  ),
  total_processed: z.number(),
  total_deleted: z.number(),
  total_failed: z.number(),
});
export type DeleteDocumentsResponse = z.infer<typeof DeleteDocumentsResponseSchema>;

export const DeleteArtifactsRequestSchema = z.object({
  artifact_ids: z.array(z.number()),
});
export type DeleteArtifactsRequest = z.infer<typeof DeleteArtifactsRequestSchema>;

export const DeleteArtifactsResponseSchema = z.object({
  deleted_artifacts: z.array(z.number()),
  total_processed: z.number(),
  total_deleted: z.number(),
  total_failed: z.number(),
});
export type DeleteArtifactsResponse = z.infer<typeof DeleteArtifactsResponseSchema>;

export const ReprocessWebpagesRequestSchema = z.object({
  webpage_ids: z.array(z.number()),
});
export type ReprocessWebpagesRequest = z.infer<typeof ReprocessWebpagesRequestSchema>;

export const BulkProcessDocumentsRequestSchema = z.object({
  document_ids: z.array(z.number()),
});
export type BulkProcessDocumentsRequest = z.infer<typeof BulkProcessDocumentsRequestSchema>;

export const BulkReprocessArtifactsRequestSchema = z.object({
  artifact_ids: z.array(z.number()),
});
export type BulkReprocessArtifactsRequest = z.infer<typeof BulkReprocessArtifactsRequestSchema>;

export const ReprocessWebpagesResponseSchema = z.object({
  reprocessed_count: z.number(),
  not_found_ids: z.array(z.number()),
  task_id: z.string(),
});
export type ReprocessWebpagesResponse = z.infer<typeof ReprocessWebpagesResponseSchema>;

export const InsightsCommonRequestSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  timezone: z.string(),
});
export type InsightsCommonRequest = z.infer<typeof InsightsCommonRequestSchema>;

export const InsightsSummaryResponseSchema = z.object({
  summary: z.string(),
});
export type InsightsSummaryResponse = z.infer<typeof InsightsSummaryResponseSchema>;

export const SessionInsightsRequestSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  timezone: z.string(),
  insight_interval: z.enum(['hourly', 'daily', 'weekly']),
});
export type SessionInsightsRequest = z.infer<typeof SessionInsightsRequestSchema>;

export const DailySessionInsightsResponseSchema = z.object({
  daily_counts: z.array(
    z.object({
      date: z.string(),
      session_count: z.number(),
    }),
  ),
  busiest_day: z.object({
    date: z.string(),
    session_count: z.number(),
  }),
  total_conversations: z.number(),
});
export type DailySessionInsightsResponse = z.infer<typeof DailySessionInsightsResponseSchema>;

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export const WeeklySessionInsightsResponseSchema = z.object({
  weekly_pattern: z.array(
    z.object({
      day: z.nativeEnum(DayOfWeek),
      average: z.number(),
    }),
  ),
  busiest_day: z.nativeEnum(DayOfWeek),
  quietest_day: z.nativeEnum(DayOfWeek),
});
export type WeeklySessionInsightsResponse = z.infer<typeof WeeklySessionInsightsResponseSchema>;

export const HourlySessionInsightsResponseSchema = z.object({
  hourly_pattern: z.record(z.nativeEnum(DayOfWeek), z.record(z.string(), z.number())),
  overall_average: z.record(z.string(), z.number()),
  timezone: z.string(),
});
export type HourlySessionInsightsResponse = z.infer<typeof HourlySessionInsightsResponseSchema>;

export const FrequentDocumentsResponseSchema = z.object({
  most_frequently_referenced_documents: z.array(
    z.object({
      document_id: z.number().nullable(),
      title: z.string(),
      url: z.string(),
      data_source_type: z.enum(['WEB_PAGE', 'PDF']),
      reference_count: z.number(),
      web_page_id: z.number().nullable(),
      data_source_id: z.number(),
    }),
  ),
});
export type FrequentDocumentsResponse = z.infer<typeof FrequentDocumentsResponseSchema>;

export const TopQuestionsByUserResponseSchema = z.object({
  top_user_questions: z.array(
    z.object({
      question: z.string(),
      count: z.number(),
    }),
  ),
});
export type TopQuestionsByUserResponse = z.infer<typeof TopQuestionsByUserResponseSchema>;

export const IntegrationFormSchema = z.object({
  key: z.string(),
  data_type: z.string().nullable(),
  label: z.string(),
  description: z.string().nullable(),
});
export type IntegrationForm = z.infer<typeof IntegrationFormSchema>;

export const IntegrationSchema = z.object({
  integration_type: z.string(),
  auth_type: z.string(),
  integration_group: z.string(),
  connected: z.boolean(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  integration_form: z.array(IntegrationFormSchema),
});
export type Integration = z.infer<typeof IntegrationSchema>;

export const IntegrationsResponseSchema = z.object({
  integrations: z.array(IntegrationSchema),
});

export type IntegrationsResponse = z.infer<typeof IntegrationsResponseSchema>;
