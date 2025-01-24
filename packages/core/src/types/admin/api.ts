import { z } from "zod";
import { MessageSchema } from "../agent";
import { FeedbackSchema } from "../session";

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
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "icontains",
  "in",
  "not_in",
  "is_null",
  "is_not_null",
  "exists",
  "not_exists",
  "between",
]);
export type Operator = z.infer<typeof OperatorSchema>;

// Filter
export const FilterSchema = z.object({
  field: z.string(),
  operator: OperatorSchema,
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number()])),
    z.null(),
  ]),
});
export type FilterItem = z.infer<typeof FilterSchema>;

// Sort
export const SortSchema = z.object({
  field: z.string(),
  order: z.enum(["asc", "desc"]),
});
export type SortItem = z.infer<typeof SortSchema>;

// LeadsPayload
export const LeadsPayloadSchema = z.object({
  filters: z.array(FilterSchema),
  sort: z.array(SortSchema),
  search: z.string(),
  page: z.number(),
  page_size: z.number().optional(),
});
export type LeadsPayload = z.infer<typeof LeadsPayloadSchema>;

// ConversationsPayload
export const ConversationsPayloadSchema = z.object({
  filters: z.array(FilterSchema),
  sort: z.array(SortSchema),
  search: z.string().optional(),
  page: z.number(),
  page_size: z.number().optional(),
});
export type ConversationsPayload = z.infer<typeof ConversationsPayloadSchema>;


// Type for individual result item
export const LeadResultSchema = z.object({
  id: z.number(),
  external_id: z.string().nullable(),
  prospect_id: z.string().nullable(),
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
  additional_info: z.record(z.unknown()),
  created_on: z.string(), // ISO date string
  updated_on: z.string(), // ISO date string
});

export const ConversationsResponseResultSchema = z.object({
  session_id: z.string().nullable(),
  timestamp: z.string().nullable(), // ISO date-time string
  summary: z.string().nullable(),
  ip_address: z.string().nullable(),
  budget: z.string().nullable(),
  timeline: z.string().nullable(),
  product_of_interest: z.string().nullable(),
  company: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  role: z.string().nullable(),
  country: z.string().nullable(),
  user_message_count: z.number(),
});

export const PaginationDataSchema = z.object({
  current_page: z.number().nonnegative(), // Current page number, must be >= 0
  page_size: z.number().nonnegative(),       // Items per page, must be >= 0
  total_pages: z.number().nonnegative(),  // Total number of pages, must be >= 0
  total_records: z.number().nonnegative() // Total number of records, must be >= 0
});

export const LeadsTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(LeadResultSchema) // Array of lead results
});

export const ConversationsTableResponseSchema = PaginationDataSchema.extend({
  results: z.array(ConversationsResponseResultSchema) // Array of conversation results
});

// Schema for individual step
export const FunnelStepSchema = z.object({
  name: z.string(),               // Name of the step
  count: z.number(),              // Count of items in the step
  conversion_rate: z.number(),    // Conversion rate for the step
});

// Schema for the entire funnel
export const ConversationFunnelResponseSchema = z.object({
  funnel_id: z.number(),           // Unique ID for the funnel
  funnel_name: z.string(),         // Name of the funnel
  steps: z.array(FunnelStepSchema), // Array of funnel steps
  total_conversion_rate: z.number(), // Total conversion rate
  analyzed_at: z.string(),         // ISO date-time string when analyzed
});

// Schema for the Entire Conversation Details Schema
export const ConversationDetailsResponseSchema = z.object({
  chat_history: z.array(MessageSchema),
  conversation: ConversationsResponseResultSchema.nullable(),
  feedback: z.array(FeedbackSchema).optional(),
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
