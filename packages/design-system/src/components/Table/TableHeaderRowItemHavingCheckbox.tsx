import { cn } from '@breakout/design-system/lib/cn';
import { CustomSingleHeaderRowItemProps } from './tableTypes';
import HeaderCellContent from './HeaderCellContent';

const TableHeaderRowItemHavingCheckbox = ({
  headerGroup,
  selectAll,
  deselectAll,
  getSelectedIds,
  results,
  setSortValue,
  pageType,
  sortValue,
  showActionItems, // checkbox + sorting button
}: CustomSingleHeaderRowItemProps) => {
  return (
    <tr key={headerGroup.id} className="relative flex w-full items-start">
      {headerGroup.headers.map((header) => {
        const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
        const isFirstColumn = headerGroup.headers.indexOf(header) === 0;
        const isUrlColumn = header.column.id === 'url';
        const isStatusColumn = header.column.id === 'status';
        const isSourceNameColumn = header.column.id === 'source_name';
        const isVisibilityColumn = header.column.id === 'access_type';
        const isDataSourceTypeColumn = header.column.id === 'data_source_type';
        const isDescriptionColumn = header.column.id === 'description';

        return (
          <th
            key={header.id}
            colSpan={header.colSpan}
            className={cn(
              `relative flex min-w-72 flex-1 items-center gap-2 border border-gray-300 bg-gray-100 px-2 py-2.5`,
              {
                'rounded-tl-lg': isFirstColumn,
                'rounded-tr-lg': isLastColumn,
                'min-w-[400px]': isSourceNameColumn || isUrlColumn,
                'min-w-32': isLastColumn || isStatusColumn || isVisibilityColumn,
                'min-w-48': isDataSourceTypeColumn,
                'min-w-[550px]': isDescriptionColumn,
              },
            )}
          >
            <HeaderCellContent
              selectAll={selectAll}
              deselectAll={deselectAll}
              getSelectedIds={getSelectedIds}
              results={results}
              isFirstColumn={isFirstColumn}
              showActionItems={showActionItems}
              header={header}
              setSortValue={setSortValue}
              pageType={pageType}
              sortValue={sortValue}
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
