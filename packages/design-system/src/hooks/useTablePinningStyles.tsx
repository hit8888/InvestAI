import { CSSProperties } from 'react';
import { Column } from '@tanstack/react-table';
import {
  ConversationsTableDisplayContent,
  LeadsTableDisplayContent,
  VisitorsTableDisplayContent,
} from '@neuraltrade/core/types/admin/admin';

export const useTablePinningStyles = () => {
  const getCommonPinningStyles = (
    column: Column<ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent>,
  ): CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      opacity: 1,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? (column.id === 'name' ? 3 : 2) : 1,
      backgroundColor: isPinned ? 'inherit' : undefined,
    };
  };

  return { getCommonPinningStyles };
};
