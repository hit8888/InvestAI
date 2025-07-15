import { Eye } from 'lucide-react';

import Typography from '@breakout/design-system/components/Typography/index';
import OverviewDataItem from './OverviewDataItem';
import DateUtil from '@meaku/core/utils/dateUtils';
import ArrowUpIcon from '@breakout/design-system/components/icons/arrow-up-icon';
import { cn } from '@breakout/design-system/lib/cn';
import { BrowsedUrl } from '@meaku/core/types/common';

interface UserActivityProps {
  browsedUrls: BrowsedUrl[];
}

const EmptyActivityState = () => (
  <div className="flex h-full flex-col items-center justify-center">
    <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 text-center ring-1 ring-blue-100/50">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 ring-2 ring-blue-200/50 transition-all duration-300">
        <Eye size={20} className="text-white" />
      </div>
      <Typography variant="body-14" textColor="textSecondary" className="font-medium">
        User has not visited any other pages
      </Typography>
    </div>
  </div>
);

const ActivityIcon = () => (
  <div className="relative flex items-center justify-center">
    <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-2 ring-2 ring-blue-200/50 transition-all duration-300 hover:ring-blue-300/60">
      <Eye size={16} className="text-white" />
    </div>
  </div>
);

const ActivityContent = ({ browsedUrl, isFirst }: { browsedUrl: BrowsedUrl; isFirst: boolean }) => (
  <div className="flex w-full flex-col gap-2">
    <Typography
      variant="body-14"
      textColor="default"
      className={cn('break-words font-medium leading-relaxed', {
        'text-gray-900': isFirst,
        'text-gray-700': !isFirst,
      })}
    >
      {browsedUrl.url}
    </Typography>
    {browsedUrl.timestamp && (
      <Typography variant="caption-12-normal" textColor="gray500" className="font-medium text-gray-500">
        {DateUtil.formatDateTime(new Date(browsedUrl.timestamp).toISOString())}
      </Typography>
    )}
  </div>
);

const UserActivity = ({ browsedUrls }: UserActivityProps) => {
  const renderActivityItem = (browsedUrl: BrowsedUrl, index: number) => {
    const isFirst = index === 0;
    const isLast = index === browsedUrls.length - 1;

    const containerClasses = cn(
      'relative transform overflow-hidden rounded-2xl border-2 ring-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]',
      {
        'border-blue-200/70 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 ring-blue-100/50 hover:border-blue-400/80 hover:ring-blue-200/60':
          isFirst,
        'border-gray-200/70 bg-gradient-to-br from-white to-gray-50/50 p-5 ring-gray-100/50 hover:border-gray-400/80 hover:ring-gray-200/60':
          !isFirst,
      },
    );

    return (
      <div className="group relative">
        <div className={containerClasses}>
          {isFirst && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          )}

          <div className="relative z-10">
            <OverviewDataItem
              label={isFirst ? 'User Viewing' : ''}
              icon={isFirst ? <ActivityIcon /> : null}
              value={browsedUrl.url}
              renderValue={() => <ActivityContent browsedUrl={browsedUrl} isFirst={isFirst} />}
            />
          </div>
        </div>

        {!isLast && (
          <div className="mt-3 flex flex-col items-center">
            <ArrowUpIcon />
          </div>
        )}
      </div>
    );
  };

  if (browsedUrls.length === 0) {
    return <EmptyActivityState />;
  }

  return <div className="flex flex-col gap-4">{browsedUrls.map(renderActivityItem)}</div>;
};

export default UserActivity;
