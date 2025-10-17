import { ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';

interface LinkCellProps {
  value: unknown;
  tooltip?: string;
}

/**
 * LinkCell - Clickable URL in blue
 * Used for: Page Browsed, LinkedIn columns
 */
export const LinkCell = ({ value, tooltip }: LinkCellProps) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  const url = String(value);

  // Validate URL
  let isValidUrl = false;
  let href = url;

  try {
    // Try to parse as URL
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    isValidUrl = true;
    href = urlObj.href;
  } catch {
    // Not a valid URL, show as-is
    href = `https://${url}`; // Try to make it work anyway
  }

  if (!isValidUrl) {
    return (
      <span className="block truncate text-sm text-gray-900" title={url}>
        {url}
      </span>
    );
  }

  const linkContent = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex max-w-full items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
      title={tooltip || href}
      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
    >
      <span className="truncate">{href}</span>
      <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );

  // If explicit tooltip is provided and not empty, use Tooltip component
  if (tooltip && tooltip.trim()) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkContent;
};
