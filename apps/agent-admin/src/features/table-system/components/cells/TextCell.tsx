import { LabelAssignmentType } from '../../types/column.types';
import { CellContainer } from './CellContainer';
import { TruncatedText } from './TruncatedText';
import EmptyCell from './EmptyCell';

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
    return <EmptyCell />;
  }

  let text = String(value);

  if (
    labelAssignmentType === 'MAPPING' &&
    labelAssignmentValue &&
    (typeof value === 'string' || typeof value === 'number')
  ) {
    text = labelAssignmentValue[value] ?? text;
  }
  // Use TruncatedText with custom tooltip if provided, or default behavior
  return (
    <CellContainer>
      <TruncatedText
        text={`${labelPrefix ?? ''}${text}${labelSuffix ?? ''}`}
        maxWidth="200px"
        customTooltip={tooltip && tooltip.trim() ? tooltip : undefined}
        tooltipSide="top"
        tooltipDelay={200}
      />
    </CellContainer>
  );
};
