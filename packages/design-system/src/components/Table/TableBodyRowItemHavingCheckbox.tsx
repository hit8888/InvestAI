import { cn } from '@breakout/design-system/lib/cn';
import { useCallback } from 'react';
import AccessibleTableRow from '../accessibility/AccessibleTableRow';
import { CustomSingleBodyRowItemProps } from './tableTypes';
import RowCellContent from './RowCellContent';
import { DATA_SOURCE_TYPE_ENUM } from '@meaku/core/utils/index';

const TableBodyRowItemHavingCheckbox = ({
  row,
  isIdSelected,
  toggleSelectId,
  handleDataSourcesDrawerToggle,
  allowedToOpenDrawer,
  showActionItems,
}: CustomSingleBodyRowItemProps) => {
  const rowId = row.original.id;
  const isRowSelected = isIdSelected(rowId);
  const isDocumentTypePDF = row.original.data_source_type === DATA_SOURCE_TYPE_ENUM.PDF;

  const isRowItemClickAllowed = allowedToOpenDrawer && !isRowSelected && !isDocumentTypePDF;

  // Memoize the toggle handler to prevent unnecessary re-renders
  const handleToggleSelect = useCallback(() => {
    toggleSelectId(rowId);
  }, [toggleSelectId, rowId]);

  const handleRowItemClick = () => {
    if (isRowItemClickAllowed) {
      toggleSelectId(rowId);
      handleDataSourcesDrawerToggle();
    }
  };

  return (
    <AccessibleTableRow
      key={row.id}
      onClick={handleRowItemClick}
      clickable={isRowItemClickAllowed}
      className={cn('flex w-full items-start self-stretch', {
        'bg-primary/5': isRowSelected,
      })}
    >
      {row.getVisibleCells().map((cell) => {
        const isFirstColumn = row.getVisibleCells().indexOf(cell) === 0;
        const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
        const isUrlColumn = cell.column.id === 'url';
        const isStatusColumn = cell.column.id === 'status';
        const isSourceNameColumn = cell.column.id === 'source_name';
        const isVisibilityColumn = cell.column.id === 'access_type';
        const isDataSourceTypeColumn = cell.column.id === 'data_source_type';
        const isDescriptionColumn = cell.column.id === 'description';
        const isSourcePageTypeColumn = cell.column.id === 'page_type';
        return (
          <td
            key={cell.id}
            className={cn(
              `border-gray/20 flex min-h-14 min-w-72 flex-1 flex-col items-start justify-center self-stretch border-b border-r p-2`,
              {
                'border-l': isFirstColumn,
                'min-w-[400px] xl:min-w-[450px]': isSourceNameColumn || isUrlColumn || isDescriptionColumn,
                'min-w-32': isLastColumn || isStatusColumn || isVisibilityColumn,
                'min-w-48': isDataSourceTypeColumn || isSourcePageTypeColumn,
              },
            )}
          >
            <RowCellContent
              onToggleSelect={handleToggleSelect}
              showActionItems={showActionItems}
              isFirstColumn={isFirstColumn}
              cell={cell}
              isRowSelected={isRowSelected}
            />
          </td>
        );
      })}
    </AccessibleTableRow>
  );
};

TableBodyRowItemHavingCheckbox.displayName = 'TableBodyRowItemHavingCheckbox';

export default TableBodyRowItemHavingCheckbox;
