import { TruncatedText } from './TruncatedText';

interface TextCellProps {
  value: unknown;
  tooltip?: string;
}

/**
 * TextCell - Plain text with truncation and tooltip
 * Used for: Rep Joined, Lead Name, Lead Source, Traffic Source, Customer, Pushed to CRM
 */
export const TextCell = ({ value, tooltip }: TextCellProps) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  const text = String(value);

  // Use TruncatedText with custom tooltip if provided, or default behavior
  return (
    <TruncatedText
      text={text}
      maxWidth="200px"
      customTooltip={tooltip && tooltip.trim() ? tooltip : undefined}
      tooltipSide="top"
      tooltipDelay={200}
    />
  );
};
