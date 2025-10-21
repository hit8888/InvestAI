import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import DateUtil from '@meaku/core/utils/dateUtils';

interface TimeCellProps {
  value: unknown;
}

/**
 * TimeCell - Human-readable time format matching V1 tables
 * Used for: DATETIME columns - shows "Today", "Yesterday", time, or date
 */
export const TimeCell = ({ value }: TimeCellProps) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  try {
    const { getDateInHumanReadableFormat, formatDateTime } = DateUtil;
    const displayValue = getDateInHumanReadableFormat(value as string);
    const tooltipValue = formatDateTime(value as string);

    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <span className="block cursor-default truncate text-sm text-gray-900">{displayValue}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {tooltipValue}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } catch {
    return <span className="text-gray-400">-</span>;
  }
};
