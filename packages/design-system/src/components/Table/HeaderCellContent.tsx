import { useEffect, useState } from 'react';
import { HeaderContentProps, HeaderTitleProps } from './tableTypes';
import { flexRender } from '@tanstack/react-table';
import { cn } from '../../lib/cn';
import { SortCategory, SortOrder, DataSourceSortValues } from '@meaku/core/types/admin/sort';
import { NON_SORTABLE_COLUMNS } from '@meaku/core/utils/index';
import { Checkbox } from '../Checkbox';
import SortFilterIcon from '../icons/sort-filter-icon';
import Button from '../Button/index';

const HeaderTitle = ({ header }: HeaderTitleProps) => {
  return (
    <span className={cn(`w-full flex-1 text-left text-xs font-medium text-gray-500`)}>
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </span>
  );
};

const HeaderCellContent = ({
  isFirstColumn,
  header,
  selectAll,
  deselectAll,
  getSelectedIds,
  results,
  setSortValue,
  pageType,
  sortValue,
}: HeaderContentProps) => {
  const selectedIds = getSelectedIds();
  const isAllSelected = selectedIds.length === results.length && results.length > 0;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < results.length;
  const sortKey = `${header.column.id}Sort` as keyof DataSourceSortValues;
  const initialSortingDirection = sortValue[sortKey] as SortOrder;
  const [sortingDirection, setSortDirection] = useState<SortOrder>(initialSortingDirection);

  const isNonSortableColumn = NON_SORTABLE_COLUMNS.includes(header.column.id);

  useEffect(() => {
    setSortDirection(initialSortingDirection);
  }, [initialSortingDirection]);

  const handleCheckboxChange = (checked: boolean) => {
    if (isIndeterminate) {
      // If in indeterminate state, deselect all
      deselectAll();
    } else if (checked) {
      // If unchecked, select all
      selectAll();
    } else {
      // If all are selected, deselect all
      deselectAll();
    }
  };

  const handleSortValueChange = () => {
    if (isNonSortableColumn) return;
    let newSortingDirection: SortOrder;

    if (!sortingDirection) {
      // Initial state - set to ascending
      newSortingDirection = 'asc';
    } else if (sortingDirection === 'asc') {
      // Toggle from ascending to descending
      newSortingDirection = 'desc';
    } else {
      // Toggle from descending to null
      newSortingDirection = null;
    }

    setSortDirection(newSortingDirection);
    setSortValue(pageType, header.column.id as SortCategory, newSortingDirection);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-center gap-4">
        {isFirstColumn && (
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            className={`flex h-4 w-4 items-center justify-center rounded-sm border-gray-400 data-[state=checked]:border-none`}
            onCheckedChange={handleCheckboxChange}
            haveBlackBackground={false}
          />
        )}
        <HeaderTitle header={header} />
      </div>
      <Button
        onClick={handleSortValueChange}
        className={cn({
          'bg-white': sortingDirection === 'desc',
          'bg-gray-400': sortingDirection === 'asc',
          'cursor-default opacity-0': isNonSortableColumn,
        })}
        variant="system_tertiary"
        buttonStyle={'icon'}
      >
        <SortFilterIcon
          className={cn('h-4 w-4', {
            'text-gray-700': !sortingDirection,
            'text-primary': sortingDirection,
            'rotate-180': sortingDirection === 'desc',
          })}
        />
      </Button>
    </div>
  );
};

export default HeaderCellContent;
