import type { TablePageConfig } from '../../../features/table-system';
import { ConversationDrawerContent } from '../components/ConversationDrawerContent';

interface ProspectRow extends Record<string, unknown> {
  id: number;
  prospect_id: string;
  session_id: string | null;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  updated_on: string;
  product_interest: string | null;
  need: string | null;
  sdr_assignment: string | null;
}

/**
 * All Chats Table Configuration
 * Uses PROSPECT entity type
 * Shows only prospects WITH conversations (session_id is_not_null)
 * Uses drawer for conversation details (same as Visitors)
 */
export const conversationsTableConfig: TablePageConfig<ProspectRow> = {
  pageKey: 'all-chats',
  pageTitle: 'All Chats',

  api: {
    tableData: '/tenant/api/prospects/query/',
    entityMetadata: '/tenant/api/entity/?entity_type=PROSPECT',
    filterConfig: '/tenant/api/prospects/filter-config',
    filterOptions: '/tenant/api/prospects/filterset/',
    exportData: '/tenant/api/prospects/download/',
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
    company: null, // Will be sent with operator 'is_not_null' - controlled by "Company Revealed" toggle
    session_id: null, // Will be sent with operator 'is_not_null' - always applied (makes this "All Chats")
  },

  // Manual filter configurations (toggle filters, etc.)
  filters: [
    {
      id: 'company_revealed',
      label: 'Company Revealed',
      type: 'toggle',
      icon: 'BriefcaseBusiness',
      defaultValue: true, // Default ON
      controlsDefaultFilter: 'company', // Controls the 'company' default filter
    },
  ],

  // Quick filter buttons (shown next to Filters button)
  quickFilters: [
    {
      id: 'rep_joined',
      label: 'Rep Joined',
      icon: 'UserCheck',
      filterField: 'sdr_assignment',
      filterValue: null,
      filterOperator: 'is_not_null',
    },
  ],

  // Export/Download configuration
  export: {
    enabled: true,
    formats: ['csv', 'xlsx'],
    defaultFormat: 'csv',
  },

  drawer: {
    enabled: true,
    width: '50vw',
    component: ConversationDrawerContent,
    urlParam: 'rowId',
  },
};
