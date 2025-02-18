import { useRef, useState } from 'react';

import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { CONVERSATIONS_PINNED_COLUMNS, LEADS_PINNED_COLUMNS } from '../../utils/constants';
import { ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useScrollSync } from '../../hooks/useScrollSync';
import { useHeaderIntersection } from '../../hooks/useHeaderIntersection';
import CustomSingleBodyRowItem from './CustomSingleBodyRowItem';
import CustomSingleHeaderRowItem from './CustomSingleHeaderRowItem';
import { cn } from '@breakout/design-system/lib/cn';

interface TableViewProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tabularData: any[];
  columnHeaderData: ColumnDefinition[];
  isConversationsPage?: boolean;
  areAllFiltersApplied: boolean;
}

const CustomTableView = ({
  tabularData,
  columnHeaderData,
  areAllFiltersApplied,
  isConversationsPage = false,
}: TableViewProps) => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const tableBodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const lastScrollPosition = useRef(0); // ref to store scroll position

  const handleHeaderStickyLogic = (value: boolean) => {
    setIsHeaderSticky(value);
  };

  const handleRowItemClick = (row: ConversationsTableDisplayContent) => {
    const detailsPageURL = row.session_id;
    navigate(`${detailsPageURL}`, {
      state: { from: 'table' },
    });
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

  const table = useReactTable({
    initialState: {
      columnPinning: {
        left: isConversationsPage ? CONVERSATIONS_PINNED_COLUMNS : LEADS_PINNED_COLUMNS,
      },
    },
    data: tabularData,
    columns: columnHeaderData,
    getCoreRowModel: getCoreRowModel(),
  });

  const widthDimension = isSidebarOpen
    ? 'mac-air:max-w-[1050px] mac-pro-14:max-w-[1200px] full-hd:max-w-[1600px] semi-qhd:max-w-[2000px] mac-pro-16:max-w-[1500px]'
    : 'mac-air:max-w-[1240px] mac-pro-14:max-w-[1400px] full-hd:max-w-[1800px] semi-qhd:max-w-[2170px] mac-pro-16:max-w-[1650px]';

  return (
    <div className="relative w-full">
      <div className="header-sentinel" style={{ height: '1px', width: '100%' }} />
      {/* Sticky Header Container: Need Exactly - top-[70px] and top-[134px] */}
      {isHeaderSticky && (
        <div
          className={cn(`sticky left-0 right-0 z-50 bg-white ${widthDimension}`, {
            'top-[70px]': !areAllFiltersApplied,
            'top-[134px] 2xl:top-[70px]': areAllFiltersApplied && isConversationsPage,
          })}
        >
          <div ref={headerRef} className="hide-scrollbar overflow-x-auto">
            <table
              style={{
                width: isConversationsPage ? table.getTotalSize() : '100%',
                position: 'relative',
              }}
            >
              <thead className="w-full">
                {table.getHeaderGroups().map((headerGroup) => (
                  <CustomSingleHeaderRowItem key={headerGroup.id} headerGroup={headerGroup} />
                ))}
              </thead>
            </table>
          </div>
        </div>
      )}
      <div ref={tableBodyRef} className={`table-container w-full ${widthDimension} relative overflow-x-auto`}>
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
            {table.getHeaderGroups().map((headerGroup) => (
              <CustomSingleHeaderRowItem key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <CustomSingleBodyRowItem key={row?.id} row={row} index={index} handleRowItemClick={handleRowItemClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTableView;
