import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';

interface TimeCellProps {
  value: unknown;
}

/**
 * TimeCell - Relative time with absolute time tooltip on hover
 * Used for: Last Interacted column
 */
export const TimeCell = ({ value }: TimeCellProps) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  try {
    const date = new Date(value as string | number | Date);

    if (isNaN(date.getTime())) {
      return <span className="text-gray-400">Invalid date</span>;
    }

    const relativeTime = formatDistanceToNow(date, { addSuffix: true });
    const absoluteTime = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);

    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <span className="block cursor-default truncate text-sm text-gray-900">{relativeTime}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {absoluteTime}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } catch {
    return <span className="text-gray-400">-</span>;
  }
};
