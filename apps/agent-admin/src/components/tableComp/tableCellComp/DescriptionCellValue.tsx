import { useState } from 'react';
import { DATA_SOURCE_DESCRIPTION_TRIM_LENGTH } from '../../../utils/constants';
import { DescriptionValue } from '@meaku/core/types/admin/admin-table';
import Typography from '@breakout/design-system/components/Typography/index';
import SparkleThreeStarIcon from '@breakout/design-system/components/icons/sparkle-three-star';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import Button from '@breakout/design-system/components/Button/index';

const DescriptionCellValue = ({ value }: { value: DescriptionValue }) => {
  const [showTrimmed, setShowTrimmed] = useState(true);
  const showMoreButtonText = showTrimmed ? 'Read More' : 'Read Less';

  const renderTitleAndLabel = () => {
    const showLabel = value.title && value.labelled_by_name;
    return (
      <div className="flex w-full items-center gap-2">
        {value.title && (
          <Typography variant="label-14-semibold" className="flex-1 break-all">
            {value.title}
          </Typography>
        )}
        {showLabel && (
          <Typography
            className="flex items-center gap-2 rounded-lg bg-primary/10 p-1 pr-2 text-primary/70"
            variant="caption-12-medium"
          >
            <SparkleThreeStarIcon className="h-4 w-4" />
            {value.labelled_by_name}
          </Typography>
        )}
      </div>
    );
  };

  const handleShowMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowTrimmed((showMore) => !showMore);
  };

  return (
    <div className="flex w-full flex-col items-start gap-2">
      {renderTitleAndLabel()}
      {value.description && (
        <div className="w-full text-sm text-gray-900">
          <GithubMarkdownRenderer
            markdown={
              showTrimmed
                ? `${value.description.substring(0, DATA_SOURCE_DESCRIPTION_TRIM_LENGTH)}...`
                : value.description
            }
          />
        </div>
      )}
      {value.description && (
        <Button
          variant="tertiary"
          onClick={handleShowMore}
          className={`flex items-center gap-2 self-end rounded-md px-3 py-1.5 text-sm font-medium text-primary`}
        >
          <span>{showMoreButtonText}</span>
        </Button>
      )}
    </div>
  );
};

export default DescriptionCellValue;
