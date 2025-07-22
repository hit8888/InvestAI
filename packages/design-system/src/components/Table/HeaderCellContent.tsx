import { HeaderContentProps, HeaderTitleProps } from './tableTypes';
import { flexRender } from '@tanstack/react-table';
import { cn } from '../../lib/cn';
import { Checkbox } from '../Checkbox';
import SortFilterButton from './SortFilterButton';

const HeaderTitle = ({ header }: HeaderTitleProps) => {
  return (
    <span className={cn(`w-full flex-1 text-left text-xs font-medium text-gray-500`)}>
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </span>
  );
};

const HeaderCellContent = ({
  showActionItems,
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

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-center gap-4">
        {isFirstColumn && showActionItems && (
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
      {showActionItems && (
        <SortFilterButton header={header} sortValue={sortValue} setSortValue={setSortValue} pageType={pageType} />
      )}
    </div>
  );
};

export default HeaderCellContent;
