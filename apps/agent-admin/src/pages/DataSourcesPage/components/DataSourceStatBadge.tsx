import React from 'react';
import { SourcesUploadStatus } from '../constants';
import SourcesUploadHourGlassIcon from '@breakout/design-system/components/icons/sources-upload-hourglass-icon';
import { cn } from '@breakout/design-system/lib/cn';

interface DataSourceStatBadgeProps {
  itemKey: keyof typeof SourcesUploadStatus;
  itemLabel: string;
  itemValue: string | number;
  itemValueLabel?: string;
}

const DataSourceStatBadge: React.FC<DataSourceStatBadgeProps> = ({
  itemKey,
  itemLabel,
  itemValue,
  itemValueLabel = '',
}) => (
  <div
    className={cn('flex items-center justify-center gap-2 rounded-lg py-1 pl-2 pr-3 text-xs', {
      'border border-bluegray-300 bg-bluegray-25': itemKey === SourcesUploadStatus.UPLOADED,
      'border border-warning-300 bg-warning-25': itemKey === SourcesUploadStatus.UPLOAD_IN_PROGRESS,
    })}
  >
    {itemLabel.length && itemKey === SourcesUploadStatus.UPLOADED ? (
      <span className="font-semibold text-bluegray-800">{itemLabel}</span>
    ) : null}
    {itemKey === SourcesUploadStatus.UPLOAD_IN_PROGRESS && (
      <SourcesUploadHourGlassIcon className="text-warning-800" width="16" height="16" />
    )}
    <span
      className={cn({
        'text-bluegray-1000': itemKey === SourcesUploadStatus.UPLOADED,
        'font-medium capitalize text-warning-1000': itemKey === SourcesUploadStatus.UPLOAD_IN_PROGRESS,
      })}
    >
      {`${itemValue} ${itemValueLabel}`}
    </span>
  </div>
);

export default DataSourceStatBadge;
