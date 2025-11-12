import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import { LabelAssignmentType } from '../../types/column.types';

interface CategoryLMHCellProps {
  /** Value to display (already processed from metadata) */
  value: unknown;
  /** Optional tooltip text */
  tooltip?: string;
  labelAssignmentType?: LabelAssignmentType | null;
  labelAssignmentValue?: Record<string | number, string> | null;
  labelPrefix?: string | null;
  labelSuffix?: string | null;
}

const getNumericConditionValue = (value: string | number, labelAssignmentValue: Record<string, string> | null) => {
  /*
        key in labelAssignmentValue would be <operator><number> 
        Ex: "gt10" -> value is greater than 10
        Ex: "lt5" -> value is less than 5
        Ex: "eq10" -> value is equal to 10
        Ex: "neq10" -> value is not equal to 10
        Ex: "gte10" -> value is greater than or equal to 10
        Ex: "lte5" -> value is less than or equal to 5
        Ex: "between10-20" -> value is between 10 and 20
        Ex: "not_between10-20" -> value is not between 10 and 20
        Ex: "contains10" -> value contains 10
      */
  if (!labelAssignmentValue) {
    return value;
  }

  // Convert value to number for numeric comparisons
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const isNumeric = !isNaN(numericValue) && isFinite(numericValue);

  // Find the first matching condition
  const matchingKey = Object.keys(labelAssignmentValue).find((key) => {
    // Handle between/not_between operators
    if (key.startsWith('between')) {
      const match = key.match(/between(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/);
      if (match && isNumeric) {
        const [, min, max] = match;
        const minNum = parseFloat(min);
        const maxNum = parseFloat(max);
        return numericValue >= minNum && numericValue <= maxNum;
      }
      return false;
    }

    if (key.startsWith('not_between')) {
      const match = key.match(/not_between(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/);
      if (match && isNumeric) {
        const [, min, max] = match;
        const minNum = parseFloat(min);
        const maxNum = parseFloat(max);
        return numericValue < minNum || numericValue > maxNum;
      }
      return false;
    }

    // Handle contains operator (for string values)
    if (key.startsWith('contains')) {
      const match = key.match(/contains(.+)/);
      if (match) {
        const searchValue = match[1];
        return String(value).includes(searchValue);
      }
      return false;
    }

    // Handle other operators: gt, lt, eq, neq, gte, lte
    const operatorMatch = key.match(/^(gt|lt|eq|neq|gte|lte)(\d+(?:\.\d+)?)$/);
    if (operatorMatch && isNumeric) {
      const [, operator, numStr] = operatorMatch;
      const compareNum = parseFloat(numStr);

      switch (operator) {
        case 'gt':
          return numericValue > compareNum;
        case 'lt':
          return numericValue < compareNum;
        case 'eq':
          return numericValue === compareNum;
        case 'neq':
          return numericValue !== compareNum;
        case 'gte':
          return numericValue >= compareNum;
        case 'lte':
          return numericValue <= compareNum;
        default:
          return false;
      }
    }

    return false;
  });

  return matchingKey ? labelAssignmentValue[matchingKey] : value;
};

const getLabelAssignmentValue = (
  value: string | number,
  labelAssignmentType: LabelAssignmentType | null,
  labelAssignmentValue: Record<string, string> | null,
) => {
  if (!labelAssignmentType) {
    return value;
  }
  switch (labelAssignmentType) {
    case 'NONE':
      return value;
    case 'MAPPING':
      return labelAssignmentValue?.[value as string | number];
    case 'NUMERIC_CONDITION': {
      return getNumericConditionValue(value, labelAssignmentValue);
    }
  }
};

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
    return <span className="text-gray-400">-</span>;
  }

  const category = getLabelAssignmentValue(
    value as number,
    labelAssignmentType as LabelAssignmentType | null,
    labelAssignmentValue as Record<string, string> | null,
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
  if (tooltip && tooltip.trim()) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <span
              className={`text-sm font-normal ${colorClass} cursor-default`}
            >{`${labelPrefix ? `${labelPrefix}` : ''}${displayText}${labelSuffix ? `${labelSuffix}` : ''}`}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gray-900 text-white">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // No tooltip - render plain span
  return (
    <span
      className={`text-sm font-normal ${colorClass}`}
    >{`${labelPrefix ? `${labelPrefix}` : ''}${displayText}${labelSuffix ? `${labelSuffix}` : ''}`}</span>
  );
};
