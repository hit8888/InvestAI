import { Settings, GripVertical, RotateCcw } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import type { TableColumnDefinition } from '../types';
import { ScrollArea } from '@breakout/design-system/components/shadcn-ui/scroll-area';
import { DraggableColumnItem } from './DraggableColumnItem';
import { useColumnManagement } from '../context/ColumnManagementContext';

/**
 * Generic table column visibility manager
 * Shows selected columns at top, unselected at bottom with smooth animations
 */
export const GenericTableColumnManager = () => {
  // Get column management from context
  const { columns, visibleColumns, setColumnVisibility, setColumnOrder, resetColumnVisibility } = useColumnManagement();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Local state for drag operation - only commit to parent on drag end
  const [localVisibleColumns, setLocalVisibleColumns] = useState<TableColumnDefinition[]>([]);
  const isDraggingRef = useRef(false);
  const localColumnsRef = useRef<TableColumnDefinition[]>([]);

  // Auto-scroll state
  const autoScrollRef = useRef<number | null>(null);
  const lastMouseYRef = useRef<number>(0);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const visibleSet = new Set(visibleColumns);

  // Separate visible and hidden columns - preserve visibleColumns order!
  const columnMap = new Map(columns.map((col) => [col.id, col]));
  const visibleColumnsList = visibleColumns
    .map((id) => columnMap.get(id))
    .filter((col): col is TableColumnDefinition => col !== undefined);
  const hiddenColumnsList = columns.filter((col) => !visibleSet.has(col.id));

  // Initialize local state when visible columns change from parent
  useEffect(() => {
    // Always update when not dragging
    if (!isDraggingRef.current) {
      setLocalVisibleColumns(visibleColumnsList);
      localColumnsRef.current = visibleColumnsList;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns.join(','), visibleColumnsList.length]);

  // Handle reorder during drag - update local state only
  const handleReorder = useCallback((reorderedColumns: TableColumnDefinition[]) => {
    setLocalVisibleColumns(reorderedColumns);
    localColumnsRef.current = reorderedColumns;
  }, []);

  // Auto-scroll logic
  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current !== null) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const performAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current || !isDraggingRef.current) {
      stopAutoScroll();
      return;
    }

    const container = scrollContainerRef.current;
    const rect = container.getBoundingClientRect();
    const mouseY = lastMouseYRef.current;

    // Define auto-scroll zones (50px from top/bottom)
    const SCROLL_ZONE = 50;
    const MAX_SCROLL_SPEED = 10;

    // Calculate distance from edges
    const distanceFromTop = mouseY - rect.top;
    const distanceFromBottom = rect.bottom - mouseY;

    let scrollSpeed = 0;

    if (distanceFromTop < SCROLL_ZONE && distanceFromTop > 0) {
      // Near top - scroll up
      const ratio = 1 - distanceFromTop / SCROLL_ZONE;
      scrollSpeed = -ratio * MAX_SCROLL_SPEED;
    } else if (distanceFromBottom < SCROLL_ZONE && distanceFromBottom > 0) {
      // Near bottom - scroll down
      const ratio = 1 - distanceFromBottom / SCROLL_ZONE;
      scrollSpeed = ratio * MAX_SCROLL_SPEED;
    }

    if (scrollSpeed !== 0) {
      container.scrollTop += scrollSpeed;
      autoScrollRef.current = requestAnimationFrame(performAutoScroll);
    } else {
      stopAutoScroll();
    }
  }, [stopAutoScroll]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      lastMouseYRef.current = e.clientY;

      // Start auto-scroll if not already running
      if (autoScrollRef.current === null) {
        autoScrollRef.current = requestAnimationFrame(performAutoScroll);
      }
    },
    [performAutoScroll],
  );

  // Set up mouse move listener when dragging
  useEffect(() => {
    if (isDraggingRef.current && isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [handleMouseMove, isOpen]);

  // Cleanup auto-scroll on unmount or when popover closes
  useEffect(() => {
    return () => {
      stopAutoScroll();
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [stopAutoScroll, handleMouseMove]);

  // Stop auto-scroll when popover closes
  useEffect(() => {
    if (!isOpen) {
      stopAutoScroll();
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isOpen, stopAutoScroll, handleMouseMove]);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleDragEnd = useCallback(() => {
    const currentColumns = localColumnsRef.current;
    isDraggingRef.current = false;
    stopAutoScroll();
    document.removeEventListener('mousemove', handleMouseMove);

    if (currentColumns.length > 0) {
      const reorderedIds = currentColumns.map((col) => col.id);
      handleReorder(currentColumns);
      // Only send the visible columns in their new order
      setColumnOrder(reorderedIds);
    }
  }, [setColumnOrder, handleReorder, stopAutoScroll, handleMouseMove]);

  // Calculate dynamic height based on item count (48px per item, max 384px)
  const ITEM_HEIGHT = 48;
  const MAX_HEIGHT = 384; // h-96
  const totalItems = localVisibleColumns.length + hiddenColumnsList.length;
  const calculatedHeight = Math.min(totalItems * ITEM_HEIGHT, MAX_HEIGHT);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        title="Manage columns"
      >
        <Settings className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Table Order</h3>
            <button
              onClick={resetColumnVisibility}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600  hover:text-gray-900"
              title="Reset to default"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          </div>
          <ScrollArea
            type="auto"
            className="py-2"
            style={{ height: `${calculatedHeight}px` }}
            ref={(el) => {
              if (el) {
                // Get the viewport element inside ScrollArea
                const viewport = el.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
                if (viewport) {
                  scrollContainerRef.current = viewport;
                }
              }
            }}
          >
            {/* Visible columns - Draggable */}
            {localVisibleColumns.length > 0 && (
              <Reorder.Group
                axis="y"
                values={localVisibleColumns}
                onReorder={handleReorder}
                className="space-y-0"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {localVisibleColumns.map((column) => (
                  <DraggableColumnItem
                    key={column.id}
                    column={column}
                    onColumnVisibilityChange={setColumnVisibility}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </Reorder.Group>
            )}

            {/* Divider with title */}
            {hiddenColumnsList.length > 0 && (
              <div className="my-2 mt-2 bg-gray-50 px-5 py-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Additional columns</h4>
              </div>
            )}

            {/* Hidden columns - Not draggable with smooth animations */}
            <AnimatePresence initial={false}>
              {hiddenColumnsList.map((column) => (
                <motion.div
                  key={column.id}
                  layout
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                    layout: { duration: 0.3 },
                  }}
                  className="flex items-center gap-3 overflow-hidden px-5 py-3 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={false}
                    readOnly
                    onClick={() => setColumnVisibility(column.id, true)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900"
                  />
                  <span className="flex-1 select-none text-sm text-gray-700">{column.header}</span>
                  <GripVertical className="h-4 w-4 text-gray-300 opacity-40" />
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
