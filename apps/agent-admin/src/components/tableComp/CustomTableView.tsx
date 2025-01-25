import { useRef, useState } from 'react';

import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { CONVERSATIONS_PINNED_COLUMNS } from '../../utils/constants';
import { ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useScrollSync } from '../../hooks/useScrollSync';
import { useHeaderIntersection } from '../../hooks/useHeaderIntersection';
import CustomSingleBodyRowItem from './CustomSingleBodyRowItem';
import CustomSingleHeaderRowItem from './CustomSingleHeaderRowItem';

interface TableViewProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tabularData: any[];
  columnHeaderData: ColumnDefinition[];
  isConversationsPage?: boolean;
}

const CustomTableView = ({ tabularData, columnHeaderData, isConversationsPage = false }: TableViewProps) => {
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
        left: CONVERSATIONS_PINNED_COLUMNS,
      },
    },
    data: tabularData,
    columns: columnHeaderData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative w-full">
      <div className="header-sentinel" style={{ height: '1px', width: '100%' }} />
      {/* Sticky Header Container */}
      {isHeaderSticky && (
        <div
          className={`sticky left-0 right-0 top-0 z-[1000] bg-white ${
            isSidebarOpen ? 'w-[1200px] 2xl:w-[1600px]' : 'w-[1400px] 2xl:w-[1800px]'
          }`}
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
      <div
        ref={tableBodyRef}
        className={`table-container w-full 
          ${isSidebarOpen ? 'max-w-[1200px] 2xl:max-w-[1600px]' : 'max-w-[1400px] 2xl:max-w-[1800px]'}  
          relative overflow-x-auto`}
      >
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
