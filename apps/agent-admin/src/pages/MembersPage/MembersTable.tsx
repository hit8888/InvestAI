import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@breakout/design-system/components/shadcn-ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { UsersListResponse, User } from '@meaku/core/types/admin/api';
import { GenericTablePagination, GenericTable, TableLoadingOverlay } from '../../features/table-system';
import { membersTableColumns } from './config/membersTableConfig';
import type { TableColumnDefinition } from '../../features/table-system/types';
import type { EntityMetadataColumn } from '../../features/table-system/types';

interface MembersTableProps {
  data: UsersListResponse['results'];
  totalRecords: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEditMember: (user: User) => void;
  onDeleteMember: (user: User) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const MembersTable = ({
  data,
  totalRecords,
  page,
  pageSize,
  isLoading,
  isFetching = false,
  onPageChange,
  onPageSizeChange,
  onEditMember,
  onDeleteMember,
}: MembersTableProps) => {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalRecords / pageSize || 1)), [pageSize, totalRecords]);

  // Create columns with custom cell renderers
  const columns = useMemo<TableColumnDefinition<User>[]>(() => {
    // Add actions column
    const actionsColumn: TableColumnDefinition<User> & { _customCellRenderer?: (user: User) => React.ReactNode } = {
      id: 'actions',
      accessorKey: 'id',
      header: '',
      sortable: false,
      meta: {
        cellType: 'TEXT',
        dataType: 'string',
        isRowKey: false,
        isDisplay: true,
        keyName: 'actions',
      },
      _customCellRenderer: (user: User) => {
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open actions"
                  className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-lg text-gray-500 opacity-0 transition-opacity hover:bg-gray-100 focus:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
                  style={{ backgroundColor: 'var(--gray-50, #F9FAFB)' }}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-auto rounded-lg border border-gray-200 bg-white p-0 shadow-lg"
              >
                <DropdownMenuItem
                  onSelect={() => onEditMember(user)}
                  className="cursor-pointer rounded-none px-3 py-2.5 text-gray-700 focus:bg-gray-50 focus:text-gray-900"
                >
                  <Pencil className="mr-2 h-4 w-4 text-gray-400" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onDeleteMember(user)}
                  className="cursor-pointer rounded-none px-3 py-2.5 text-red-600 focus:bg-gray-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    };

    return [...membersTableColumns, actionsColumn];
  }, [onEditMember, onDeleteMember]);

  // Create fake metadataColumns so createTanStackColumns can find them
  // The custom cell renderers will be used via _customCellRenderer check in columnHelpers
  const metadataColumns = useMemo<EntityMetadataColumn[]>(() => {
    return columns.map((col, index) => ({
      id: index + 1,
      key_name: col.meta.keyName,
      display_name: col.header,
      column_name: col.accessorKey,
      data_type: col.meta.dataType,
      is_display: col.meta.isDisplay,
      table_order: index,
      cell_type: col.meta.cellType,
      is_sortable: col.sortable,
      data_lookup: col.accessorKey,
      is_metadata: false,
    }));
  }, [columns]);

  // Visible columns (all columns are visible)
  const visibleColumns = useMemo(() => columns.map((col) => col.id), [columns]);

  const isEmpty = (data || []).length === 0;

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Table content */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {isEmpty && !isLoading ? (
          // Empty state
          <div className="flex h-full items-center justify-center">
            <div className="py-12 text-center text-gray-500">No data available</div>
          </div>
        ) : (
          // Table (with data or loading shimmer)
          <div className="relative mb-2 flex flex-1 flex-col overflow-hidden">
            <GenericTable
              data={data || []}
              columns={columns}
              metadataColumns={metadataColumns}
              visibleColumns={visibleColumns}
              resetVersion={0}
              sortBy={null}
              sortOrder={null}
              onSortChange={() => {}}
              isLoading={isLoading}
              rowKeyColumn="id"
            />
            {/* Loading overlay - show when refetching after mutations */}
            {isFetching && <TableLoadingOverlay />}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isEmpty && (
        <GenericTablePagination
          currentPage={page}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};

export default MembersTable;
