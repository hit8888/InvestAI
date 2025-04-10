import { useRef, useState } from 'react';

import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { CONVERSATIONS_PINNED_COLUMNS, LEADS_PINNED_COLUMNS } from '../../utils/constants';
import { ConversationsTableDisplayContent, LeadsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { useNavigate } from 'react-router-dom';
import { useScrollSync } from '../../hooks/useScrollSync';
import { useHeaderIntersection } from '../../hooks/useHeaderIntersection';
import CustomSingleBodyRowItem from './CustomSingleBodyRowItem';
import CustomSingleHeaderRowItem from './CustomSingleHeaderRowItem';
import { useTableWidth } from '../../hooks/useTableWidth';

interface TableViewProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tabularData: any[];
  columnHeaderData: ColumnDefinition[];
  isConversationsPage?: boolean;
  filterContainerHeight?: number;
}

const CustomTableView = ({
  tabularData,
  columnHeaderData,
  isConversationsPage = false,
  filterContainerHeight = 0,
}: TableViewProps) => {
  const navigate = useNavigate();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const { widthStyle } = useTableWidth();

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

  const table = useReactTable({
    initialState: {
      columnPinning: {
        left: isConversationsPage ? CONVERSATIONS_PINNED_COLUMNS : LEADS_PINNED_COLUMNS,
      },
    },
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <CustomSingleHeaderRowItem key={headerGroup.id} headerGroup={headerGroup} />
                ))}
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
