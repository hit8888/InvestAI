import { cn } from '@breakout/design-system/lib/cn';
import { useCallback } from 'react';
import { CustomSingleBodyRowItemProps } from './tableTypes';
import RowCellContent from './RowCellContent';

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
