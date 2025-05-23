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
};

const statusClasses: Record<DATA_SOURCE_STATUS, string> = {
  [DATA_SOURCE_STATUS.VECTORIZED]: 'bg-positive-100 text-positive-1000',
  [DATA_SOURCE_STATUS.FAILED]: 'bg-destructive-100 text-destructive-1000',
  [DATA_SOURCE_STATUS.CANCELLED]: 'bg-destructive-100 text-destructive-1000',
  [DATA_SOURCE_STATUS.PENDING]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CRAWLING]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CRAWLED]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CLEANING]: 'bg-orange_sec-100 text-orange_sec-1000',
  [DATA_SOURCE_STATUS.CLEANED]: 'bg-orange_sec-100 text-orange_sec-1000',
};

const getAnimationClass = (status: DATA_SOURCE_STATUS): string => {
  const animatedStatuses = [DATA_SOURCE_STATUS.PENDING, DATA_SOURCE_STATUS.CRAWLING, DATA_SOURCE_STATUS.CLEANING];
  return animatedStatuses.includes(status) ? 'animate-pulse' : '';
};

interface DataSourceStatusChipProps {
  status: DATA_SOURCE_STATUS;
}

const DataSourceStatusChip: React.FC<DataSourceStatusChipProps> = ({ status }) => {
  return (
    <div
      className={cn(
        'inline-block rounded-full px-3 py-1 text-base font-medium capitalize',
        statusClasses[status],
        getAnimationClass(status),
      )}
    >
      {statusText[status]}
    </div>
  );
};

export default DataSourceStatusChip;
