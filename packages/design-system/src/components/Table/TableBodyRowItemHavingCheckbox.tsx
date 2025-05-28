import { Cell, flexRender, Row } from '@tanstack/react-table';
import { CommonDataSourceResponse } from '@meaku/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import { DOCUMENTS_PAGE } from '@meaku/core/utils/index';
import { memo, useCallback } from 'react';

type CustomSingleBodyRowItemProps = {
  row: Row<CommonDataSourceResponse>;
  index: number;
  pageType: string;
  isIdSelected: (id: number) => boolean;
  toggleSelectId: (id: number) => void;
};

const CellContent = memo(({ cell }: { cell: Cell<CommonDataSourceResponse, unknown> }) => {
  return (
    <div className="flex h-full w-full items-center text-left text-sm text-gray-900">
      {cell.getIsPlaceholder() ? null : flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
});

CellContent.displayName = 'CellContent';

type HeaderContentProps = {
  isFirstColumn: boolean;
  cell: Cell<CommonDataSourceResponse, unknown>;
  isRowSelected: boolean;
  onToggleSelect: () => void;
  pageType: string;
};

const RowCellContent = memo(({ isFirstColumn, cell, isRowSelected, onToggleSelect, pageType }: HeaderContentProps) => {
  if (isFirstColumn && pageType !== DOCUMENTS_PAGE) {
    return (
      <div className="flex w-full items-center gap-4">
        <Checkbox
          checked={isRowSelected}
          className={`flex h-4 w-4 items-center justify-center rounded-sm border-gray-400 data-[state=checked]:border-none`}
          onCheckedChange={onToggleSelect}
          haveBlackBackground={false}
        />
        <CellContent cell={cell} />
      </div>
    );
  }
  return <CellContent cell={cell} />;
});

RowCellContent.displayName = 'RowCellContent';

const TableBodyRowItemHavingCheckbox = ({
  row,
  index,
  pageType,
  isIdSelected,
  toggleSelectId,
}: CustomSingleBodyRowItemProps) => {
  const rowId = row.original.id;
  const isRowSelected = isIdSelected(rowId);

  // Memoize the toggle handler to prevent unnecessary re-renders
  const handleToggleSelect = useCallback(() => {
    toggleSelectId(rowId);
  }, [toggleSelectId, rowId]);

  const isEvenRow = index % 2 === 0;
  const isOddRow = !isEvenRow;

  return (
    <tr
      key={row.id}
      className={cn('flex w-full items-start self-stretch', {
        'bg-white': isEvenRow,
        'bg-gray-25': isOddRow,
        'bg-primary/5': isRowSelected,
      })}
    >
      {row.getVisibleCells().map((cell) => {
        const isFirstColumn = row.getVisibleCells().indexOf(cell) === 0;
        const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
        const isUrlColumn = cell.column.id === 'url';
        const isStatusColumn = cell.column.id === 'status';
        const isSourceNameColumn = cell.column.id === 'source_name';
        const isDataSourceTypeColumn = cell.column.id === 'data_source_type';
        const isDescriptionColumn = cell.column.id === 'description';
        const isDurationColumn = cell.column.id === 'duration';
        return (
          <td
            key={cell.id}
            className={cn(
              `border-gray/20 flex min-h-14 min-w-72 flex-1 flex-col items-start justify-center self-stretch border-b border-r p-2`,
              {
                'border-l': isFirstColumn,
                'min-w-[600px]': isUrlColumn,
                'min-w-[500px]': isSourceNameColumn || isDescriptionColumn,
                'min-w-32': isLastColumn || isStatusColumn || isDataSourceTypeColumn || isDurationColumn,
              },
            )}
          >
            <RowCellContent
              onToggleSelect={handleToggleSelect}
              isFirstColumn={isFirstColumn}
              cell={cell}
              isRowSelected={isRowSelected}
              pageType={pageType}
            />
          </td>
        );
      })}
    </tr>
  );
};

TableBodyRowItemHavingCheckbox.displayName = 'TableBodyRowItemHavingCheckbox';

export default TableBodyRowItemHavingCheckbox;
