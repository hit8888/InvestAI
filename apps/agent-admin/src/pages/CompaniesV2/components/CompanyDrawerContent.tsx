import type { DrawerContentProps } from '../../../features/table-system';
import { EntityDrawerContent, GenericDrawerFieldAccessors } from '../../../components/EntityDrawerContent';

interface CustomAttributes {
  employee_count?: string;
  raw_demographics?: string;
}

interface CompanyRow {
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

const companyRowAccessors: GenericDrawerFieldAccessors<CompanyRow> = {
  getProspectId: (row: CompanyRow) => row.prospect_id || String(row.id),
};

export const CompanyDrawerContent = ({
  data,
  onClose,
  isTableLoading = false,
  refreshTable: _refreshTable,
}: DrawerContentProps<CompanyRow>) => (
  <EntityDrawerContent
    data={data}
    isTableLoading={isTableLoading}
    onClose={onClose}
    fieldAccessors={companyRowAccessors}
  />
);
