import { JSX } from 'react';
import { z } from 'zod';
import {
  CompanyDetailsSchema,
  ConversationsTableResponseSchema,
  DataSourceArtifactsTableResponseSchema,
  DataSourceDocumentsTableResponseSchema,
  DataSourceWebpagesTableResponseSchema,
  EnrichmentSourceEnum,
  LeadsTableResponseSchema,
  ProspectDetailsSchema,
  SdrAssignmentUserSchema,
  VisitorsTableResponseSchema,
} from './api';

export const LocationWithCityCountrySchema = z.object({
  city: z.string(),
  country: z.string(),
});

export const LeadsTableViewSchema = z.object({
  email: z.string(),
  name: z.string(),
  role: z.string(),
  company: z.string(),
  country: LocationWithCityCountrySchema.or(z.string()),
  timeline: z.string(),
  product_interest: z.string(),
  session_id: z.string(),
  buyer_intent: z.string(),
  lead_type: z.string().optional(),
  phone: z.string().optional(),
  number_of_commissioned_employees: z.number().optional(),
});

export const ConversationsTableViewSchema = z.object({
  company: z.string(),
  name: z.string(),
  email: z.string(),
  timestamp: z.string(),
  summary: z.string(),
  country: LocationWithCityCountrySchema.or(z.string()),
  budget: z.string(),
  authority: z.string(),
  need: z.string(),
  timeline: z.string(),
  role: z.string(),
  buyer_intent: z.string().nullable(),
  buyer_intent_score: z.string().or(z.number()).nullable(),
  bant_analysis: z.string(),
  user_message_count: z.string(),
  meeting_status: z.string(),
  product_of_interest: z.string(),
  ip_address: z.string(),
  session_id: z.string(),
  prospect_details: ProspectDetailsSchema,
  company_details: CompanyDetailsSchema,
  agent_modal: z.string().optional().nullable(),
  parent_url: z.string().optional().nullable(),
  parent_url_title: z.string().optional().nullable(),
  query_params: z.record(z.string(), z.string().nullable().optional()).optional().nullable(),
  device_type: z.string().optional().nullable(),
  browsing_analysis_summary: z.string().optional().nullable(),
});

export const VisitorsTableViewSchema = z.object({
  company: z.string(),
  name: z.string(),
  role: z.string(),
  website_url: z.string(),
  country: z.string(),
  company_country: z.string(),
  industry_domain: z.string(),
  employee_count: z.string(),
  revenue: z.string(),
  email: z.string(),
  session_id: z.string().optional().nullable(),
  prospect_id: z.string(),
  need: z.string(),
  product_interest: z.string(),
  sdr_assignment: SdrAssignmentUserSchema.optional().nullable(),
  updated_on: z.string(),
});

export const TransformedProspectAndCompanyDetailsSchema = z.object({
  prospect: z.object({
    name: z.string(),
    email: z.string(),
    location: LocationWithCityCountrySchema,
    enrichmentSource: EnrichmentSourceEnum.or(z.string()),
    linkedInUrl: z.string().optional(),
  }),
  company: z.object({
    name: z.string(),
    logoUrl: z.string().optional(),
    location: z.string(),
    revenue: z.string(),
    employees: z.string(),
    industry: z.string(),
    domain: z.string(),
    linkedInUrl: z.string(),
    foundationDate: z.string(),
    enrichmentSource: EnrichmentSourceEnum.or(z.string()),
  }),
});

// Assuming these are the types for your custom cell components:

export interface CellValueProps {
  value: string;
}

export interface CellProps {
  // eslint-disable-next-line
  getValue: () => any;
  row: {
    // eslint-disable-next-line
    original: any;
  };
}

export interface ColumnDefinition {
  header: string | Record<string, string>;
  accessorKey: string;
  id: string;
  cell?: (props: CellProps) => JSX.Element;
  // Adding these properties to match TanStack Table's ColumnDef
  enablePinning?: boolean;
  enableResizing?: boolean;
  size?: number;
}

export type DescriptionValue = {
  description: string;
  title?: string;
  labelled_by_name?: string;
};

export type SourceNameValue = {
  name: string;
  url: string;
};

export const TableDataSchema = LeadsTableResponseSchema.or(ConversationsTableResponseSchema)
  .or(DataSourceWebpagesTableResponseSchema)
  .or(DataSourceDocumentsTableResponseSchema)
  .or(DataSourceArtifactsTableResponseSchema)
  .or(VisitorsTableResponseSchema);
