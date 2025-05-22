import { useMemo } from 'react';
import { useScreenSize } from '@meaku/core/hooks/useScreenSize';
import {
  WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_CLOSED,
  WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_OPEN,
  WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_DATA_SOURCE_SIDEBAR_CLOSED,
  WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_DATA_SOURCE_SIDEBAR_OPEN,
} from '@meaku/core/utils/index';

interface UseTableWidthReturn {
  widthStyle: { maxWidth: string };
}

interface UseTableWidthProps {
  isDataSourcesPage?: boolean;
  isSidebarOpen: boolean;
}

export const useTableWidth = ({
  isDataSourcesPage = false,
  isSidebarOpen,
}: UseTableWidthProps): UseTableWidthReturn => {
  const { screenWidth } = useScreenSize();

  let widthToBeSubtractedFromScreenWidth;

  if (isDataSourcesPage) {
    widthToBeSubtractedFromScreenWidth = isSidebarOpen
      ? WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_DATA_SOURCE_SIDEBAR_OPEN
      : WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_DATA_SOURCE_SIDEBAR_CLOSED;
  } else {
    widthToBeSubtractedFromScreenWidth = isSidebarOpen
      ? WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_OPEN
      : WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_CLOSED;
  }

  const tableWidth = useMemo(() => {
    return isSidebarOpen
      ? screenWidth - widthToBeSubtractedFromScreenWidth
      : screenWidth - widthToBeSubtractedFromScreenWidth;
  }, [isSidebarOpen, screenWidth, widthToBeSubtractedFromScreenWidth]);

  const widthStyle = useMemo(() => ({ maxWidth: `${tableWidth}px` }), [tableWidth]);

  return {
    widthStyle,
  };
};
