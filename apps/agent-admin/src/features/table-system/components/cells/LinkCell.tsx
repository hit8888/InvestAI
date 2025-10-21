import { ExternalLink } from 'lucide-react';
import { TruncatedText } from './TruncatedText';

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
      <TruncatedText
        text={url}
        maxWidth="200px"
        customTooltip={tooltip && tooltip.trim() ? tooltip : undefined}
        tooltipSide="top"
        tooltipDelay={200}
      />
    );
  }

  // Create the link content with TruncatedText for the URL part
  const linkContent = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex max-w-full items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
    >
      <div className="min-w-0 flex-1">
        <TruncatedText
          text={href}
          maxWidth="200px"
          className="text-blue-600 hover:text-blue-800"
          customTooltip={tooltip && tooltip.trim() ? tooltip : undefined}
        />
      </div>
      <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );

  return linkContent;
};
