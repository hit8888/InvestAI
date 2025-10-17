import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';

interface EmailCellProps {
  value: unknown;
  tooltip?: string;
}

/**
 * EmailCell - Email address with copy to clipboard
 * Used for: Email column
 */
export const EmailCell = ({ value, tooltip }: EmailCellProps) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  const email = String(value);

  const emailContent = (
    <div className="group flex items-center gap-2">
      <span className="block truncate text-sm text-gray-800" title={tooltip || email}>
        {email}
      </span>
      <CopyToClipboardButton
        textToCopy={email}
        toastMessage="Email copied to clipboard"
        btnClassName="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
        copyIconClassname="h-3.5 w-3.5"
      />
    </div>
  );

  // If explicit tooltip is provided and not empty, use Tooltip component
  if (tooltip && tooltip.trim()) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>{emailContent}</TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return emailContent;
};
