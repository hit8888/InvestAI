import { LabelAssignmentType } from '../../types/column.types';
import { TruncatedText } from './TruncatedText';

interface TextCellProps {
  value: unknown;
  tooltip?: string;
  labelPrefix?: string | null;
  labelSuffix?: string | null;
  labelAssignmentType?: LabelAssignmentType | null;
  labelAssignmentValue?: Record<string, string> | null;
}

/**
 * TextCell - Plain text with truncation and tooltip
 * Used for: Rep Joined, Lead Name, Lead Source, Traffic Source, Customer, Pushed to CRM
 */
export const TextCell = ({
  value,
  tooltip,
  labelPrefix,
  labelSuffix,
  labelAssignmentType,
  labelAssignmentValue,
}: TextCellProps) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>;
  }

  let text = String(value);

  if (labelAssignmentType === 'MAPPING' && labelAssignmentValue) {
    text = labelAssignmentValue?.[value as string | number] || text;
  }
  // Use TruncatedText with custom tooltip if provided, or default behavior
  return (
    <TruncatedText
      text={`${labelPrefix ? `${labelPrefix}` : ''}${text}${labelSuffix ? `${labelSuffix}` : ''}`}
      maxWidth="200px"
      customTooltip={tooltip && tooltip.trim() ? tooltip : undefined}
      tooltipSide="top"
      tooltipDelay={200}
    />
  );
};
