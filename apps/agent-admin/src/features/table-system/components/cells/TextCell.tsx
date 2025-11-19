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
  defaultLabelValue?: string | null;
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
  defaultLabelValue,
}: TextCellProps) => {
  if ((value === null || value === undefined || value === '') && !defaultLabelValue) {
    return <EmptyCell />;
  }
  let text = value === null || value === undefined || value === '' ? (defaultLabelValue ?? '') : String(value);

  if (labelAssignmentType === 'MAPPING' && labelAssignmentValue) {
    text = labelAssignmentValue[text] ?? text;
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
