import type { TablePageConfig } from '../../../features/table-system';
import { CompanyDrawerContent } from '../components/CompanyDrawerContent';

interface CustomAttributes {
  employee_count?: string;
  raw_demographics?: string;
}

interface CompanyRow extends Record<string, unknown> {
  id: number;
  domain: string | null;
  name: string | null;
  prospect_id: string | null;
  core_company: number | null;
  relevance_score: number | null;
  relevance_score_reasoning: string | null;
  visitor_count: number;
  is_customer: boolean;
  custom_attributes: CustomAttributes;
  created_on: string;
  updated_on: string;
  [key: string]: unknown;
}

/**
 * Companies Table Configuration
 * Uses tenant-companies endpoint
 * Shows all companies that have visited the site with their enrichment data
 * Uses drawer for company details and visitor information
 */
export const companiesTableConfig: TablePageConfig<CompanyRow> = {
  pageKey: 'companies',
  pageTitle: 'Companies',

  api: {
    tableData: '/tenant/api/tenant-companies/query/',
    entityMetadata: '/tenant/api/entity/?entity_type=COMPANY',
    filterOptions: '/tenant/api/tenant-companies/filterset/',
    exportData: '/tenant/api/tenant-companies/download/',
  },

  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },

  defaultSort: {
    field: 'updated_on',
    order: 'desc',
  },

  defaultFilters: {
    // No default filters - show all companies
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
    component: CompanyDrawerContent,
    urlParam: 'rowId',
  },
};
