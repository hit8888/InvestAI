import React from 'react';
import { SourcesCardTypes, SourcesUploadStatus } from '../constants';
import WebpagesSourcesIcon from '@breakout/design-system/components/icons/sources-webpages-icon';
import DocumentsSourcesIcon from '@breakout/design-system/components/icons/sources-documents-icon';
import VideosSourcesIcon from '@breakout/design-system/components/icons/sources-videos-icon';
import SlidesSourcesIcon from '@breakout/design-system/components/icons/sources-slides-icon';
import FeaturesSourcesIcon from '@breakout/design-system/components/icons/sources-features-icon';
import FeaturesSourcesEditIcon from '@breakout/design-system/components/icons/sources-features-edit-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import ArrowRight from '@breakout/design-system/components/icons/ArrowRight';
import { useDataSources } from '../../../context/DataSourcesContext';
import DataSourceStatBadge from './DataSourceStatBadge';
import { useNavigate } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';

interface Stat {
  itemLabel: string;
  itemValue: string | number;
  itemKey: keyof typeof SourcesUploadStatus;
}

interface DataSourceCardProps {
  title: string;
  stats: Stat[];
  type: string;
  hasEdit?: boolean;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ title, stats, type, hasEdit = false }) => {
  const Icon = (() => {
    switch (type) {
      case SourcesCardTypes.WEBPAGES:
        return WebpagesSourcesIcon;
      case SourcesCardTypes.DOCUMENTS:
        return DocumentsSourcesIcon;
      case SourcesCardTypes.VIDEOS:
        return VideosSourcesIcon;
      case SourcesCardTypes.SLIDES:
        return SlidesSourcesIcon;
      case SourcesCardTypes.FEATURES:
        return FeaturesSourcesIcon;
      default:
        return null;
    }
  })();

  const itemValueLabel = (() => {
    switch (type) {
      case SourcesCardTypes.FEATURES:
        return '';
      default:
        return type;
    }
  })();

  const { toggleDataSourceSelectedType } = useDataSources();
  const navigate = useNavigate();
  const onCardClick = () => {
    if (hasEdit) return;
    navigate(type);
    toggleDataSourceSelectedType(type);
  };

  const getTrigger = () => {
    return (
      <div
        onClick={!hasEdit ? onCardClick : undefined}
        className={`data-sources-card-shadow flex w-full items-center justify-between gap-6 
          rounded-lg border border-primary/20 p-4 transition-all duration-300 
          hover:border-primary/40 hover:bg-bluegray-50 hover:shadow-md`}
      >
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-2 self-stretch">
            {Icon && <Icon className="text-gray-500" width="16" height="16" />}
            <Typography variant={'label-16-medium'} className="flex-1">
              {title}
            </Typography>
          </div>
        </div>
        <div className="flex w-full flex-1 items-center justify-end gap-6">
          <div className="flex items-start gap-3">
            {stats.map((stat) => (
              <DataSourceStatBadge
                key={stat.itemKey}
                itemKey={stat.itemKey}
                itemLabel={stat.itemLabel}
                itemValue={stat.itemValue}
                itemValueLabel={itemValueLabel}
              />
            ))}
          </div>
          {/* TODO: remove the hidden when the feature is implemented */}
          <Button
            className={cn('', {
              '!hidden': isFeatureCard,
            })}
            variant={'system_secondary'}
            buttonStyle={'icon'}
          >
            {hasEdit ? <FeaturesSourcesEditIcon className="text-gray-600" /> : <ArrowRight className="text-gray-600" />}
          </Button>
        </div>
      </div>
    );
  };

  const isFeatureCard = type === SourcesCardTypes.FEATURES;
  return <div className="w-full cursor-pointer">{getTrigger()}</div>;
};

export default DataSourceCard;
