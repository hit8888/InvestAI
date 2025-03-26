import { z } from 'zod';
import { WebSocketMessageSchema } from '../webSocketData';
import { FeedbackRequestPayloadSchema } from '../api/feedback_request';

// LoginWithEmailPasswordPayload
export const LoginWithEmailPasswordPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginWithEmailPasswordPayload = z.infer<typeof LoginWithEmailPasswordPayloadSchema>;

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
  'is_null',
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
export const ConversationsPayloadSchema = z.object({
  filters: z.array(FilterSchema),
  sort: z.array(SortSchema),
  search: z.string().optional(),
  page: z.number(),
  page_size: z.number().optional(),
});
export type ConversationsPayload = z.infer<typeof ConversationsPayloadSchema>;

export const AdditionalInfoSchema = z.union([
  z.object({}).strict(), // Allow empty object `{}`
  z.object({
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
  }),
]);

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
});

export const ProspectDetailsSchema = z.union([
  z.object({}).strict(), // Allow empty object
  z.object({
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
  }),
]);

export const CompanyDetailsSchema = z.union([
  z.object({}).strict(), // Allow empty object
  z.object({
    id: z.number(),
    keywords: z.string().nullable(),
    confidence: z.string().nullable(),
    ip_address: z.array(z.string()),
    ip_country: z.string(),
    competitors: z.array(z.string()),
    website_url: z.string().nullable(),
    company_name: z.string().nullable(),
    company_type: z.string().nullable(),
    linkedin_url: z.string().nullable(),
    brief_summary: z.string().nullable(),
    employee_count: z.string().or(z.string()),
    company_country: z.string().nullable(),
    company_revenue: z.string().nullable(),
    industry_domain: z.string().nullable(),
    enrichment_provider: z.string().nullable(),
    operating_countries: z.array(z.string()),
  }),
]);

export const ConversationsResponseResultSchema = z.object({
  buyer_intent_score: z.number().nullable(),
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
