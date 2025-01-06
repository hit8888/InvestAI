import { JSX } from 'react';

export type LeadsTableViewProps = {
  email: string;
  name: string;
  role: string;
  company: string;
  location: string;
  timestamp: string;
  product_of_interest: string;
}

export type ConversationsTableViewProps = {
  company: string;
  name: string;
  email: string;
  timestamp: string;
  conversation_preview: string;
  location: string;
  buyer_intent: string;
  bant_analysis: string;
  number_of_user_messages: string;
  meeting_status: string;
  product_of_interest: string;
  ip_address: string;
  session_id: string;
}

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