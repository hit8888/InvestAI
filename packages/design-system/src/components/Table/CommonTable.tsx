import { useRef, useState } from 'react';

import { useReactTable, getCoreRowModel, ColumnDef, HeaderGroup, Row } from '@tanstack/react-table';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { DataSourceSortValues, SortCategory, SortOrder } from '@meaku/core/types/admin/sort';
import {
  CONVERSATIONS_PAGE,
  CONVERSATIONS_PINNED_COLUMNS,
  LEADS_PAGE,
  LEADS_PINNED_COLUMNS,
} from '@meaku/core/utils/index';
import {
  CommonDataSourceResponse,
  ConversationsTableDisplayContent,
  LeadsTableDisplayContent,
  PaginationPageType,
} from '@meaku/core/types/admin/admin';
import { useNavigate } from 'react-router-dom';
import { useScrollSync } from '../../hooks/useScrollSync';
import { useHeaderIntersection } from '../../hooks/useHeaderIntersection';
import { useTableWidth } from '../../hooks/useTableWidth';
import CustomSingleBodyRowItem from './CustomSingleBodyRowItem';
import CustomSingleHeaderRowItem from './CustomSingleHeaderRowItem';
import TableHeaderRowItemHavingCheckbox from './TableHeaderRowItemHavingCheckbox';
import TableBodyRowItemHavingCheckbox from './TableBodyRowItemHavingCheckbox';

interface TableViewProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tabularData: any[];
  columnHeaderData: ColumnDefinition[];
  filterContainerHeight?: number;
  isSidebarOpen: boolean;
  isIdSelected?: (id: number) => boolean;
  toggleSelectId?: (id: number) => void;
  selectAll?: () => void;
  deselectAll?: () => void;
  getSelectedIds?: () => number[];
  results?: CommonDataSourceResponse[];
  setSortValue?: (page: PaginationPageType, category: SortCategory, value: string | SortOrder) => void;
  sortValue?: DataSourceSortValues;
  pageType: PaginationPageType;
}

const CommonTable = ({
  tabularData,
  columnHeaderData,
  filterContainerHeight = 0,
  isSidebarOpen,
  isIdSelected = () => false,
  toggleSelectId = () => {},
  selectAll = () => {},
  deselectAll = () => {},
  getSelectedIds = () => [],
  results = [],
  setSortValue = () => {},
  sortValue = {} as DataSourceSortValues,
  pageType,
}: TableViewProps) => {
  const navigate = useNavigate();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const isConversationsPage = pageType === CONVERSATIONS_PAGE;
  const isDataSourcesPage = ![CONVERSATIONS_PAGE, LEADS_PAGE].includes(pageType);
  const { widthStyle } = useTableWidth({ isDataSourcesPage, isSidebarOpen });

  const tableBodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0); // ref to store scroll position

  const handleHeaderStickyLogic = (value: boolean) => {
    setIsHeaderSticky(value);
  };

  const handleRowItemClick = (row: ConversationsTableDisplayContent | LeadsTableDisplayContent) => {
    const detailsPageURL = 'session_id' in row ? row.session_id : null;
    if (detailsPageURL) {
      navigate(`${detailsPageURL}`, {
        state: { from: isConversationsPage ? 'conversations' : 'leads' },
      });
    }
  };

  // Scroll Sync Handler for table header and body
  useScrollSync({
    tableBodyRef,
    headerRef,
    isHeaderSticky,
    lastScrollPosition,
  });

  // Intersection observer for header stickiness
  // And preserve the scroll position during the sticky transition.
  useHeaderIntersection({
    headerRef,
    tableBodyRef,
    lastScrollPosition,
    onIntersectionChange: handleHeaderStickyLogic,
  });

  const getTableHeaderRowItem = (headerGroup: HeaderGroup<any>) => {
    if (isDataSourcesPage) {
      return (
        <TableHeaderRowItemHavingCheckbox
          key={headerGroup.id}
          headerGroup={headerGroup}
          selectAll={selectAll}
          deselectAll={deselectAll}
          getSelectedIds={getSelectedIds}
          results={results}
          pageType={pageType}
          setSortValue={setSortValue}
          sortValue={sortValue}
        />
      );
    }
    return <CustomSingleHeaderRowItem key={headerGroup.id} headerGroup={headerGroup} />;
  };

  const getTableBodyRowItem = (row: Row<any>, index: number) => {
    if (isDataSourcesPage) {
      return (
        <TableBodyRowItemHavingCheckbox
          key={row.id}
          row={row}
          index={index}
          pageType={pageType}
          isIdSelected={isIdSelected}
          toggleSelectId={toggleSelectId}
        />
      );
    }
    return <CustomSingleBodyRowItem key={row.id} row={row} index={index} handleRowItemClick={handleRowItemClick} />;
  };

  const tableInitialState = isDataSourcesPage
    ? {}
    : {
        initialState: {
          columnPinning: {
            left: isConversationsPage ? CONVERSATIONS_PINNED_COLUMNS : LEADS_PINNED_COLUMNS,
          },
        },
      };

  const table = useReactTable({
    ...tableInitialState,
    data: tabularData,
    columns: columnHeaderData as ColumnDef<any, any>[],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative w-full">
      <div className="header-sentinel" style={{ height: '1px', width: '100%' }} />
      {/* Sticky Header Container */}
      {isHeaderSticky && (
        <div
          className="sticky left-0 right-0 z-50 bg-white"
          style={{
            ...widthStyle,
            top: `${filterContainerHeight}px`,
          }}
        >
          <div ref={headerRef} className="hide-scrollbar overflow-x-auto">
            <table
              style={{
                width: isConversationsPage ? table.getTotalSize() : '100%',
                position: 'relative',
              }}
            >
              <thead className="w-full">
                {table.getHeaderGroups().map((headerGroup) => {
                  return getTableHeaderRowItem(headerGroup);
                })}
              </thead>
            </table>
          </div>
        </div>
      )}
      <div ref={tableBodyRef} className="relative overflow-x-auto" style={widthStyle}>
        <table
          style={{
            width: isConversationsPage ? table.getTotalSize() : '100%',
            position: 'relative',
          }}
        >
          <thead
            className="w-full"
            style={{
              display: isHeaderSticky ? 'none' : 'block',
              position: 'relative',
              zIndex: 4,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => {
              return getTableHeaderRowItem(headerGroup);
            })}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              return getTableBodyRowItem(row, index);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommonTable;
