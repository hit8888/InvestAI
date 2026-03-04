import { ScanEye } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Typography from '@breakout/design-system/components/Typography/index';
import ArrowUpIcon from '@breakout/design-system/components/icons/arrow-up-icon';
import { cn } from '@breakout/design-system/lib/cn';
import useWebpagesScreenshotsQuery from '../../queries/query/useWebpagesScreenshotsQuery';
import { BrowsedUrl } from '@neuraltrade/core/types/common';
import { useMemo, useState, useEffect } from 'react';
import BrowsingHistoryLoading from '../../pages/VisitorsPage/components/CompanyDetailsDrawer/BrowsingHistoryLoading';

type BrowsedUrlsPreviewProps = {
  browsedUrls: BrowsedUrl[];
  isRealTime?: boolean;
  isLoading?: boolean;
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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset loaded state when screenshot URL changes
  useEffect(() => {
    setImageLoaded(false);
  }, [screenshotUrl]);

  if (screenshotUrl) {
    return (
      <div className="relative aspect-video w-full">
        {/* Placeholder box with border - shown until image loads */}
        {!imageLoaded && <div className="absolute inset-0 rounded border border-gray-200 bg-gray-50" />}
        {/* Actual image - hidden until loaded, then fades in */}
        <img
          src={screenshotUrl}
          alt="Webpage Screenshot"
          className={cn(
            'h-full w-full rounded transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    );
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

const BrowsedUrlsPreview = ({ browsedUrls, isRealTime = false, isLoading = false }: BrowsedUrlsPreviewProps) => {
  const {
    data: webpagesScreenshotsData,
    isLoading: isLoadingScreenshots,
    isFetching: isFetchingScreenshots,
    isSuccess: isQuerySuccess,
  } = useWebpagesScreenshotsQuery(
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

  // Show loader if parent data is loading, or if screenshots are loading/fetching
  // or if we have browsedUrls but query hasn't completed yet
  const shouldShowLoader =
    isLoading || isLoadingScreenshots || isFetchingScreenshots || (browsedUrls.length > 0 && !isQuerySuccess);

  // Only show "not available" if we truly have no browsed URLs (and not loading)
  if (browsedUrls.length === 0 && !shouldShowLoader) {
    return <EmptyActivityState message="Browsing history not available" />;
  }

  return (
    <AnimatePresence mode="wait">
      {shouldShowLoader ? (
        <motion.div
          key="browsing-history-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <BrowsingHistoryLoading />
        </motion.div>
      ) : (
        <motion.div
          key="browsing-history-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-4"
        >
          {browsedUrlsWithScreenshots.map(renderActivityItem)}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrowsedUrlsPreview;
