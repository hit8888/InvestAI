import { EntityDrawerContent, GenericDrawerFieldAccessors } from '../../../components/EntityDrawerContent';
import type { DrawerContentProps } from '../../../features/table-system';

export interface ProspectRow {
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
  [key: string]: unknown;
}

const prospectRowAccessors: GenericDrawerFieldAccessors<ProspectRow> = {
  getProspectId: (row) => row.prospect_id || String(row.id),
};

export const ConversationDrawerContent = ({
  data,
  onClose,
  isTableLoading = false,
  refreshTable: _refreshTable,
}: DrawerContentProps<ProspectRow>) => (
  <EntityDrawerContent
    data={data}
    isTableLoading={isTableLoading}
    onClose={onClose}
    fieldAccessors={prospectRowAccessors}
  />
);
