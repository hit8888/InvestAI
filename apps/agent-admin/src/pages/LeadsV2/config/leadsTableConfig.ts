import type { TablePageConfig } from '../../../features/table-system';
import { LeadsDrawerContent } from '../components/LeadsDrawerContent';

interface LeadRow extends Record<string, unknown> {
  id: number;
  lead_id: string;
  prospect_id: string;
  session_id: string | null;
  company: string | null;
  name: string | null;
  email: string | null;
  country: string | null;
  product_interest: string | null;
  intent_score: string | null;
  sdr_assignment: string | null;
  meeting_booked: boolean | null;
  created_on: string;
  updated_on: string;
}

/**
 * Leads Table Configuration
 * Uses LEAD entity type
 * Opens drawer on row click (same as All Chats but without browsing history)
 */
export const leadsTableConfig: TablePageConfig<LeadRow> = {
  pageKey: 'leads',
  pageTitle: 'Leads',

  api: {
    tableData: '/tenant/api/search/leads/query/',
    entityMetadata: '/tenant/api/entity/?entity_type=LEAD',
    filterOptions: '/tenant/api/search/leads/filterset/',
  },

  pagination: {
    defaultPageSize: 50,
    pageSizeOptions: [20, 50, 100, 200, 500],
  },

  defaultSort: {
    field: 'created_on',
    order: 'desc',
  },

  defaultFilters: {
    is_valid: true, // Only show valid leads (controlled by "Test Conversations" toggle with inverted logic)
    email: null, // Will be sent with operator 'is_not_null'
    lead_type: 'GOAL_ACHIEVED', // Only goal-achieved leads
  },

  // Manual filter configurations (toggle filters, etc.)
  filters: [
    {
      id: 'test_conversations',
      label: 'Test Conversations',
      type: 'toggle',
      icon: 'FlaskConical',
      defaultValue: false, // Default OFF (show valid leads)
      controlsDefaultFilter: 'is_valid', // Controls the 'is_valid' default filter
      invertsDefaultFilterValue: true, // When ON, inverts is_valid from true to false
    },
  ],

  drawer: {
    enabled: true,
    width: '50vw',
    component: LeadsDrawerContent,
    urlParam: 'rowId',
  },
};
