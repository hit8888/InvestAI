import { JSX } from 'react';
import { z } from 'zod';
import { 
  ConversationsTableResponseSchema, 
  LeadsTableResponseSchema 
} from './api';

export const LeadsTableViewSchema = z.object({
  email: z.string(),
  name: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string(),
  timestamp: z.string(),
  product_of_interest: z.string(),
})

export const ConversationsTableViewSchema = z.object({
  company: z.string(),
  name: z.string(),
  email: z.string(),
  timestamp: z.string(),
  conversation_preview: z.string(),
  location: z.string(),
  buyer_intent: z.string(),
  bant_analysis: z.string(),
  number_of_user_messages: z.string(),
  meeting_status: z.string(),
  product_of_interest: z.string(),
  ip_address: z.string(),
  session_id: z.string(),
})

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
