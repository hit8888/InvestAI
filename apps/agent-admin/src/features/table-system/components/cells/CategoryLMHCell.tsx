import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';

interface CategoryLMHCellProps {
  /** Value to display (already processed from metadata) */
  value: unknown;
  /** Column ID for specific logic (optional) */
  columnId?: string;
  /** Optional tooltip text */
  tooltip?: string;
}

/**
 * CategoryLMHCell - Pure component for Low/Medium/High categories with colors
 *
 * This component is now metadata-driven and receives pre-processed props:
 * - value: Pre-processed value from metadata
 * - columnId: Column ID for specific logic (optional)
 * - tooltip: Tooltip text from TOOLTIP metadata relations (optional)
 *
 * Colors:
 * - Low: Red (text-red-600)
 * - Medium: Orange (text-orange-600)
 * - High: Green (text-green-600)
 */
export const CategoryLMHCell = ({ value, columnId, tooltip }: CategoryLMHCellProps) => {
  // If no value, show dash
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  // Convert numeric buyer_intent_score (1-100 scale) to L/M/H category
  let category: string;
  if (columnId === 'buyer_intent_score' && typeof value === 'number') {
    if (value >= 1 && value < 33) {
      category = 'low';
    } else if (value >= 33 && value < 66) {
      category = 'medium';
    } else if (value >= 66 && value <= 100) {
      category = 'high';
    } else {
      // Invalid score range
      category = String(value).toLowerCase();
    }
  } else {
    // For string values (relevance_score, etc.)
    category = String(value).toLowerCase();
  }

  // Determine color and display text based on category
  let colorClass = '';
  let displayText = '';

  if (category === 'low' || category === 'l') {
    colorClass = 'text-red-600';
    displayText = 'Low';
  } else if (category === 'medium' || category === 'm' || category === 'med') {
    colorClass = 'text-orange-600';
    displayText = 'Medium';
  } else if (category === 'high' || category === 'h') {
    colorClass = 'text-green-600';
    displayText = 'High';
  } else {
    // Unknown category - render the raw value
    colorClass = 'text-gray-500';
    displayText = String(value);
  }

  // If tooltip is present and not empty, wrap in Tooltip component
  if (tooltip && tooltip.trim()) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <span className={`text-sm font-normal ${colorClass} cursor-default`}>{displayText}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // No tooltip - render plain span
  return <span className={`text-sm font-normal ${colorClass}`}>{displayText}</span>;
};
