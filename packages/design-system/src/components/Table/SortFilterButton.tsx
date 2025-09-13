import SortFilterIcon from '../icons/sort-filter-icon';
import Button from '../Button/index';
import { cn } from '../../lib/cn';
import {
  CommonDataSourceResponse,
  ConversationsTableDisplayContent,
  LeadsTableDisplayContent,
  PaginationPageType,
  VisitorsTableDisplayContent,
} from '@meaku/core/types/admin/admin';
import { DataSourceSortValues, SortCategory, SortOrder, SortValues } from '@meaku/core/types/admin/sort';
import { NON_SORTABLE_COLUMNS } from '@meaku/core/utils/index';
import { Header } from '@tanstack/react-table';

type IProps = {
  header:
    | Header<ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent, unknown>
    | Header<CommonDataSourceResponse, unknown>;
  sortValue: SortValues | DataSourceSortValues;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string | SortOrder) => void;
  pageType: PaginationPageType;
};

const SortFilterButton = ({ header, sortValue, setSortValue, pageType }: IProps) => {
  const sortKey = `${header.column.id}Sort`;
  const sortingDirection = (sortValue as Record<string, SortOrder>)[sortKey];

  const isNonSortableColumn = NON_SORTABLE_COLUMNS.includes(header.column.id);

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

    setSortValue(pageType, header.column.id as SortCategory, newSortingDirection);
  };
  return (
    <Button
      onClick={handleSortValueChange}
      className={cn('h-6 w-6 !p-1', {
        'bg-white': sortingDirection === 'desc',
        'bg-gray-900 hover:bg-gray-900': sortingDirection === 'asc',
        'cursor-default opacity-0': isNonSortableColumn,
      })}
      variant="system_tertiary"
      buttonStyle={'icon'}
    >
      <SortFilterIcon
        className={cn('h-4 w-4', {
          'text-gray-900': !sortingDirection,
          'text-white': sortingDirection,
          'rotate-180 text-gray-900': sortingDirection === 'desc',
        })}
      />
    </Button>
  );
};

export default SortFilterButton;
