import { DATA_SOURCE_STATUS } from '../../../pages/DataSourcesPage/constants';
import { cn } from '@breakout/design-system/lib/cn';

const statusText: Record<DATA_SOURCE_STATUS, string> = {
  [DATA_SOURCE_STATUS.PENDING]: 'PENDING',
  [DATA_SOURCE_STATUS.CRAWLING]: 'CRAWLING',
  [DATA_SOURCE_STATUS.CRAWLED]: 'CRAWLED',
  [DATA_SOURCE_STATUS.CLEANING]: 'CLEANING',
  [DATA_SOURCE_STATUS.CLEANED]: 'CLEANED',
  [DATA_SOURCE_STATUS.VECTORIZED]: 'VECTORIZED',
  [DATA_SOURCE_STATUS.FAILED]: 'FAILED',
  [DATA_SOURCE_STATUS.CANCELLED]: 'CANCELLED',
  [DATA_SOURCE_STATUS.COMPLETED]: 'COMPLETED',
  [DATA_SOURCE_STATUS.AI_LABELING_SCHEDULED]: 'AI_LABELING_SCHEDULED',
  [DATA_SOURCE_STATUS.IMAGE_ANALYSIS_IN_PROGRESS]: 'IMAGE_ANALYSIS_IN_PROGRESS',
  [DATA_SOURCE_STATUS.TRANSCRIBING_VIDEO]: 'TRANSCRIBING_VIDEO',
  [DATA_SOURCE_STATUS.VIDEO_TRANSCRIBED]: 'VIDEO_TRANSCRIBED',
  [DATA_SOURCE_STATUS.VIDEO_TEXT_ANALYSIS_IN_PROGRESS]: 'VIDEO_TEXT_ANALYSIS_IN_PROGRESS',
  [DATA_SOURCE_STATUS.LABELLED]: 'LABELLED',
  [DATA_SOURCE_STATUS.VECTORIZATION_SCHEDULED]: 'VECTORIZATION_SCHEDULED',
  [DATA_SOURCE_STATUS.VECTORIZING]: 'VECTORIZING',
};

const statusClasses: Record<DATA_SOURCE_STATUS, string> = {
  [DATA_SOURCE_STATUS.VECTORIZED]: 'bg-positive-100 text-positive-1000',
  [DATA_SOURCE_STATUS.COMPLETED]: 'bg-positive-100 text-positive-1000',
  [DATA_SOURCE_STATUS.FAILED]: 'bg-destructive-100 text-destructive-1000',
  [DATA_SOURCE_STATUS.CANCELLED]: 'bg-destructive-100 text-destructive-1000',
  [DATA_SOURCE_STATUS.PENDING]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CRAWLING]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CRAWLED]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CLEANING]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CLEANED]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.AI_LABELING_SCHEDULED]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.IMAGE_ANALYSIS_IN_PROGRESS]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.TRANSCRIBING_VIDEO]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.VIDEO_TRANSCRIBED]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.VIDEO_TEXT_ANALYSIS_IN_PROGRESS]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.LABELLED]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.VECTORIZATION_SCHEDULED]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.VECTORIZING]: 'bg-orange_sec-100 text-orange_sec-1000',
};

const getAnimationClass = (status: DATA_SOURCE_STATUS): string => {
  const animatedStatuses = [
    DATA_SOURCE_STATUS.PENDING,
    DATA_SOURCE_STATUS.CRAWLING,
    DATA_SOURCE_STATUS.CLEANING,
    DATA_SOURCE_STATUS.IMAGE_ANALYSIS_IN_PROGRESS,
    DATA_SOURCE_STATUS.TRANSCRIBING_VIDEO,
    DATA_SOURCE_STATUS.VIDEO_TEXT_ANALYSIS_IN_PROGRESS,
    DATA_SOURCE_STATUS.VECTORIZING,
  ];
  return animatedStatuses.includes(status) ? 'animate-pulse' : '';
};

interface DataSourceStatusChipProps {
  status: DATA_SOURCE_STATUS;
}

const DataSourceStatusChip: React.FC<DataSourceStatusChipProps> = ({ status }) => {
  if (!status) return null;
  return (
    <div
      className={cn(
        'inline-block max-w-40 rounded-full px-3 py-1 text-sm font-medium capitalize',
        statusClasses[status],
        getAnimationClass(status),
      )}
    >
      {statusText[status]?.replace(/_/g, ' ')?.toLowerCase()}
    </div>
  );
};

export default DataSourceStatusChip;
