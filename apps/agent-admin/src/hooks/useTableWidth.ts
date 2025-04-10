import { useMemo } from 'react';
import { useScreenSize } from '@meaku/core/hooks/useScreenSize';
import { useSidebar } from '../context/SidebarContext';
import {
  WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_CLOSED,
  WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_OPEN,
} from '../utils/constants';

interface UseTableWidthReturn {
  widthStyle: { maxWidth: string };
}

export const useTableWidth = (): UseTableWidthReturn => {
  const { screenWidth } = useScreenSize();
  const { isSidebarOpen } = useSidebar();

  const tableWidth = useMemo(() => {
    return isSidebarOpen
      ? screenWidth - WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_OPEN
      : screenWidth - WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_CLOSED;
  }, [isSidebarOpen, screenWidth]);

  const widthStyle = useMemo(() => ({ maxWidth: `${tableWidth}px` }), [tableWidth]);

  return {
    widthStyle,
  };
};
