import { User } from '@meaku/core/types/admin/api';
import DateUtil from '@meaku/core/utils/dateUtils';
import { ROLE_LABEL_MAP } from '../constants';
import type { TableColumnDefinition } from '../../../features/table-system/types';
import type { CellType } from '../../../features/table-system/types';

export interface MembersTableConfig {
  title: string;
  description: string;
}

export const membersTableConfig: MembersTableConfig = {
  title: 'Organization members',
  description: 'Manage member details and their access levels.',
};

// Common cell style
const cellStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--gray-900, #101828)',
};

// Helper function to create TableColumnDefinition with custom cell renderer
const createColumn = (
  id: string,
  accessorKey: string,
  header: string,
  cellType: CellType,
  cellRenderer: (user: User) => React.ReactNode,
  sortable: boolean = true,
): TableColumnDefinition<User> & { _customCellRenderer?: (user: User) => React.ReactNode } => {
  return {
    id,
    accessorKey,
    header,
    sortable,
    meta: {
      cellType,
      dataType: 'string',
      isRowKey: id === 'id',
      isDisplay: true,
      keyName: id,
    },
    _customCellRenderer: cellRenderer,
  };
};

export const membersTableColumns: (TableColumnDefinition<User> & {
  _customCellRenderer?: (user: User) => React.ReactNode;
})[] = [
  createColumn(
    'full_name',
    'full_name',
    'Member',
    'TEXT',
    (user: User) => {
      const memberName = user.full_name || `${user.first_name} ${user.last_name}`.trim();
      return <span style={cellStyle}>{memberName || '—'}</span>;
    },
    false,
  ),
  createColumn(
    'email',
    'email',
    'Email ID',
    'EMAIL',
    (user: User) => <span style={cellStyle}>{user.email ?? '—'}</span>,
    false,
  ),
  createColumn(
    'role',
    'role',
    'Role',
    'TEXT',
    (user: User) => {
      const role = user.role ? (ROLE_LABEL_MAP[user.role.toLowerCase()] ?? user.role) : '—';
      return <span style={cellStyle}>{role}</span>;
    },
    false,
  ),
  createColumn(
    'date_joined',
    'date_joined',
    'Joined',
    'DATETIME',
    (user: User) => {
      const formattedDate = user.date_joined ? DateUtil.formatDate(user.date_joined) : '—';
      return <span style={cellStyle}>{formattedDate}</span>;
    },
    false,
  ),
  createColumn(
    'last_login',
    'last_login',
    'Last Login',
    'DATETIME',
    (user: User) => {
      const formattedDateTime = user.last_login ? DateUtil.formatDateTime(user.last_login) : '—';
      return (
        <span style={cellStyle} className="whitespace-nowrap">
          {formattedDateTime}
        </span>
      );
    },
    false,
  ),
];
