import type { TablePageConfig } from '../../../features/table-system';
import { VisitorDrawerContent } from '../components/VisitorDrawerContent';

interface VisitorRow extends Record<string, unknown> {
  id: number;
  prospect_id: string;
  session_id: string | null;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  updated_on: string;
  product_interest: string | null;
  sdr_assignment: string | null;
}

/**
 * Visitors Table Configuration
 * Uses PROSPECT entity type (same as All Chats)
 * Shows ALL visitors with companies (regardless of conversation status)
 * Unlike All Chats, does NOT filter by session_id
 * Uses drawer for visitor details
 */
export const visitorsTableConfig: TablePageConfig<VisitorRow> = {
  pageKey: 'contacts',
  pageTitle: 'Contacts',
  rowKeyField: 'prospect_id', // Use prospect_id as the unique identifier for visitors

  api: {
    tableData: '/tenant/api/prospects/query/',
    entityMetadata: '/tenant/api/entity/?entity_type=VISITOR',
    filterConfig: '/tenant/api/prospects/filter-config',
    filterOptions: '/tenant/api/prospects/filterset/',
    exportData: '/tenant/api/prospects/download/',
  },

  pagination: {
    defaultPageSize: 50,
    pageSizeOptions: [20, 50, 100, 200, 500],
  },

  defaultSort: {
    field: 'updated_on',
    order: 'desc',
  },

  defaultFilters: {
    contact_enrichments: null,
    is_test: false,
  },

  // Export/Download configuration
  export: {
    enabled: true,
    formats: ['csv', 'xlsx'],
    defaultFormat: 'csv',
  },

  drawer: {
    enabled: true,
    width: '50vw',
    component: VisitorDrawerContent,
    urlParam: 'rowId',
  },
};
