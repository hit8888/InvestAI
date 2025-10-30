import { EntityDrawerContent, GenericDrawerFieldAccessors } from '../../../components/EntityDrawerContent';
import type { DrawerContentProps } from '../../../features/table-system';

export interface LeadRow {
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
  [key: string]: unknown;
}

const leadRowAccessors: GenericDrawerFieldAccessors<LeadRow> = {
  getProspectId: (row) => row.prospect_id || String(row.id),
};

export const LeadsDrawerContent = ({
  data,
  onClose,
  isTableLoading = false,
  refreshTable: _refreshTable,
}: DrawerContentProps<LeadRow>) => (
  <EntityDrawerContent
    data={data}
    isTableLoading={isTableLoading}
    onClose={onClose}
    fieldAccessors={leadRowAccessors}
  />
);
