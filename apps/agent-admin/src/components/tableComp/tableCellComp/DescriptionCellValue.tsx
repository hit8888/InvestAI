import { useState } from 'react';
import { DATA_SOURCE_DESCRIPTION_TRIM_LENGTH } from '../../../utils/constants';
import { DescriptionValue } from '@meaku/core/types/admin/admin-table';
import Typography from '@breakout/design-system/components/Typography/index';
import SparkleThreeStarIcon from '@breakout/design-system/components/icons/sparkle-three-star';

const DescriptionCellValue = ({ value }: { value: DescriptionValue }) => {
  const [showTrimmed, setShowTrimmed] = useState(true);
  const showMoreButtonText = showTrimmed ? 'Read More' : 'Read Less';

  const renderTitleAndLabel = () => {
    return (
      <div className="flex w-full items-center gap-2">
        {value.title && (
          <Typography variant="label-14-semibold" className="flex-1">
            {value.title}
          </Typography>
        )}
        {value.labelled_by_name && (
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

  return (
    <div className="flex flex-col items-start gap-2">
      {renderTitleAndLabel()}
      {value.description && (
        <p className="w-[85%] text-sm text-gray-900">
          {showTrimmed
            ? `${value.description.substring(0, DATA_SOURCE_DESCRIPTION_TRIM_LENGTH)}...`
            : value.description}
        </p>
      )}
      {value.description && (
        <div
          onClick={() => setShowTrimmed((showMore) => !showMore)}
          className={`flex cursor-pointer items-center gap-2 self-end rounded-md px-3 py-1.5 text-sm font-medium text-primary`}
        >
          <span>{showMoreButtonText}</span>
        </div>
      )}
    </div>
  );
};

export default DescriptionCellValue;
