import { JSX } from 'react';
import { z } from 'zod';
import { 
  CompanyDetailsSchema,
  ConversationsTableResponseSchema, 
  LeadsTableResponseSchema, 
  ProspectDetailsSchema
} from './api';

export const LocationWithCityCountrySchema = z.object({
  city: z.string(),
  country: z.string(),
})

export const LeadsTableViewSchema = z.object({
  email: z.string(),
  name: z.string(),
  role: z.string(),
  company: z.string(),
  location: LocationWithCityCountrySchema,
  timestamp: z.string(),
  product_of_interest: z.string(),
})

export const ConversationsTableViewSchema = z.object({
  company: z.string(),
  name: z.string(),
  email: z.string(),
  timestamp: z.string(),
  conversation_preview: z.string(),
  location: LocationWithCityCountrySchema.or(z.string()),
  budget: z.string(),
  authority: z.string(),
  timeline: z.string(),
  role: z.string(),
  buyer_intent: z.string().or(z.number()).nullable(),
  bant_analysis: z.string(),
  number_of_user_messages: z.string(),
  meeting_status: z.string(),
  product_of_interest: z.string(),
  ip_address: z.string(),
  session_id: z.string(),
  prospect_details: ProspectDetailsSchema,
  company_details: CompanyDetailsSchema,
})

export const TransformedProspectAndCompanyDetailsSchema = z.object({
  prospect: z.object({
    name: z.string(),
    email: z.string(),
    location: LocationWithCityCountrySchema,
  }),
  company: z.object({
    name: z.string(),
    logoUrl: z.string().optional(), // Optional or empty string as placeholder
    location: z.string(),
    revenue: z.string(), // Optional or empty string as placeholder
    employees: z.string(), // Optional or empty string as placeholder
    domain: z.string(), // Optional or empty string as placeholder
    foundationDate: z.string(), // Optional or empty string as placeholder
  }),
});

// Assuming these are the types for your custom cell components:

export interface CellValueProps {
    value: string;
}

export interface CellProps {
    getValue: () => any;
    row: {
      original: any;
    };
  }
  
  export interface ColumnDefinition {
    header: string;
    accessorKey: string;
    id: string;
    cell?: (props: CellProps) => JSX.Element;
  }

export const TableDataSchema = LeadsTableResponseSchema.or(ConversationsTableResponseSchema)
