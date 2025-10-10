import { ScanEye } from 'lucide-react';

import Typography from '@breakout/design-system/components/Typography/index';
import ArrowUpIcon from '@breakout/design-system/components/icons/arrow-up-icon';
import { cn } from '@breakout/design-system/lib/cn';
import useWebpagesScreenshotsQuery from '../../queries/query/useWebpagesScreenshotsQuery';
import { BrowsedUrl } from '@meaku/core/types/common';
import { useMemo } from 'react';

type BrowsedUrlsPreviewProps = {
  browsedUrls: BrowsedUrl[];
  isRealTime?: boolean;
};

type BrowsedUrlWithScreenshot = BrowsedUrl & {
  screenshotUrl: string | null;
};

type EmptyActivityStateProps = {
  className?: string;
  message: string;
};

type BrowsedUrlScreenShotProps = {
  screenshotUrl: string | null;
};

type BrowsedUrlPreviewItemProps = {
  browsedUrl: BrowsedUrlWithScreenshot;
  isFirst: boolean;
  isRealTime: boolean;
};

const EmptyActivityState = ({ className, message }: EmptyActivityStateProps) => (
  <div className={cn('flex h-full flex-col items-center justify-center', className)}>
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 ring-2 ring-blue-200/50 transition-all duration-300">
      <ScanEye size={20} className="text-white" />
    </div>
    <Typography variant="body-14" textColor="textSecondary" className="font-medium">
      {message}
    </Typography>
  </div>
);

const BrowsedUrlScreenShot = ({ screenshotUrl }: BrowsedUrlScreenShotProps) => {
  if (screenshotUrl) {
    return <img src={screenshotUrl} alt="Webpage Screenshot" className="h-full max-h-60 w-full rounded object-cover" />;
  }

  return <EmptyActivityState className="aspect-video pt-3" message={'Website preview not available'} />;
};

const BrowsedUrlPreviewItem = ({ browsedUrl, isFirst, isRealTime }: BrowsedUrlPreviewItemProps) => (
  <div
    className={cn('relative flex w-full transform flex-col gap-2 self-center overflow-hidden rounded-2xl border-2', {
      'border-positive-600 ring-positive-100/50': isFirst && isRealTime,
      'w-4/5': !isFirst,
    })}
  >
    <div className="absolute flex w-full items-center gap-2 bg-black/40 p-2 backdrop-blur">
      {isFirst && isRealTime && (
        <>
          <ScanEye size={16} className="text-positive-600" />
          <Typography variant="body-14" className="flex-shrink-0 font-medium text-positive-600">
            User Viewing
          </Typography>
          <div className="h-4 w-px bg-positive-600" />
        </>
      )}
      <Typography variant="body-14" className={'truncate font-medium text-gray-300'}>
        {browsedUrl.url}
      </Typography>
    </div>
    <BrowsedUrlScreenShot screenshotUrl={browsedUrl.screenshotUrl} />
  </div>
);

const BrowsedUrlsPreview = ({ browsedUrls, isRealTime = false }: BrowsedUrlsPreviewProps) => {
  const { data: webpagesScreenshotsData, isLoading: isLoadingScreenshots } = useWebpagesScreenshotsQuery(
    {
      urls: browsedUrls.map((browsedUrl) => browsedUrl.url),
    },
    {
      enabled: !!browsedUrls.length,
    },
  );

  const screenshotsByUrl = useMemo(() => {
    if (!webpagesScreenshotsData?.available_screenshot_webpages) {
      return new Map<string, string | null>();
    }

    return new Map(
      webpagesScreenshotsData.available_screenshot_webpages.map((s) => [s.url, s.screenshot?.public_url ?? null]),
    );
  }, [webpagesScreenshotsData]);

  const browsedUrlsWithScreenshots = browsedUrls.map((browsedUrl) => ({
    ...browsedUrl,
    screenshotUrl: screenshotsByUrl.get(browsedUrl.url) ?? null,
  }));

  const renderActivityItem = (
    browsedUrl: BrowsedUrlWithScreenshot,
    index: number,
    browsedUrlsWithScreenshots: BrowsedUrlWithScreenshot[],
  ) => {
    const isFirst = index === 0;
    const isLast = index === browsedUrlsWithScreenshots.length - 1;

    return (
      <div key={`${browsedUrl.url}-${browsedUrl.timestamp}`} className="flex w-full flex-col items-center">
        <BrowsedUrlPreviewItem browsedUrl={browsedUrl} isFirst={isFirst} isRealTime={isRealTime} />

        {!isLast && (
          <div className="mt-3 flex flex-col items-center">
            <ArrowUpIcon />
          </div>
        )}
      </div>
    );
  };

  if (browsedUrlsWithScreenshots.length === 0) {
    return <EmptyActivityState message="Browsing history not available" />;
  }

  if (isLoadingScreenshots) {
    return <EmptyActivityState message="Loading browsing history..." />;
  }

  return <div className="flex flex-col items-center gap-4">{browsedUrlsWithScreenshots.map(renderActivityItem)}</div>;
};

export default BrowsedUrlsPreview;
