import { z } from 'zod';
import { Asset, AssetSchema } from '../common';
import { WebSocketMessageSchema } from '../webSocketData';
import { FeedbackRequestPayloadSchema } from '../api/feedback_request';
import { BrowsedUrlSchema, BuyerIntent } from '../common';

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

// ChangePasswordPayload
export const ChangePasswordPayloadSchema = z.object({
  new_password: z.string(),
  confirm_password: z.string(),
});
export type ChangePasswordPayload = z.infer<typeof ChangePasswordPayloadSchema>;

// ChangePasswordResponse
export const ChangePasswordResponseSchema = z.object({
  message: z.string(),
});
export type ChangePasswordResponse = z.infer<typeof ChangePasswordResponseSchema>;

// Organization Details
export const OrganizationDetailsResponseSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  'tenant-name': z.string().optional(),
  logo: z.string().optional(),
  agentId: z.number().optional(),
  active_conversations_enabled: z.boolean().optional(),
});
export type OrganizationDetailsResponse = z.infer<typeof OrganizationDetailsResponseSchema>;

// UserInfoResponse
export const UserInfoResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  profile_picture: z.string(),
  is_active: z.boolean(),
  is_staff: z.boolean(),
  date_joined: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format. Expected ISO 8601 format.',
  }),
  last_login: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format. Expected ISO 8601 format.',
  }),
  designation: z.string().nullable(),
  department: z.string().nullable(),
  organizations: z.array(OrganizationDetailsResponseSchema),
});
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>;

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

// TenantMetadata
export const TenantMetadataSchema = z.object({
  account_identifier: z.string(),
  name: z.string(),
  metadata: z.object({
    logo: z.string().optional(),
    products_and_description: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
    support: z
      .object({
        phone: z.string().optional(),
        email: z.string().optional(),
        website_url: z.string().optional(),
      })
      .optional(),
    custom_domain_exclusion_list: z.array(z.string()).optional(),
  }),
});
export type TenantMetadataResponse = z.infer<typeof TenantMetadataSchema>;

// TenantMetadataUpdateRequest - for updating only specific fields
export const TenantMetadataUpdateRequestSchema = z
  .object({
    products_and_description: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
    support: z
      .object({
        phone: z.string().optional(),
        email: z.string().optional(),
        website_url: z.string().optional(),
      })
      .optional(),
  })
  .partial();
export type TenantMetadataUpdateRequest = z.infer<typeof TenantMetadataUpdateRequestSchema>;

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
export type LeadsPayload = z.infer<typeof TablePayloadSchema>;
export type ConversationsPayload = z.infer<typeof TablePayloadSchema>;
export type VisitorsPayload = z.infer<typeof TablePayloadSchema>;
export type CompaniesPayload = z.infer<typeof TablePayloadSchema>;
export type DataSourcePayload = z.infer<typeof TablePayloadSchema>;

export const AdditionalInfoSchema = z.object({
  id: z.number().optional(),
  loc: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  message: z.string().optional(),
  keywords: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  product_interest: z.string().optional().nullable(),
  summary: z.string().optional(),
  timezone: z.string().optional(),
  country: z.string().optional(),
  ip_country: z.string().optional(),
  parent_url: z.string().optional().nullable(),
  user_email: z.string().optional(),
  agent_modal: z.string().optional(),
  last_name: z.string().optional(),
  first_name: z.string().optional(),
  confidence: z.string().optional(),
  ip_address: z.string().or(z.array(z.string())).optional(),
  buyer_intent: z.string().optional(),
  number_of_commissioned_employees: z.number().optional(),
  competitors: z.array(z.string()).optional(),
  device_type: z.string().optional(),
  form_filled: z.boolean().optional(),
  website_url: z.string().optional(),
  company_name: z.string().optional(),
  company_type: z.string().optional(),
  linkedin_url: z.string().optional().nullable(),
  brief_summary: z.string().optional().nullable(),
  employee_count: z.string().optional(),
  company_country: z.string().optional(),
  company_revenue: z.string().optional(),
  industry_domain: z.string().optional(),
  enrichment_source: z.string().optional(),
  enrichment_provider: z.string().optional(),
  operating_countries: z.array(z.string()).optional(),
});

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
  email: z.string().optional(),
  name: z.string().optional(),
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

export const AtsInformationSchema = z.object({
  ats_used: z.string().optional().nullable(),
  ats_website_link: z.string().optional().nullable(),
  num_open_jobs: z.number().optional().nullable(),
});

export const CompanyDetailsSchema = z.object({
  id: z.number().nullable().optional(),
  keywords: z.string().nullable().optional(),
  confidence: z.string().nullable().optional(),
  ip_address: z.array(z.string()).optional(),
  ip_country: z.string().nullable().optional(),
  competitors: z.array(z.string()).optional(),
  website_url: z.string().nullable().optional(),
  company_name: z.string().nullable().optional(),
  company_type: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  brief_summary: z.string().nullable().optional(),
  employee_count: z.string().nullable().optional(),
  company_country: z.string().nullable().optional(),
  company_revenue: z.string().nullable().optional(),
  industry_domain: z.string().nullable().optional(),
  enrichment_source: EnrichmentSourceEnum.optional().nullable(),
  enrichment_provider: z.string().nullable().optional(),
  operating_countries: z.array(z.string()).optional(),
  ats_information: AtsInformationSchema.optional().nullable(),
});

export const CoreCompanySchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().nullable().optional(),
  domain: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  employee_count: z.number().nullable().optional(),
  annual_revenue: z.number().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
});

export const SdrAssignmentUserSchema = z.object({
  id: z.number().nullable().optional(),
  username: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  designation: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  profile_picture: z.string().nullable().optional(),
});

export type UserSdrAssignment = z.infer<typeof SdrAssignmentUserSchema>;

export const SdrAssignmentSchema = z.object({
  id: z.number().nullable().optional(),
  assigned_user: SdrAssignmentUserSchema.optional().nullable(),
  assignment_type: z.string().nullable().optional(),
  assignment_timestamp: z.string().nullable().optional(),
  assigned_by_user: SdrAssignmentUserSchema.optional().nullable(),
  routing_rule: z.number().nullable().optional(),
  routing_source: z.string().nullable().optional(),
  created_on: z.string().nullable().optional(),
  updated_on: z.string().nullable().optional(),
});

export type SdrAssignment = z.infer<typeof SdrAssignmentSchema>;

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
  user_message_count: z.number().nullable(),
  is_test: z.boolean(),
  prospect_details: ProspectDetailsSchema.optional().nullable(),
  company_details: CompanyDetailsSchema.optional().nullable(),
  agent_modal: z.string().optional().nullable(),
  parent_url: z.string().optional().nullable(),
  parent_url_title: z.string().optional().nullable(),
  query_params: z.record(z.string(), z.string().nullable().optional()).optional().nullable(),
  device_type: z.string().optional().nullable(),
  browsing_analysis_summary: z.string().optional().nullable(),
  prospect_id: z.string().optional().nullable(),
});

export const ConversationDetailResponseSchema = z.object({
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
  user_message_count: z.number().nullable(),
  is_test: z.boolean(),
  prospect_details: ProspectDetailsSchema.optional().nullable(),
  company_details: CompanyDetailsSchema.optional().nullable(),
  agent_modal: z.string().optional().nullable(),
  parent_url: z.string().optional().nullable(),
  parent_url_title: z.string().optional().nullable(),
  query_params: z.record(z.string(), z.string().nullable().optional()).optional().nullable(),
  device_type: z.string().optional().nullable(),
  browsing_analysis_summary: z.string().optional().nullable(),
  sdr_assignment: SdrAssignmentSchema.optional().nullable(),
  prospect_id: z.string().optional().nullable(),
});

export const VisitorsResponseResultSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  budget: z.string().nullable().optional(),
  need: z.string().nullable().optional(),
  timeline: z.string().nullable().optional(),
  product_interest: z.string().nullable().optional(),
  prospect_demographics: ProspectDetailsSchema.optional().nullable(),
  company_demographics: CompanyDetailsSchema.optional().nullable(),
  ip_address: z.string().nullable().optional(),
  parent_url: z.string().nullable().optional(),
  query_params: z.record(z.string(), z.string().nullable().optional()).optional().nullable(),
  referrer: z.string().nullable().optional(),
  session_id: z.string().nullable().optional(),
  prospect_id: z.string().nullable().optional(),
  sdr_assignment: SdrAssignmentSchema.nullable().optional(),
  updated_on: z.string().nullable().optional(),
  browsing_analysis_summary: z.string().nullable().optional(),
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

export const VisitorsTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(VisitorsResponseResultSchema), // Array of visitor results
});

export const CompaniesTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(z.record(z.unknown())), // Array of company results - using generic record for now
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
  conversation: ConversationDetailResponseSchema.nullable(),
  feedback: z.array(FeedbackRequestPayloadSchema).optional(),
});

export const ProspectDetailsResponseSchema = z.object({
  prospect_id: z.string().nullable(),
  session_id: z.string().nullable(),
  name: z.string().nullable(),
  email: z.null().nullable(),
  phone: z.null().nullable(),
  role: z.string().nullable(),
  country: z.string().nullable(),
  budget: z.null().nullable(),
  need: z.string().nullable(),
  timeline: z.null().nullable(),
  product_interest: z.string().nullable(),
  prospect_demographics: ProspectDetailsSchema,
  company: z.string(),
  company_demographics: CompanyDetailsSchema,
  browsed_urls: z.array(BrowsedUrlSchema),
  ip_address: z.string().nullable(),
  parent_url: z.null().nullable(),
  query_params: z.record(z.string(), z.string().nullable().optional()).optional().nullable(),
  referrer: z.null().nullable(),
  browsing_analysis_summary: z.string().nullable(),
  sdr_assignment: SdrAssignmentSchema.nullable().optional(),
  core_company: CoreCompanySchema.nullable().optional(),
});

export const SessionDetailsResponseSchema = z.object({
  chat_history: z.array(WebSocketMessageSchema),
  chat_summary: z.string().optional().nullable(),
  session: z
    .object({
      session_id: z.string().nullable(),
      start_time: z.string(),
      end_time: z.null().nullable(),
      is_live: z.boolean(),
      agent_id: z.number().nullable(),
      buyer_intent_score: z.number(),
      is_test: z.boolean(),
      test_type: z.null().nullable(),
      device_type: z.string().nullable(),
      experiment_tag: z.null().nullable(),
      metadata: z.object({
        loc: z.string(),
        city: z.string(),
        region: z.string(),
        country: z.string(),
        timezone: z.string(),
        ip_address: z.string(),
      }),
    })
    .optional()
    .nullable(),
  prospect: ProspectDetailsResponseSchema,
});

export const DataSourceAssetItemSchema = AssetSchema.extend({
  is_cancelled: z.boolean().default(false),
  access_type: z.string().optional().nullable(),
});
export type DataSourceItem = z.infer<typeof DataSourceAssetItemSchema>;

export type DataSourcesAccessorFnType = {
  access_type: string;
  id: string;
  file_type: string;
  data: string;
  title: string;
  labelled_by_name: string;
  data_source_type: string;
  asset: Asset;
  thumbnail: ThumbnailAssetData;
};

export const WebpagesScreenshotsResponseSchema = z.object({
  available_screenshot_webpages: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      url: z.string(),
      screenshot: DataSourceAssetItemSchema,
    }),
  ),
  triggered_generation: z.array(z.number()),
  ignored_urls: z.array(z.string()),
  total_requested: z.number(),
  total_available: z.number(),
  total_triggered: z.number(),
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
  column_name: z.string(),
  data_type: z.string(),
  description: z.string(),
  display_name: z.string(),
  entity_type: z.string(),
  id: z.number(),
  is_display: z.boolean(),
  key_name: z.string(),
  parent_column: z.string().nullable(),
  source: z.string(),
  table_order: z.number(),
  related_entities: z.array(z.string()),
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
  access_type: z.string().optional(),
  created_on: z.string(),
  updated_on: z.string(),
  status: z.string(),
});

export type DataSourceDocumentsResponseResult = z.infer<typeof DataSourceDocumentsResponseResultSchema>;

export const ThumbnailAssetDataSchema = z.object({
  asset_url: z.string(),
  id: z.string(),
});

export type ThumbnailAssetData = z.infer<typeof ThumbnailAssetDataSchema>;

export const DataSourceArtifactsResponseResultSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
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
  thumbnail: ThumbnailAssetDataSchema.optional().nullable(),
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
  cancelled_urls: z.array(z.string()),
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
  access_type: z.string(),
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

export const CreateThumbnailRequestSchema = z.object({
  artifact_id: z.number().optional(),
  file: z.instanceof(File),
  thumbnail_type: z.string().optional(),
});
export type CreateThumbnailRequest = z.infer<typeof CreateThumbnailRequestSchema>;

// Base interface for any payload containing a file
export interface BaseFilePayload {
  file: File;
  [key: string]: number | string | boolean | null | undefined | File;
}

// Generic asset upload payload that can be either a FormData or an object with file + metadata
export type AssetUploadPayload = BaseFilePayload | FormData;

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

export const ConversationProcessingTimeLogResponseSchema = z.object({
  processing_time_logs: z.array(
    z.object({
      session_id: z.string(),
      response_id: z.string(),
      user_message_time: z.string(),
      ai_message_time: z.string(),
      processing_time: z.number(),
      user_message_content: z.string(),
    }),
  ),
  average_processing_time: z.number(),
  total_entries: z.number(),
});
export type ConversationProcessingTimeLogResponse = z.infer<typeof ConversationProcessingTimeLogResponseSchema>;

export const BuyerIntentDistributionResponseSchema = z.object({
  buyer_intent_distribution: z.array(
    z.object({
      buyer_intent: z.nativeEnum(BuyerIntent),
      count: z.number(),
      percentage: z.number(),
    }),
  ),
});
export type BuyerIntentDistributionResponse = z.infer<typeof BuyerIntentDistributionResponseSchema>;

export const ProductInterestDistributionResponseSchema = z.object({
  product_interest_distribution: z.array(
    z.object({
      product_name: z.string(),
      count: z.number(),
      percentage: z.number(),
    }),
  ),
});
export type ProductInterestDistributionResponse = z.infer<typeof ProductInterestDistributionResponseSchema>;

export const CountryDistributionResponseSchema = z.object({
  country_distribution: z.array(
    z.object({
      country_name: z.string(),
      count: z.number(),
      percentage: z.number(),
    }),
  ),
});
export type CountryDistributionResponse = z.infer<typeof CountryDistributionResponseSchema>;

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

export const CalendarSchema = z.object({
  id: z.number(),
  name: z.string(),
  calendar_type: z.string().optional(),
  calendar_url: z.string().optional(),
  description: z.string().optional(),
  is_primary: z.boolean().optional(),
  timezone: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  owner_type: z.string().optional(),
  owner_name: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_managed: z.boolean().optional(),
  access_token: z.string().optional(),
});

export type CalendarResponse = z.infer<typeof CalendarSchema>;

export const CalendarFormDataSchema = z.object({
  name: z.string(),
  calendar_type: z.string(),
  calendar_url: z.string(),
  description: z.string().optional(),
  is_primary: z.boolean().optional(),
  timezone: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  event_type: z.string().optional(),
});

export type CalendarFormData = z.infer<typeof CalendarFormDataSchema>;

export const ReachoutEmailPayloadSchema = z.object({
  session_id: z.string().optional(),
  prospect_id: z.string().optional(),
  icp_id: z.number().optional(),
  email_type: z.enum(['website_user', 'prospective_icp']),
});
export type ReachoutEmailPayload = z.infer<typeof ReachoutEmailPayloadSchema>;

export const ReachoutEmailResponseSchema = z.object({
  subject: z.string(),
  main_body: z.string(),
  session_id: z.string(),
});
export type ReachoutEmailResponse = z.infer<typeof ReachoutEmailResponseSchema>;

// UserProfile
export const UserProfileResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  is_active: z.boolean(),
  designation: z.string().optional(),
  department: z.string().optional(),
  profile_picture: z.string().url().optional(),
});
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

// UpdateUserProfilePayload
export const UpdateUserProfilePayloadSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  profile_picture: z.string().url().or(z.literal('')).optional(),
});
export type UpdateUserProfilePayload = z.infer<typeof UpdateUserProfilePayloadSchema>;

// UserProfileUpdateResponse (same as UserProfileResponse)
export type UserProfileUpdateResponse = UserProfileResponse;

// UserProfileValidationError
export const UserProfileValidationErrorSchema = z.object({
  error: z.literal('Validation error'),
  details: z.record(z.array(z.string())),
});
export type UserProfileValidationError = z.infer<typeof UserProfileValidationErrorSchema>;

// UserProfileNotFoundError
export const UserProfileNotFoundErrorSchema = z.object({
  error: z.literal('User not found in current organization'),
});
export type UserProfileNotFoundError = z.infer<typeof UserProfileNotFoundErrorSchema>;

// UserProfileServerError
export const UserProfileServerErrorSchema = z.object({
  error: z.literal('Server error'),
  details: z.string(),
});
export type UserProfileServerError = z.infer<typeof UserProfileServerErrorSchema>;

export const IcpsContactSchema = z.object({
  id: z.number(),
  company_name: z.string(),
  company_domain: z.string(),
  company_industry: z.string().nullable(),
  company_size: z.string().nullable(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  title: z.string(),
  seniority: z.string(),
  departments: z.array(z.string()),
  linkedin_url: z.string(),
  profile_picture_url: z.string(),
  email_status: z.string(),
  enrichment_date: z.string(),
  source: z.string(),
  metadata: z.object({
    has_raw_apollo_data: z.boolean(),
    apollo_person_id: z.string(),
    search_total_results: z.number(),
    search_date: z.string(),
    full_metadata_available: z.boolean(),
  }),
});
export type IcpsContact = z.infer<typeof IcpsContactSchema>;

export const IcpsResponseSchema = z.object({
  contacts: z.array(IcpsContactSchema),
});
export type IcpsResponse = z.infer<typeof IcpsResponseSchema>;

export const IcpDetailsResponseSchema = z.object({
  contact: IcpsContactSchema,
});
export type IcpDetailsResponse = z.infer<typeof IcpDetailsResponseSchema>;

// User schema for users list API
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  is_active: z.boolean().optional(),
  designation: z.string().optional().nullable(),
  profile_picture: z.string().optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;
// Users list response
export const UsersListResponseSchema = PaginationDataSchema.extend({
  results: z.array(UserSchema),
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// Assign SDR request payload
export const AssignSdrRequestSchema = z.object({
  prospect_id: z.string(),
  assigned_user_id: z.number(),
});

export type AssignSdrRequest = z.infer<typeof AssignSdrRequestSchema>;

// Assign SDR response
export const AssignSdrResponseSchema = z.object({
  id: z.number(),
  prospect_id: z.string(),
  assigned_user: UserSchema,
  assigned_by_user: UserSchema,
  assignment_timestamp: z.string(),
  assignment_type: z.string(),
  is_active: z.boolean(),
});

export type AssignSdrResponse = z.infer<typeof AssignSdrResponseSchema>;

export const IcpConfigPayloadSchema = z.object({
  seniorities: z.array(z.string()),
  departments: z.array(z.string()),
  locations: z.array(z.string()),
  max_contacts_per_company: z.number(),
  person_titles: z.array(z.string()),
});
export type IcpConfigPayload = z.infer<typeof IcpConfigPayloadSchema>;

export const IcpConfigResponseSchema = z.object({
  agent_id: z.number(),
  agent_name: z.string(),
  icp_config: IcpConfigPayloadSchema.extend({
    company_sizes: z.array(z.string()).optional(),
    industries: z.array(z.string()).optional(),
    company_keywords: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
  }),
  options: z.object({
    seniorities: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    ),
    departments: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    ),
    person_titles: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    ),
  }),
});
export type IcpConfigResponse = z.infer<typeof IcpConfigResponseSchema>;

// Video Validation
export const VideoTypeEnum = z.enum(['YOUTUBE', 'VIMEO', 'WISTIA', 'OTHER', 'VIDEO']);
export type VideoType = z.infer<typeof VideoTypeEnum>;

export const ValidatedVideoSchema = z.object({
  video_type: VideoTypeEnum,
  url: z.string(),
  duration: z.string(),
  title: z.string(),
});
export type ValidatedVideo = z.infer<typeof ValidatedVideoSchema>;

export const VideoValidationRequestSchema = z.array(z.string());
export type VideoValidationRequest = z.infer<typeof VideoValidationRequestSchema>;

export const VideoValidationResponseSchema = z.object({
  success: z.array(ValidatedVideoSchema),
  errors: z.record(z.string(), z.string()),
});
export type VideoValidationResponse = z.infer<typeof VideoValidationResponseSchema>;
