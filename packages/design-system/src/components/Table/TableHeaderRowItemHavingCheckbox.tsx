import { flexRender, HeaderGroup, Header } from '@tanstack/react-table';
import { CommonDataSourceResponse } from '@meaku/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import SortFilterIcon from '../icons/sort-filter-icon';
import Button from '../Button';
import { SortCategory } from '@meaku/core/types/admin/sort';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { useState } from 'react';
import { DOCUMENTS_PAGE } from '@meaku/core/utils/index';

type DataSourceStoreProps = {
  selectAll: () => void;
  deselectAll: () => void;
  getSelectedIds: () => number[];
  results: CommonDataSourceResponse[];
  pageType: PaginationPageType;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string | boolean) => void;
};

type CustomSingleHeaderRowItemProps = DataSourceStoreProps & {
  headerGroup: HeaderGroup<CommonDataSourceResponse>;
};

type HeaderTitleProps = {
  header: Header<CommonDataSourceResponse, unknown>;
};

const HeaderTitle = ({ header }: HeaderTitleProps) => {
  return (
    <span className={cn(`w-full flex-1 text-left text-xs font-medium text-gray-500`)}>
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </span>
  );
};

type HeaderContentProps = DataSourceStoreProps & {
  isFirstColumn: boolean;
  header: Header<CommonDataSourceResponse, unknown>;
};

const HeaderContent = ({
  isFirstColumn,
  header,
  selectAll,
  deselectAll,
  getSelectedIds,
  results,
  setSortValue,
  pageType,
}: HeaderContentProps) => {
  const selectedIds = getSelectedIds();
  const isAllSelected = selectedIds.length === results.length && results.length > 0;
  const [isSortingActive, setIsSortingActive] = useState(false);

  const isDocumentsPage = pageType === DOCUMENTS_PAGE;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      selectAll();
    } else {
      deselectAll();
    }
  };

  const handleSortValueChange = () => {
    setSortValue(pageType, header.column.id as SortCategory, !isSortingActive);
    setIsSortingActive(!isSortingActive);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-center gap-4">
        {isFirstColumn && !isDocumentsPage && (
          <Checkbox
            checked={isAllSelected}
            className={`flex h-4 w-4 items-center justify-center rounded-sm border-gray-400 data-[state=checked]:border-none`}
            onCheckedChange={handleCheckboxChange}
            haveBlackBackground={false}
          />
        )}
        <HeaderTitle header={header} />
      </div>
      <Button
        onClick={handleSortValueChange}
        className={cn({ 'bg-white': isSortingActive })}
        variant="system_tertiary"
        buttonStyle={'icon'}
      >
        <SortFilterIcon className="h-4 w-4 text-gray-700" />
      </Button>
    </div>
  );
};

const TableHeaderRowItemHavingCheckbox = ({
  headerGroup,
  selectAll,
  deselectAll,
  getSelectedIds,
  results,
  setSortValue,
  pageType,
}: CustomSingleHeaderRowItemProps) => {
  return (
    <tr key={headerGroup.id} className="relative flex w-full items-start">
      {headerGroup.headers.map((header) => {
        const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
        const isFirstColumn = headerGroup.headers.indexOf(header) === 0;
        const isUrlColumn = header.column.id === 'url';
        const isStatusColumn = header.column.id === 'status';
        const isSourceNameColumn = header.column.id === 'source_name';
        const isDataSourceTypeColumn = header.column.id === 'data_source_type';
        const isDescriptionColumn = header.column.id === 'description';
        const isDurationColumn = header.column.id === 'duration';

        return (
          <th
            key={header.id}
            colSpan={header.colSpan}
            className={cn(
              `relative flex min-w-72 flex-1 items-center gap-2 border border-gray-300 bg-gray-100 px-2 py-2.5`,
              {
                'rounded-tl-lg': isFirstColumn,
                'rounded-tr-lg': isLastColumn,
                'min-w-[600px]': isUrlColumn,
                'min-w-[500px]': isSourceNameColumn || isDescriptionColumn,
                'min-w-32': isLastColumn || isStatusColumn || isDataSourceTypeColumn || isDurationColumn,
              },
            )}
          >
            <HeaderContent
              selectAll={selectAll}
              deselectAll={deselectAll}
              getSelectedIds={getSelectedIds}
              results={results}
              isFirstColumn={isFirstColumn}
              header={header}
              setSortValue={setSortValue}
              pageType={pageType}
            />
            <div
              {...{
                onDoubleClick: () => header.column.resetSize(),
                onMouseDown: header.getResizeHandler(),
                onTouchStart: header.getResizeHandler(),
                className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
              }}
            />
          </th>
        );
      })}
    </tr>
  );
};

export default TableHeaderRowItemHavingCheckbox;
