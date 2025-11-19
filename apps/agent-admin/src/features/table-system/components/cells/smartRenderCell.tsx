import React from 'react';
import type { CellType, EntityMetadataColumn } from '../../types';
import { gatherRelatedMetadata, getPrimaryValue } from '../../utils/metadataGatherer';

// Import pure cell components
import { TextCell } from './TextCell';
import { EmailCell } from './EmailCell';
import { CompanyCell } from './CompanyCell';
import { TimeCell } from './TimeCell';
import { CategoryLMHCell } from './CategoryLMHCell';
import { LinkCell } from './LinkCell';
import { LocationWithFlagCell } from './LocationWithFlagCell';
import { SdrAssignmentCell } from './SdrAssignmentCell';
import { LabelAssignmentType } from '../../types/column.types';

interface SmartRenderCellProps {
  cellType: CellType;
  column: EntityMetadataColumn;
  row: Record<string, unknown>;
  allColumns: EntityMetadataColumn[];
  columnId?: string;
}

/**
 * Smart cell renderer that preprocesses metadata and passes clean props to cells
 * This is the orchestrator that gathers all related metadata and delegates to pure components
 */
export const smartRenderCell = ({ cellType, column, row, allColumns }: SmartRenderCellProps): React.ReactNode => {
  // Get primary value for the column
  const primaryValue = getPrimaryValue(column, row);

  // Gather all related metadata for this column
  const metadata = gatherRelatedMetadata(column, row, allColumns);
  // Delegate to appropriate cell component with processed props
  switch (cellType) {
    case 'TEXT':
      return (
        <TextCell
          value={primaryValue}
          tooltip={metadata.tooltip}
          labelPrefix={column.label_prefix}
          labelSuffix={column.label_suffix}
          labelAssignmentType={column.label_assignment_type as LabelAssignmentType | null}
          labelAssignmentValue={column.label_assignment_value as Record<string, string> | null}
          defaultLabelValue={column.default_label_value}
        />
      );

    case 'EMAIL':
      return <EmailCell value={primaryValue} tooltip={metadata.tooltip} />;

    case 'COMPANY':
      // COMPANY cell gets processed logo and email data from metadata
      // If backend has meta_reference_column + meta_reference_relation set up,
      // gatherRelatedMetadata() will automatically find and process LOGO and EMAIL relations
      return (
        <CompanyCell
          name={primaryValue as string}
          logoUrl={metadata.logo}
          email={metadata.email}
          tooltip={metadata.tooltip}
        />
      );

    case 'DATETIME':
      return <TimeCell value={primaryValue} />;

    case 'COLORED_TEXT':
      // COLORED_TEXT cell can use tooltip from metadata
      return (
        <CategoryLMHCell
          value={primaryValue}
          tooltip={metadata.tooltip}
          labelAssignmentType={column.label_assignment_type as LabelAssignmentType | null}
          labelAssignmentValue={
            (column.label_assignment_value as
              | Record<string, string>
              | Record<string, [Array<string | number>, string]>
              | null) ?? null
          }
          labelPrefix={column.label_prefix}
          labelSuffix={column.label_suffix}
        />
      );

    case 'URL':
      return <LinkCell value={primaryValue} tooltip={metadata.tooltip} />;

    case 'LOCATION_WITH_FLAG':
      // LOCATION_WITH_FLAG cell gets the country value
      return <LocationWithFlagCell value={primaryValue as string} />;

    case 'SDR_ASSIGNMENT':
      // SDR_ASSIGNMENT cell gets the assignment data
      return <SdrAssignmentCell value={primaryValue} tooltip={metadata.tooltip} />;

    default:
      // Fallback to text for unknown cell types
      return (
        <TextCell
          value={primaryValue}
          tooltip={metadata.tooltip}
          labelPrefix={column.label_prefix}
          labelSuffix={column.label_suffix}
          labelAssignmentType={column.label_assignment_type as LabelAssignmentType | null}
          labelAssignmentValue={column.label_assignment_value as Record<string, string> | null}
          defaultLabelValue={column.default_label_value}
        />
      );
  }
};
