import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import { getLabelAssignmentValue } from '@meaku/core/utils/index';
import { LabelAssignmentType } from '../../types/column.types';
import { CellContainer } from './CellContainer';
import EmptyCell from './EmptyCell';

interface CategoryLMHCellProps {
  /** Value to display (already processed from metadata) */
  value: unknown;
  /** Optional tooltip text */
  tooltip?: string;
  labelAssignmentType?: LabelAssignmentType | null;
  labelAssignmentValue?: Record<string, string> | Record<string, [Array<string | number>, string]> | null;
  labelPrefix?: string | null;
  labelSuffix?: string | null;
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
export const CategoryLMHCell = ({
  value,
  tooltip,
  labelAssignmentType,
  labelAssignmentValue,
  labelPrefix,
  labelSuffix,
}: CategoryLMHCellProps) => {
  // If no value, show dash
  if (value === null || value === undefined || value === '') {
    return <EmptyCell />;
  }

  const category = getLabelAssignmentValue(
    value as number,
    labelAssignmentType ?? null,
    labelAssignmentValue as Record<string, string | [Array<string | number>, string]> | null,
  ) as string;
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
  const content = <>{`${labelPrefix ?? ''}${displayText}${labelSuffix ?? ''}`}</>;

  if (tooltip && tooltip.trim()) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <CellContainer className={`text-sm font-normal ${colorClass} cursor-default`}>{content}</CellContainer>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <CellContainer className={`text-sm font-normal ${colorClass} cursor-default`} title={tooltip}>
      {content}
    </CellContainer>
  );
};
