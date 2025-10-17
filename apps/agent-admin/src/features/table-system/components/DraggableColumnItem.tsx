import { GripVertical } from 'lucide-react';
import { memo, useRef, useEffect, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import type { TableColumnDefinition } from '../types';

interface DraggableColumnItemProps {
  column: TableColumnDefinition;
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/**
 * Draggable column item for reordering
 * Memoized to prevent unnecessary re-renders during drag
 */
export const DraggableColumnItem = memo(
  ({ column, onColumnVisibilityChange, onDragStart, onDragEnd }: DraggableColumnItemProps) => {
    const dragControls = useDragControls();
    const isDraggingRef = useRef(false);
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Don't toggle if we just finished dragging
      if (isDraggingRef.current) {
        return;
      }
      onColumnVisibilityChange(column.id, false);
    };

    const startDrag = (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      setIsDragging(true);
      dragControls.start(e);
      if (onDragStart) onDragStart();
    };

    const preventSelection = (e: React.MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
      }
    };

    const endDrag = () => {
      // Immediately clear drag state for animation
      setIsDragging(false);

      // Clear any existing timeout
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }

      // Keep dragging flag true for a bit to prevent click from firing
      dragTimeoutRef.current = setTimeout(() => {
        isDraggingRef.current = false;
      }, 150);

      if (onDragEnd) onDragEnd();
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (dragTimeoutRef.current) {
          clearTimeout(dragTimeoutRef.current);
        }
      };
    }, []);

    return (
      <Reorder.Item
        value={column}
        dragListener={false}
        dragControls={dragControls}
        onMouseDown={preventSelection}
        className="flex select-none items-center gap-3 px-5 py-3 hover:bg-gray-50"
        style={{ position: 'relative', userSelect: 'none', WebkitUserSelect: 'none' }}
        initial={false}
        animate={
          isDragging
            ? {
                scale: 1.02,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                backgroundColor: '#f9fafb',
              }
            : {
                scale: 1,
                boxShadow: '0 0 0 rgba(0,0,0,0)',
                backgroundColor: 'rgba(255,255,255,0)',
              }
        }
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onDragEnd={endDrag}
      >
        {/* Checkbox - clickable to toggle visibility */}
        <input
          type="checkbox"
          checked={true}
          readOnly
          onClick={handleCheckboxClick}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900"
        />

        {/* Column name */}
        <span className="pointer-events-none flex-1 select-none text-sm text-gray-700">{column.header}</span>

        {/* Drag handle */}
        <div
          onPointerDown={startDrag}
          onMouseDown={(e) => e.preventDefault()}
          className="drag-handle cursor-grab select-none p-1 active:cursor-grabbing"
          style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <GripVertical className="pointer-events-none h-4 w-4 text-gray-400" />
        </div>
      </Reorder.Item>
    );
  },
);

DraggableColumnItem.displayName = 'DraggableColumnItem';
