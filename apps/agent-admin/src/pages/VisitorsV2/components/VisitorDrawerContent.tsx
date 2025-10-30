import { EntityDrawerContent, GenericDrawerFieldAccessors } from '../../../components/EntityDrawerContent';
import type { DrawerContentProps } from '../../../features/table-system';

export interface VisitorRow {
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
  [key: string]: unknown;
}

const visitorRowAccessors: GenericDrawerFieldAccessors<VisitorRow> = {
  getProspectId: (row) => row.prospect_id || String(row.id),
};

export const VisitorDrawerContent = ({
  data,
  onClose,
  isTableLoading = false,
  refreshTable: _refreshTable,
}: DrawerContentProps<VisitorRow>) => (
  <EntityDrawerContent
    data={data}
    isTableLoading={isTableLoading}
    onClose={onClose}
    fieldAccessors={visitorRowAccessors}
  />
);
