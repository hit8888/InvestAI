import { z } from "zod";

export type LoginWithEmailPasswordPayload = {
  email: string;
  password: string;
};

export type GenerateOtpPayload = {
  email: string;
};

export type GenerateTokens = {
  refresh: string;
};

export type VerifyOtpPayload = {
  email: string;
  code: string;
};

export type Operator = 
      "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "contains"
    | "icontains"
    | "in"
    | "not_in"
    | "is_null"
    | "is_not_null"
    | "exists"
    | "not_exists"
    | "between";

export type Filter = {
  field: string;
  operator: Operator;
  value: string | number | boolean | (string | number)[] | null; // Supports array for 'in', 'not_in', and range for 'between'
};

export type Sort = {
  field: string;
  order: "asc" | "desc";
};

export type LeadsPayload = {
  filters: Filter[];
  sort: Sort[];
  search: string;
  page: number;
  page_size?: number;
};

export type ConversationsPayload = {
  filters: Filter[];
  sort: Sort[];
  search?: string;
  page: number;
  page_size?: number;
};

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
  page_size: z.number().positive(),       // Items per page, must be > 0
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

