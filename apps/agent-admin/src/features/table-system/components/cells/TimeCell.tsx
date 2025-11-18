import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import DateUtil from '@meaku/core/utils/dateUtils';
import { CellContainer } from './CellContainer';
import EmptyCell from './EmptyCell';

interface TimeCellProps {
  value: unknown;
}

/**
 * TimeCell - Human-readable time format matching V1 tables
 * Used for: DATETIME columns - shows "Today", "Yesterday", time, or date
 */
export const TimeCell = ({ value }: TimeCellProps) => {
  if (value === null || value === undefined || value === '') {
    return <EmptyCell />;
  }

  try {
    const { getDateInHumanReadableFormat, formatDateTime } = DateUtil;
    const displayValue = getDateInHumanReadableFormat(value as string);
    const tooltipValue = formatDateTime(value as string);

    const cellContent = (
      <CellContainer className="cursor-default">
        <span className="block truncate text-sm text-gray-900">{displayValue}</span>
      </CellContainer>
    );

    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {tooltipValue}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } catch {
    return <EmptyCell />;
  }
};
